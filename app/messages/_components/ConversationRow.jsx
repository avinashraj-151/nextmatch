"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

import { formatRelativeShort } from "../_lib/format"
import PresenceDot from "./PresenceDot"

function buildPreview({ messages, isTyping }) {
    if (isTyping) return { text: "Typing…", isTyping: true, fromSelf: false }

    const last = messages[messages.length - 1]
    if (!last) return { text: "Say hi 👋", isTyping: false, fromSelf: false }

    return {
        text: last.text,
        isTyping: false,
        fromSelf: last.fromSelf,
    }
}

function ConversationRow({ conversation, isActive, onSelect }) {
    const { id, user, messages, unreadCount, isTyping } = conversation
    const last = messages[messages.length - 1]
    const preview = buildPreview({ messages, isTyping })
    const initials = getInitials(user.name)
    const hasUnread = unreadCount > 0

    function handleClick() {
        onSelect(id)
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-current={isActive ? "true" : undefined}
            className={cn(
                "group relative flex w-full items-center gap-3 px-3 py-3 text-left outline-none transition-colors",
                "focus-visible:bg-fuchsia-50/70",
                isActive
                    ? "bg-fuchsia-50/70"
                    : "hover:bg-gray-50",
            )}
        >
            {/* Active-row brand stripe */}
            <span
                aria-hidden="true"
                className={cn(
                    "absolute inset-y-2 left-0 w-1 rounded-r-full bg-linear-to-b from-rose-500 via-fuchsia-600 to-violet-600 transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                )}
            />

            <div className="relative shrink-0">
                <Avatar className="size-12 ring-2 ring-white shadow-sm shadow-fuchsia-900/5">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback className="bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-sm font-bold text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <PresenceDot online={user.online} size="sm" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                    <p
                        className={cn(
                            "truncate text-sm tracking-tight",
                            hasUnread ? "font-bold text-gray-900" : "font-semibold text-gray-900",
                        )}
                    >
                        {user.name}
                    </p>
                    {last ? (
                        <span
                            className={cn(
                                "ml-auto shrink-0 text-[11px] tabular-nums",
                                hasUnread ? "font-semibold text-fuchsia-600" : "text-gray-400",
                            )}
                        >
                            {formatRelativeShort(last.sentAt)}
                        </span>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            "min-w-0 flex-1 truncate text-xs",
                            preview.isTyping
                                ? "font-semibold text-fuchsia-600"
                                : hasUnread
                                    ? "font-medium text-gray-700"
                                    : "text-gray-500",
                        )}
                    >
                        {!preview.isTyping && preview.fromSelf ? (
                            <span className="text-gray-400">You: </span>
                        ) : null}
                        {preview.text}
                    </p>

                    {hasUnread ? (
                        <span
                            aria-label={`${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`}
                            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 px-1.5 text-[10px] font-bold text-white shadow-md shadow-fuchsia-900/25"
                        >
                            {unreadCount}
                        </span>
                    ) : null}
                </div>
            </div>
        </button>
    )
}

export default ConversationRow
