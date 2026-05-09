"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/schemas/auth"
import prisma from "@/lib/prisma"
import {
    emitMessageDelete,
    emitMessageEdit,
    emitMessageNew,
    emitMessageRead,
    emitTyping,
} from "./realtimeEmit"

// ─── mutual match check ───────
const assertMutualMatch = async (sourceUserId, targetUserId) => {
    const both = await prisma.like.findMany({
        where: {
            OR: [
                { sourceUserId, targetUserId },
                { sourceUserId: targetUserId, targetUserId: sourceUserId },
            ],
        },
        select: { sourceUserId: true },
    })
    return both.length === 2
}


// Map a Prisma Message row → the shape the chat UI consumes.
const toUiMessage = (message, currentUserId) => {
    const fromSelf = message.senderId === currentUserId
    const status = fromSelf
        ? message.dateRead
            ? "read"
            : "delivered"
        : undefined

    return {
        id: message.id,
        fromSelf,
        text: message.text,
        sentAt: message.created.toISOString(),
        status,
        edited: Boolean(message.edited),
    }
}

// Map a mutual-match Member + last message → a conversation row for the rail.
const toUiConversation = (member, lastMessage, unreadCount, currentUserId) => ({
    id: `conv_${member.userId}`,
    user: {
        id: member.userId,
        name: member.name,
        avatar: member.image || null,
        online: false,
        lastSeenAt: member.updatedAt?.toISOString?.() ?? null,
        tagline: member.description ?? "",
    },
    matchedAt: member.createdAt?.toISOString?.() ?? null,
    unreadCount,
    isTyping: false,
    messages: lastMessage ? [toUiMessage(lastMessage, currentUserId)] : [],
    _threadLoaded: false,
})

export async function canMessageMember(otherUserId) {
    try {
        const session = await auth()
        const currentUserId = session?.user?.id
        if (!currentUserId) {
            return { canMessage: false, error: "You need to sign in first" }
        }
        if (!otherUserId) {
            return { canMessage: false, error: "No member specified" }
        }
        if (otherUserId === currentUserId) {
            return { canMessage: false, error: "You can't message yourself" }
        }

        const isMutual = await assertMutualMatch(currentUserId, otherUserId)
        if (!isMutual) {
            return {
                canMessage: false,
                error: "Like each other first — chat unlocks once it's a match.",
            }
        }

        return { canMessage: true }
    } catch (error) {
        return { canMessage: false, error: "Something went wrong. Try again." }
    }
}

// Lightweight realtime ping — no DB write. Throttled by the composer to
// at most once every couple of seconds, but we still gate it behind the
// same auth + mutual-match guard as createMessage so a malicious client
// can't flood another user's inbox with typing events.
export async function sendTypingPing(peerId, isTyping) {
    try {
        const session = await auth()
        const senderId = session?.user?.id
        if (!senderId || !peerId || senderId === peerId) return { error: "Unauthorized" }

        const isMutual = await assertMutualMatch(senderId, peerId)
        if (!isMutual) return { error: "Not a mutual match" }

        await emitTyping({ senderId, recipientId: peerId, isTyping })
        return { success: true }
    } catch (error) {
        return { error: "Failed to send typing ping" }
    }
}

export async function createMessage({ recipientId, text }) {
    try {
        const session = await auth()
        const senderId = session?.user?.id
        if (!senderId) return { error: "Unauthorized" }

        const trimmed = typeof text === "string" ? text.trim() : ""
        if (!recipientId) return { error: "Recipient is required" }
        if (!trimmed) return { error: "Message can't be empty" }
        if (senderId === recipientId) {
            return { error: "You cannot send a message to yourself" }
        }

        const recipient = await prisma.member.findUnique({
            where: { userId: recipientId },
            select: { userId: true },
        })
        if (!recipient) return { error: "Recipient not found" }

        const isMutual = await assertMutualMatch(senderId, recipientId)
        if (!isMutual) {
            return { error: "You can only message mutual matches" }
        }

        const message = await prisma.message.create({
            data: {
                text: trimmed,
                senderId,
                recipientId,
            },
        })

        // Push to the recipient's inbox channel. Sender already has the
        // optimistic bubble + this function's return value, so we skip them.
        // We await so the broadcast is in flight before this server action
        // resolves; the REST call is a single fast HTTP round trip.
        await emitMessageNew(recipientId, {
            peerId: senderId,
            message: toUiMessage(message, recipientId),
        })

        revalidatePath("/messages")
        return { success: true, data: toUiMessage(message, senderId) }
    } catch (error) {
        return { error: "Failed to send message" }
    }
}

