"use client"

import { useCallback, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

import { MOCK_CONVERSATIONS } from "../_lib/mockConversations"
import ChatPanel from "./ChatPanel"
import ConversationsRail from "./ConversationsRail"
import EmptyChatState from "./EmptyChatState"

let outgoingCounter = 0

function nextOutgoingId() {
    outgoingCounter += 1
    return `out_${Date.now()}_${outgoingCounter}`
}

// Optimistic status progression timing — feels real without being slow.
const STATUS_PROGRESSION = [
    { status: "sent", delayMs: 220 },
    { status: "delivered", delayMs: 800 },
    { status: "read", delayMs: 1700 },
]

function ChatLayout() {
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
    const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0]?.id ?? null)
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState("all")

    const activeConversation = useMemo(function findActive() {
        return conversations.find(function byId(conversation) {
            return conversation.id === activeId
        }) ?? null
    }, [conversations, activeId])

    const handleSelect = useCallback(function selectConversation(id) {
        setActiveId(id)
        // Mark the chosen conversation as read on open.
        setConversations(function markRead(prev) {
            return prev.map(function applyRead(conversation) {
                if (conversation.id === id && conversation.unreadCount > 0) {
                    return { ...conversation, unreadCount: 0 }
                }
                return conversation
            })
        })
    }, [])

    const handleBack = useCallback(function clearActive() {
        setActiveId(null)
    }, [])

    const handleSend = useCallback(function sendMessage(conversationId, text) {
        const messageId = nextOutgoingId()
        const sentAt = new Date().toISOString()

        // Optimistic insert with status: "sending".
        setConversations(function appendOutgoing(prev) {
            return prev.map(function applyOutgoing(conversation) {
                if (conversation.id !== conversationId) return conversation
                return {
                    ...conversation,
                    messages: [
                        ...conversation.messages,
                        {
                            id: messageId,
                            fromSelf: true,
                            text,
                            sentAt,
                            status: "sending",
                        },
                    ],
                }
            })
        })

        // Walk the message through sent → delivered → read so the receipt
        // animates in the way users expect from a real chat client.
        STATUS_PROGRESSION.forEach(function scheduleStatus({ status, delayMs }) {
            setTimeout(function applyStatus() {
                setConversations(function updateStatus(prev) {
                    return prev.map(function applyToConversation(conversation) {
                        if (conversation.id !== conversationId) return conversation
                        return {
                            ...conversation,
                            messages: conversation.messages.map(function applyToMessage(message) {
                                if (message.id !== messageId) return message
                                return { ...message, status }
                            }),
                        }
                    })
                })
            }, delayMs)
        })
    }, [])

    return (
        <main className="flex flex-1 min-h-0 bg-white">
            <ConversationsRail
                conversations={conversations}
                activeId={activeId}
                onSelect={handleSelect}
                query={query}
                onQueryChange={setQuery}
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
