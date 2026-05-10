"use client"

import { Copy, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"

// One small icon button inside the floating toolbar. `destructive` flips
// the hover treatment to rose so Delete reads as a careful action.
function ActionButton({ icon: Icon, label, onClick, destructive }) {
    const handleClick = (event) => {
        event.stopPropagation()
        onClick?.()
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={label}
            title={label}
            className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-gray-500 outline-none transition-all duration-150",
                "hover:scale-110 active:scale-95",
                destructive
                    ? "hover:bg-rose-50 hover:text-rose-600"
                    : "hover:bg-fuchsia-50 hover:text-fuchsia-600",
                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50",
            )}
        >
            <Icon className="size-3.5" />
        </button>
    )
}

// A floating, hover-revealed quick-actions toolbar that sits above a message
// bubble. Inline icons (no dropdown) make the actions reachable in one click
// and visually lighter than a chip-plus-menu combo.
function MessageActionsMenu({ fromSelf, onCopy, onEdit, onDelete }) {
    return (
        <div
            role="toolbar"
            aria-label="Message actions"
            className={cn(
                "flex items-center gap-0.5 rounded-full bg-white p-1 ring-1 ring-gray-200/70 shadow-md shadow-fuchsia-900/10",
                "opacity-0 translate-y-1 scale-95",
                "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100",
                "focus-within:opacity-100 focus-within:translate-y-0 focus-within:scale-100",
                "transition-all duration-200 ease-out",
            )}
        >
            <ActionButton icon={Copy} label="Copy" onClick={onCopy} />

            {fromSelf && onEdit ? (
                <ActionButton icon={Pencil} label="Edit" onClick={onEdit} />
            ) : null}

            {fromSelf && onDelete ? (
                <ActionButton
                    icon={Trash2}
                    label="Delete"
                    onClick={onDelete}
                    destructive
                />
            ) : null}
        </div>
    )
}

export default MessageActionsMenu