export async function markConversationRead(otherUserId) {
    try {
        const session = await auth()
        const currentUserId = session?.user?.id
        if (!currentUserId) return { error: "Unauthorized" }
        if (!otherUserId) return { error: "Conversation is required" }

        const readAt = new Date()
        const result = await prisma.message.updateMany({
            where: {
                senderId: otherUserId,
                recipientId: currentUserId,
                dateRead: null,
            },
            data: { dateRead: readAt },
        })

        // Skip the broadcast if nothing changed — opening a chat with no
        // unread messages would otherwise spam the other user's inbox.
        if (result.count > 0) {
            await emitMessageRead({
                readerId: currentUserId,
                otherUserId,
                readAt: readAt.toISOString(),
            })
        }

        return { success: true }
    } catch (error) {
        return { error: "Failed to mark as read" }
    }
}

export async function fetchMutualConversations() {
    try {
        const session = await auth()
        const currentUserId = session?.user?.id
        if (!currentUserId) return { error: "Unauthorized" }


        const outgoing = await prisma.like.findMany({
            where: { sourceUserId: currentUserId },
            select: { targetUserId: true },
        })


        const outgoingIds = outgoing.map((like) => like.targetUserId)
        if (outgoingIds.length === 0) {
            return { success: true, data: [] }
        }

        const incoming = await prisma.like.findMany({
            where: {
                targetUserId: currentUserId,
                sourceUserId: { in: outgoingIds },
            },
            select: { sourceUserId: true },
        })
        const mutualIds = incoming.map((like) => like.sourceUserId)
        if (mutualIds.length === 0) {
            return { success: true, data: [] }
        }

      
        const members = await prisma.member.findMany({
            where: { userId: { in: mutualIds } },
        })

       
        const enriched = await Promise.all(
            members.map(async (member) => {
                const otherUserId = member.userId

                const [lastMessage, unreadCount] = await Promise.all([
                    prisma.message.findFirst({
                        where: {
                            OR: [
                                { senderId: currentUserId, recipientId: otherUserId, senderDeleted: false },
                                { senderId: otherUserId, recipientId: currentUserId, recipientDeleted: false },
                            ],
                        },
                        orderBy: { created: "desc" },
                    }),
                    prisma.message.count({
                        where: {
                            senderId: otherUserId,
                            recipientId: currentUserId,
                            dateRead: null,
                            recipientDeleted: false,
                        },
                    }),
                ])

                return toUiConversation(member, lastMessage, unreadCount, currentUserId)
            }),
        )

        const sorted = enriched.sort((a, b) => {
            const aLast = a.messages[0]?.sentAt
            const bLast = b.messages[0]?.sentAt
            if (aLast && bLast) return aLast < bLast ? 1 : -1
            if (aLast) return -1
            if (bLast) return 1
            return a.user.name.localeCompare(b.user.name)
        })

        return { success: true, data: sorted }
    } catch (error) {
        return { error: "Failed to load conversations" }
    }
}

export async function fetchMessageThread(otherUserId) {
    try {
        const session = await auth()
        const currentUserId = session?.user?.id
        if (!currentUserId) return { error: "Unauthorized" }
        if (!otherUserId) return { error: "Conversation is required" }
        if (otherUserId === currentUserId) {
            return { error: "Invalid conversation" }
        }

        const isMutual = await assertMutualMatch(currentUserId, otherUserId)
        if (!isMutual) {
            return { error: "You can only chat with mutual matches" }
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, recipientId: otherUserId, senderDeleted: false },
                    { senderId: otherUserId, recipientId: currentUserId, recipientDeleted: false },
                ],
            },
            orderBy: { created: "asc" },
        })

        return {
            success: true,
            data: messages.map((message) => toUiMessage(message, currentUserId)),
        }
    } catch (error) {
        return { error: "Failed to load conversation" }
    }
}

export async function editMessage(messageId, text) {
    try {
        const session = await auth()
        const currentUserId = session?.user?.id
        if (!currentUserId) return { error: "Unauthorized" }
        if (!messageId) return { error: "Message is required" }

        const trimmed = typeof text === "string" ? text.trim() : ""
        if (!trimmed) return { error: "Message can't be empty" }

        // Scope the update to the sender so a user can never edit
        // someone else's message even if they know the id.
        const updated = await prisma.message.update({
            where: { id: messageId, senderId: currentUserId },
            data: { text: trimmed, edited: true },
        })

        return { success: true, data: toUiMessage(updated, currentUserId) }
    } catch (error) {
        return { error: "Failed to edit message" }
    }
}

export async function deleteMessage(messageId) {
    try {
        const session = await auth()
        const currentUserId = session?.user?.id
        if (!currentUserId) return { error: "Unauthorized" }
        if (!messageId) return { error: "Message is required" }

        // Soft-delete on the sender side only; recipient still sees it.
        // Scoping by senderId guards against deleting others' messages.
        const deleted = await prisma.message.update({
            where: { id: messageId, senderId: currentUserId },
            data: { senderDeleted: true },
        })

        if (deleted.recipientId) {
            await emitMessageDelete({
                senderId: currentUserId,
                recipientId: deleted.recipientId,
                messageId: deleted.id,
            })
        }

        return { success: true, data: toUiMessage(deleted, currentUserId) }
    } catch (error) {
        return { error: "Failed to delete message" }
    }
}
