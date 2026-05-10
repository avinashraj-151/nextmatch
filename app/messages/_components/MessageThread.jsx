"use client"

import { useEffect, useMemo, useRef } from "react"
import { format } from "date-fns"
import { Sparkles } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

import { dayKey, formatDateDivider } from "../_lib/format"
import MessageBubble from "./MessageBubble"

const GROUP_GAP_MS = 6 * 60 * 1000 // 6 minutes — gap that breaks a "burst"

// Walk messages in order and decide each bubble's position within its group.
// A group is the same sender within GROUP_GAP_MS of the previous message.
function annotatePositions(messages) {
    return messages.map(function annotate(message, index) {
        const prev = messages[index - 1]
        const next = messages[index + 1]
        const prevDay = prev ? dayKey(prev.sentAt) : null
        const nextDay = next ? dayKey(next.sentAt) : null
        const thisDay = dayKey(message.sentAt)

        const sameAsPrev =
            prev &&
            prev.fromSelf === message.fromSelf &&
            prevDay === thisDay &&
            new Date(message.sentAt) - new Date(prev.sentAt) <= GROUP_GAP_MS

        const sameAsNext =
            next &&
            next.fromSelf === message.fromSelf &&
            nextDay === thisDay &&
            new Date(next.sentAt) - new Date(message.sentAt) <= GROUP_GAP_MS

        let position
        if (!sameAsPrev && !sameAsNext) position = "single"
        else if (!sameAsPrev && sameAsNext) position = "first"
        else if (sameAsPrev && sameAsNext) position = "middle"
        else position = "last"

        return { ...message, _position: position }
    })
}

function buildItems(messages) {
    const annotated = annotatePositions(messages)
    const items = []
    let currentDay = null

    annotated.forEach(function appendItem(message) {
        const day = dayKey(message.sentAt)
        if (day !== currentDay) {
            items.push({ kind: "divider", id: `div_${day}`, sentAt: message.sentAt })
            currentDay = day
        }
        items.push({ kind: "bubble", id: message.id, message })
    })

    return items
}

function TypingIndicator({ peer }) {
    return (
        <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <Avatar className="size-7 ring-1 ring-white shadow-sm shadow-fuchsia-900/5">
                <AvatarImage src={peer.avatar || undefined} alt={peer.name} />
                <AvatarFallback className="bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-[10px] font-bold text-white">
                    {getInitials(peer.name)}
                </AvatarFallback>
            </Avatar>
            <div className="rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2.5 shadow-sm shadow-black/5">
                <span className="sr-only">{peer.name} is typing</span>
                <span aria-hidden="true" className="flex items-center gap-1">
                    {[0, 1, 2].map(function renderDot(i) {
                        return (
                            <span
                                key={i}
                                style={{ animationDelay: `${i * 0.15}s` }}
                                className={cn(
                                    "size-1.5 rounded-full animate-bounce",
                                    i === 0 && "bg-rose-500",
                                    i === 1 && "bg-fuchsia-600",
                                    i === 2 && "bg-violet-600",
                                )}
                            />
                        )
                    })}
                </span>
            </div>
        </div>
    )
}


function DateDivider({ sentAt }) {
    return (
        <div role="separator" className="my-3 flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px flex-1 max-w-12 bg-gray-200/70" />
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {formatDateDivider(sentAt)}
            </span>
            <span aria-hidden="true" className="h-px flex-1 max-w-12 bg-gray-200/70" />
        </div>
    )
}

function MessageThread({ conversation, onEditMessage, onDeleteMessage }) {
    const { messages, user, isTyping } = conversation
    const scrollerRef = useRef(null)
    const items = useMemo(function memoItems() { return buildItems(messages) }, [messages])

    // Auto-scroll to bottom on new messages or typing-state change.
    useEffect(function scrollToBottom() {
        const el = scrollerRef.current
        if (!el) return
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }, [messages.length, isTyping])

    return (
        <div
            ref={scrollerRef}
            className="premium-scrollbar relative flex-1 min-h-0 overflow-y-auto bg-linear-to-b from-fuchsia-50/30 via-white to-white"
        >
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-1.5 px-4 py-6 sm:px-6">
                {/* <MatchPill matchedAt={matchedAt} peerName={user.name} /> */}

                {items.map(function renderItem(item) {
                    if (item.kind === "divider") {
                        return <DateDivider key={item.id} sentAt={item.sentAt} />
                    }

                    return (
                        <MessageBubble
                            key={item.id}
                            message={item.message}
                            peer={user}
                            position={item.message._position}
                            showTail={
                                item.message._position === "last" ||
                                item.message._position === "single"
                            }
                            onEdit={onEditMessage}
                            onDelete={onDeleteMessage}
                        />
                    )
                })}

                {isTyping ? <TypingIndicator peer={user} /> : null}
            </div>
        </div>
    )
}

export default MessageThread
