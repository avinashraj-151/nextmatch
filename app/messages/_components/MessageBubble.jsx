"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Check, CheckCheck, Clock, Pencil, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

import { formatBubbleTime } from "../_lib/format"
import MessageActionsMenu from "./MessageActionsMenu"

const STATUS_ICON = {
    sending: { icon: Clock, label: "Sending" },
    sent: { icon: Check, label: "Sent" },
    delivered: { icon: CheckCheck, label: "Delivered" },
    read: { icon: CheckCheck, label: "Read" },
    failed: { icon: AlertCircle, label: "Not sent — tap to retry" },
}

// Bubble corner shaping. Same-sender consecutive messages tighten the
// inner-side corners so the group reads as one cluster.
const cornerClass = (fromSelf, position) => {
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

// Optimistic / pending bubbles get a temp id like `tmp_…`. We don't expose
// the actions menu on those — there's no server message to mutate yet.
const isPersistedId = (id) => typeof id === "string" && !id.startsWith("tmp_")

function MessageBubble({ message, peer, position, showTail, onEdit, onDelete }) {
    const { id, fromSelf, text, sentAt, status, edited } = message
    const isLastInGroup = position === "last" || position === "single"
    const StatusIcon = fromSelf && status ? STATUS_ICON[status] : null

    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(text)
    const editorRef = useRef(null)

    // Focus + place cursor at end whenever we enter edit mode.
    useEffect(
        function focusEditor() {
            if (!isEditing) return
            const el = editorRef.current
            if (!el) return
            el.focus()
            const len = el.value.length
            el.setSelectionRange(len, len)
        },
        [isEditing],
    )

    // Auto-grow the inline editor — mirrors the composer's behavior so the
    // bubble breathes naturally as the draft gets longer.
    useEffect(
        function autoGrow() {
            if (!isEditing) return
            const el = editorRef.current
            if (!el) return
            el.style.height = "auto"
            el.style.height = `${Math.min(el.scrollHeight, 200)}px`
        },
        [isEditing, draft],
    )

    // Keep draft in sync when the underlying message changes (e.g. server
    // confirms an edit while the editor is closed).
    useEffect(
        function syncDraft() {
            if (!isEditing) setDraft(text)
        },
        [text, isEditing],
    )

    // Hide the floating actions while editing — it would cover the textarea
    // and "Edit" is already the active mode anyway.
    const canShowMenu =
        !isEditing &&
        Boolean(onEdit || onDelete) &&
        isPersistedId(id) &&
        status !== "sending" &&
        status !== "failed"

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Copied to clipboard")
        } catch {
            toast.error("Couldn't copy message")
        }
    }

    const handleStartEdit = () => setIsEditing(true)

    const handleCancelEdit = () => {
        setDraft(text)
        setIsEditing(false)
    }

    const handleSaveEdit = async () => {
        const next = draft.trim()
        if (!next) {
            toast.error("Message can't be empty")
            return
        }
        if (next === text) {
            setIsEditing(false)
            return
        }
        const result = await onEdit?.(id, next)
        if (result?.error) {
            toast.error(result.error)
            return
        }
        setIsEditing(false)
    }

    const handleEditorKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault()
            handleCancelEdit()
            return
        }
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            handleSaveEdit()
        }
    }

    const handleDelete = async () => {
        const result = await onDelete?.(id)
        if (result?.error) toast.error(result.error)
    }

    return (
        <div
            className={cn(
                "group flex w-full items-end animate-in fade-in slide-in-from-bottom-1 duration-300",
                fromSelf ? "justify-end pl-12" : "justify-start gap-2 pr-12",
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
                {/* Bubble + floating action toolbar live in a relative shell so
                    the toolbar can hover above the bubble without taking layout
                    space. Edge-aligned to the bubble's writing edge for a
                    consistent Slack-style placement. */}
                <div className="relative">
                    {canShowMenu ? (
                        <div
                            className={cn(
                                "absolute bottom-full mb-1.5 z-10 pointer-events-auto",
                                fromSelf ? "right-0" : "left-0",
                            )}
                        >
                            <MessageActionsMenu
                                fromSelf={fromSelf}
                                onCopy={handleCopy}
                                onEdit={fromSelf ? handleStartEdit : undefined}
                                onDelete={fromSelf ? handleDelete : undefined}
                            />
                        </div>
                    ) : null}

                    <div
                        className={cn(
                            "px-3.5 py-2 text-[14.5px] leading-relaxed shadow-sm transition-all duration-200",
                            cornerClass(fromSelf, position),
                            fromSelf
                                ? "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-fuchsia-900/20"
                                : "bg-gray-100 text-gray-900 shadow-black/5",
                            isEditing &&
                                "ring-2 ring-fuchsia-300/80 ring-offset-2 ring-offset-white shadow-md shadow-fuchsia-900/25",
                        )}
                    >
                    {isEditing ? (
                        <textarea
                            ref={editorRef}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            onKeyDown={handleEditorKeyDown}
                            rows={1}
                            placeholder="Edit message…"
                            aria-label="Edit message"
                            className={cn(
                                "block w-full min-w-[200px] resize-none border-0 bg-transparent p-0 text-[14.5px] leading-relaxed outline-none",
                                fromSelf
                                    ? "text-white caret-white placeholder:text-white/70 selection:bg-white/30 selection:text-white"
                                    : "text-gray-900 caret-fuchsia-600 placeholder:text-gray-400 selection:bg-fuchsia-200/70",
                            )}
                        />
                    ) : (
                        <p className="whitespace-pre-wrap break-words">{text}</p>
                    )}
                    </div>
                </div>

                {isEditing ? (
                    <div
                        className={cn(
                            "flex w-full items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200",
                            fromSelf ? "flex-row-reverse" : "flex-row",
                        )}
                    >
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-gray-400">
                            <Pencil className="size-3 text-fuchsia-500" />
                            <span className="hidden sm:inline">Editing</span>
                            <span className="hidden md:inline text-gray-300">·</span>
                            <span className="hidden md:inline">Enter to save · Esc to cancel</span>
                        </span>

                        <div className="ml-auto flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                aria-label="Cancel edit"
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium text-gray-500 outline-none transition hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-300"
                            >
                                <X className="size-3" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                disabled={!draft.trim() || draft.trim() === text}
                                aria-label="Save edit"
                                className="inline-flex items-center gap-1 rounded-full bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 px-3 py-1 text-[11.5px] font-semibold text-white shadow-sm shadow-fuchsia-900/25 outline-none transition hover:shadow-md hover:shadow-fuchsia-900/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
                            >
                                <Check className="size-3" />
                                Save
                            </button>
                        </div>
                    </div>
                ) : isLastInGroup ? (
                    <div
                        className={cn(
                            "flex items-center gap-1 px-1 text-[10.5px] tabular-nums text-gray-400",
                            fromSelf ? "flex-row-reverse" : "flex-row",
                        )}
                    >
                        <span>{formatBubbleTime(sentAt)}</span>
                        {edited ? (
                            <span className="italic text-gray-400">edited</span>
                        ) : null}
                        {StatusIcon ? (
                            <span
                                aria-label={StatusIcon.label}
                                className={cn(
                                    "inline-flex items-center",
                                    status === "read" && "text-fuchsia-500",
                                    status === "failed" && "text-rose-500",
                                    status !== "read" && status !== "failed" && "text-gray-400",
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
