import { Check, CheckCheck, Clock } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

import { formatBubbleTime } from "../_lib/format"

const STATUS_ICON = {
    sending: { icon: Clock, label: "Sending" },
    sent: { icon: Check, label: "Sent" },
    delivered: { icon: CheckCheck, label: "Delivered" },
    read: { icon: CheckCheck, label: "Read" },
}

// Bubble corner shaping. Same-sender consecutive messages tighten the
// inner-side corners so the group reads as one cluster.
function cornerClass(fromSelf, position) {
    if (fromSelf) {
        if (position === "single") return "rounded-2xl"
        if (position === "first") return "rounded-2xl rounded-br-md"
        if (position === "middle") return "rounded-2xl rounded-r-md"
        return "rounded-2xl rounded-tr-md"
    }

    if (position === "single") return "rounded-2xl"
    if (position === "first") return "rounded-2xl rounded-bl-md"
    if (position === "middle") return "rounded-2xl rounded-l-md"
    return "rounded-2xl rounded-tl-md"
}

function MessageBubble({ message, peer, position, showTail }) {
    const { fromSelf, text, sentAt, status } = message
    const isLastInGroup = position === "last" || position === "single"
    const StatusIcon = fromSelf && status ? STATUS_ICON[status] : null

    return (
        <div
            className={cn(
                "flex w-full items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300",
                fromSelf ? "justify-end pl-12" : "justify-start pr-12",
            )}
        >
            {/* Peer avatar — only on the last bubble of a group, keeps space otherwise */}
            {!fromSelf ? (
                <div className="size-7 shrink-0">
                    {showTail ? (
                        <Avatar className="size-7 ring-1 ring-white shadow-sm shadow-fuchsia-900/5">
                            <AvatarImage src={peer.avatar || undefined} alt={peer.name} />
                            <AvatarFallback className="bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-[10px] font-bold text-white">
                                {getInitials(peer.name)}
                            </AvatarFallback>
                        </Avatar>
                    ) : null}
                </div>
            ) : null}

            <div
                className={cn(
                    "flex max-w-[78%] min-w-0 flex-col gap-1",
                    fromSelf ? "items-end" : "items-start",
                )}
            >
                <div
                    className={cn(
                        "px-3.5 py-2 text-[14.5px] leading-relaxed shadow-sm transition-shadow",
                        cornerClass(fromSelf, position),
                        fromSelf
                            ? "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-fuchsia-900/20"
                            : "bg-gray-100 text-gray-900 shadow-black/5",
                    )}
                >
                    <p className="whitespace-pre-wrap break-words">{text}</p>
                </div>

                {isLastInGroup ? (
                    <div
                        className={cn(
                            "flex items-center gap-1 px-1 text-[10.5px] tabular-nums text-gray-400",
                            fromSelf ? "flex-row-reverse" : "flex-row",
                        )}
                    >
                        <span>{formatBubbleTime(sentAt)}</span>
                        {StatusIcon ? (
                            <span
                                aria-label={StatusIcon.label}
                                className={cn(
                                    "inline-flex items-center",
                                    status === "read" ? "text-fuchsia-500" : "text-gray-400",
                                )}
                            >
                                <StatusIcon.icon className="size-3" />
                            </span>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default MessageBubble
