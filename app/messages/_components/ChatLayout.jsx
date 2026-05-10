"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import useInboxChannel from "../_hooks/useInboxChannel"
import usePresence from "../_hooks/usePresence"
import {
    createMessage,
    deleteMessage,
    editMessage,
    fetchMessageThread,
    markConversationRead,
    sendTypingPing,
} from "../_lib/messageAction"
import ChatPanel from "./ChatPanel"
import ConversationsRail from "./ConversationsRail"
import EmptyChatState from "./EmptyChatState"

// Receiver auto-hides the typing dots after this long without a new
// "typing:true" ping. Slightly longer than the sender's throttle window
// so steady typing keeps the indicator on without flicker.
const TYPING_TIMEOUT_MS = 5000

let outgoingCounter = 0

const nextOutgoingId = () => {
    outgoingCounter += 1
    return `tmp_${Date.now()}_${outgoingCounter}`
}

// Pure helpers — keep state updates DRY and easy to read.
const replaceConversation = (conversations, conversationId, transform) =>
    conversations.map((conversation) =>
        conversation.id === conversationId ? transform(conversation) : conversation,
    )

const replaceMessage = (conversation, messageId, transform) => ({
    ...conversation,
    messages: conversation.messages.map((message) =>
        message.id === messageId ? transform(message) : message,
    ),
})

function ChatLayout({ initialConversations, initialActiveId = null }) {
    const [conversations, setConversations] = useState(initialConversations ?? [])
    const [activeId, setActiveId] = useState(initialActiveId)
    const [filter, setFilter] = useState("all")

    // The realtime handler runs outside the render cycle, so it can't
    // close over the latest `activeId` reliably — keep it in a ref.
    const activeIdRef = useRef(activeId)
    activeIdRef.current = activeId

    // One auto-clear timer per conversation, keyed by conversation id.
    // The map lives in a ref so re-renders don't drop pending timers.
    const typingTimersRef = useRef(new Map())

    // Live set of online userIds, sourced from the presence channel.
    const onlineUserIds = usePresence()

    // Splice presence into each conversation's user.online flag without
    // mutating state. Memoized on `conversations` + `onlineUserIds` so
    // the rail + header re-render only when something actually changed.
    const conversationsWithPresence = useMemo(
        () =>
            conversations.map((conversation) => ({
                ...conversation,
                user: {
                    ...conversation.user,
                    online: onlineUserIds.has(conversation.user.id),
                },
            })),
        [conversations, onlineUserIds],
    )

    const activeConversation = useMemo(
        () =>
            conversationsWithPresence.find(
                (conversation) => conversation.id === activeId,
            ) ?? null,
        [conversationsWithPresence, activeId],
    )

    const handleSelect = useCallback((id) => {
        setActiveId(id)
    }, [])

    // Realtime: a peer just sent us a message. Find the matching
    // conversation, dedupe by id (the optimistic-→-persisted swap on
    // the SENDER side never reaches us, but a quick retry could), then
    // either append+mark-read (active) or append+bump unread (inactive).
    const handleIncomingMessage = useCallback(function applyIncoming(payload) {
        const peerId = payload?.peerId
        const message = payload?.message
        if (!peerId || !message?.id) return

        let activeWithPeer = false

        setConversations(function patch(prev) {
            const existing = prev.find((c) => c.user.id === peerId)
            if (!existing) return prev

            if (existing.messages.some((m) => m.id === message.id)) return prev

            activeWithPeer = existing.id === activeIdRef.current

            return replaceConversation(prev, existing.id, function append(c) {
                return {
                    ...c,
                    messages: [...c.messages, message],
                    unreadCount: activeWithPeer ? 0 : (c.unreadCount ?? 0) + 1,
                }
            })
        })

        if (activeWithPeer) {
            markConversationRead(peerId).catch(function ignore() {})
        }
    }, [])

    // Realtime: a message was edited. Merge the changed fields into the
    // matching bubble. Skip if the conversation/message isn't loaded
    // (rail-only summaries can be a few messages behind), and short-
    // circuit when text + edited already match — that's the optimistic
    // self-echo on the originating tab.
    const handleIncomingEdit = useCallback(function applyEdit(payload) {
        const peerId = payload?.peerId
        const message = payload?.message
        if (!peerId || !message?.id) return

        setConversations(function patch(prev) {
            const conv = prev.find((c) => c.user.id === peerId)
            if (!conv) return prev

            const target = conv.messages.find((m) => m.id === message.id)
            if (!target) return prev

            const sameText = target.text === message.text
            const sameEdited = Boolean(target.edited) === Boolean(message.edited)
            if (sameText && sameEdited) return prev

            return replaceConversation(prev, conv.id, function applyToConv(c) {
                return replaceMessage(c, message.id, function merge(existing) {
                    return { ...existing, ...message }
                })
            })
        })
    }, [])

    // Realtime: a message was deleted (sender-side). Remove the bubble.
    // No-op if it's already gone (originating tab's optimistic remove).
    const handleIncomingDelete = useCallback(function applyDelete(payload) {
        const peerId = payload?.peerId
        const messageId = payload?.messageId
        if (!peerId || !messageId) return

        setConversations(function patch(prev) {
            const conv = prev.find((c) => c.user.id === peerId)
            if (!conv) return prev
            if (!conv.messages.some((m) => m.id === messageId)) return prev

            return replaceConversation(prev, conv.id, function applyToConv(c) {
                return { ...c, messages: c.messages.filter((m) => m.id !== messageId) }
            })
        })
    }, [])

    // Realtime: peer just read the messages we sent them. Flip every
    // outgoing "delivered" bubble in that conversation to "read".
    const handleIncomingRead = useCallback(function applyRead(payload) {
        const peerId = payload?.peerId
        if (!peerId) return

        setConversations(function patch(prev) {
            const conv = prev.find((c) => c.user.id === peerId)
            if (!conv) return prev

            const needsUpdate = conv.messages.some(
                (m) => m.fromSelf && m.status === "delivered",
            )
            if (!needsUpdate) return prev

            return replaceConversation(prev, conv.id, function applyToConv(c) {
                return {
                    ...c,
                    messages: c.messages.map((m) =>
                        m.fromSelf && m.status === "delivered"
                            ? { ...m, status: "read" }
                            : m,
                    ),
                }
            })
        })
    }, [])

    // Realtime: peer is (or just stopped) typing. Set the conversation's
    // isTyping flag and arm a 5s timer that flips it back to false if no
    // further "true" pings arrive. Explicit "false" pings clear the flag
    // and timer immediately (sender hit send or cleared the input).
    const handleIncomingTyping = useCallback(function applyTyping(payload) {
        const peerId = payload?.peerId
        const isTyping = Boolean(payload?.isTyping)
        if (!peerId) return

        let conversationId = null

        setConversations(function patch(prev) {
            const conv = prev.find((c) => c.user.id === peerId)
            if (!conv) return prev
            conversationId = conv.id
            if (Boolean(conv.isTyping) === isTyping) return prev

            return replaceConversation(prev, conv.id, function setFlag(c) {
                return { ...c, isTyping }
            })
        })

        if (!conversationId) return

        const timers = typingTimersRef.current
        const existing = timers.get(conversationId)
        if (existing) {
            clearTimeout(existing)
            timers.delete(conversationId)
        }

        if (!isTyping) return

        const timerId = setTimeout(function clearTyping() {
            timers.delete(conversationId)
            setConversations(function patch(prev) {
                const conv = prev.find((c) => c.id === conversationId)
                if (!conv || !conv.isTyping) return prev
                return replaceConversation(prev, conversationId, function unset(c) {
                    return { ...c, isTyping: false }
                })
            })
        }, TYPING_TIMEOUT_MS)
        timers.set(conversationId, timerId)
    }, [])

    // Cancel all pending auto-clear timers when the layout unmounts.
    useEffect(function cleanupTypingTimers() {
        const timers = typingTimersRef.current
        return function teardown() {
            timers.forEach((id) => clearTimeout(id))
            timers.clear()
        }
    }, [])

    useInboxChannel({
        onMessageNew: handleIncomingMessage,
        onMessageEdit: handleIncomingEdit,
        onMessageDelete: handleIncomingDelete,
        onMessageRead: handleIncomingRead,
        onTyping: handleIncomingTyping,
    })

    // Open-side-effects: clear the unread badge, sync dateRead on the server,
    // and lazily hydrate the full thread. Keyed on activeId so it covers both
    // user clicks AND the initial value coming from ?with=<userId>.
    useEffect(function openConversation() {
        if (!activeId) return

        const target = conversations.find((c) => c.id === activeId)
        if (!target) return

        if (target.unreadCount > 0) {
            setConversations((prev) =>
                replaceConversation(prev, activeId, (c) => ({ ...c, unreadCount: 0 })),
            )
            markConversationRead(target.user.id).catch(() => {})
        }

        if (target._threadLoaded) return

        let cancelled = false
        fetchMessageThread(target.user.id).then(function applyThread(result) {
            if (cancelled || !result?.success) return
            setConversations((prev) =>
                replaceConversation(prev, target.id, (c) => ({
                    ...c,
                    messages: result.data,
                    _threadLoaded: true,
                })),
            )
        })

        return () => {
            cancelled = true
        }
        // We intentionally only re-run on activeId. `conversations` is read
        // for the lookup but reacting to its changes would cause the thread
        // to refetch every time a message is sent.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId])

    const handleBack = useCallback(() => {
        setActiveId(null)
    }, [])

    const handleSend = useCallback(
        async (conversationId, text) => {
            const conversation = conversations.find((c) => c.id === conversationId)
            if (!conversation) return

            const tempId = nextOutgoingId()
            const sentAt = new Date().toISOString()

            // Optimistic insert.
            setConversations((prev) =>
                replaceConversation(prev, conversationId, (c) => ({
                    ...c,
                    messages: [
                        ...c.messages,
                        {
                            id: tempId,
                            fromSelf: true,
                            text,
                            sentAt,
                            status: "sending",
                        },
                    ],
                })),
            )

            const result = await createMessage({
                recipientId: conversation.user.id,
                text,
            })

            if (result?.success && result.data) {
                // Swap the temp message for the persisted one.
                setConversations((prev) =>
                    replaceConversation(prev, conversationId, (c) =>
                        replaceMessage(c, tempId, () => ({
                            ...result.data,
                            status: result.data.status ?? "sent",
                        })),
                    ),
                )
                return
            }

            // Mark the optimistic bubble as failed so the user can see it.
            setConversations((prev) =>
                replaceConversation(prev, conversationId, (c) =>
                    replaceMessage(c, tempId, (message) => ({
                        ...message,
                        status: "failed",
                    })),
                ),
            )
        },
        [conversations],
    )

    // Edit a message: optimistically update the bubble's text + edited flag.
    // On server failure, roll back to the previous text. We return the
    // server result to the caller so it can show a toast / keep the editor open.
    const handleEditMessage = useCallback(
        async (conversationId, messageId, nextText) => {
            let previousText = null
            let previousEdited = false

            setConversations((prev) =>
                replaceConversation(prev, conversationId, (c) =>
                    replaceMessage(c, messageId, (message) => {
                        previousText = message.text
                        previousEdited = Boolean(message.edited)
                        return { ...message, text: nextText, edited: true }
                    }),
                ),
            )

            const result = await editMessage(messageId, nextText)

            if (result?.success && result.data) {
                setConversations((prev) =>
                    replaceConversation(prev, conversationId, (c) =>
                        replaceMessage(c, messageId, (message) => ({
                            ...message,
                            ...result.data,
                        })),
                    ),
                )
                return result
            }

            setConversations((prev) =>
                replaceConversation(prev, conversationId, (c) =>
                    replaceMessage(c, messageId, (message) => ({
                        ...message,
                        text: previousText ?? message.text,
                        edited: previousEdited,
                    })),
                ),
            )
            return result
        },
        [],
    )

    // Composer keystroke → fire-and-forget typing ping. The composer
    // throttles, so this is at most a couple of calls per second per peer.
    const handleTypingPing = useCallback(function pingTyping(conversationId, isTyping) {
        const conversation = conversations.find((c) => c.id === conversationId)
        if (!conversation) return
        sendTypingPing(conversation.user.id, isTyping).catch(function ignore() {})
    }, [conversations])

    // Delete a message: optimistically remove it from the thread, restore on failure.
    const handleDeleteMessage = useCallback(
        async (conversationId, messageId) => {
            let removed = null

            setConversations((prev) =>
                replaceConversation(prev, conversationId, (c) => {
                    const index = c.messages.findIndex((m) => m.id === messageId)
                    if (index === -1) return c
                    removed = { index, message: c.messages[index] }
                    return {
                        ...c,
                        messages: c.messages.filter((m) => m.id !== messageId),
                    }
                }),
            )

            const result = await deleteMessage(messageId)

            if (result?.success) return result

            if (removed) {
                setConversations((prev) =>
                    replaceConversation(prev, conversationId, (c) => {
                        const next = c.messages.slice()
                        next.splice(removed.index, 0, removed.message)
                        return { ...c, messages: next }
                    }),
                )
            }
            return result
        },
        [],
    )

    return (
        <main className="flex flex-1 min-h-0 bg-white">
            <ConversationsRail
                conversations={conversationsWithPresence}
                activeId={activeId}
                onSelect={handleSelect}
                filter={filter}
                onFilterChange={setFilter}
                className={cn(
                    "md:w-[340px] md:shrink-0",
                    activeConversation ? "hidden md:flex" : "flex w-full",
                )}
            />

            <div
                className={cn(
                    "flex-1 min-h-0 flex-col",
                    activeConversation ? "flex" : "hidden md:flex",
                )}
            >
                {activeConversation ? (
                    <ChatPanel
                        key={activeConversation.id}
                        conversation={activeConversation}
                        onSend={handleSend}
                        onTyping={handleTypingPing}
                        onEditMessage={handleEditMessage}
                        onDeleteMessage={handleDeleteMessage}
                        onBack={handleBack}
                    />
                ) : (
                    <EmptyChatState />
                )}
            </div>
        </main>
    )
}

export default ChatLayout
