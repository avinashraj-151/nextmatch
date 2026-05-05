"use client"

import { ArrowLeft } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

import { formatPresence } from "../_lib/format"
import PresenceDot from "./PresenceDot"

function ChatPanelHeader({ conversation, onBack }) {
    const { user } = conversation

    return (
        <header className="flex items-center gap-3 border-b border-gray-100 bg-white/85 px-3 py-3 backdrop-blur-md sm:px-4">
            {/* Back button — visible only on mobile, where the rail is hidden */}
            <button
                type="button"
                onClick={onBack}
                aria-label="Back to conversations"
                className="grid size-9 shrink-0 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 md:hidden"
            >
                <ArrowLeft className="size-4" />
            </button>

            <div className="relative shrink-0">
                <Avatar className="size-10 ring-2 ring-white shadow-sm shadow-fuchsia-900/5">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback className="bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-xs font-bold text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <PresenceDot online={user.online} size="sm" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold tracking-tight text-gray-900">
                    {user.name}
                </p>
                <p
                    className={cn(
                        "truncate text-[11.5px]",
                        user.online ? "font-medium text-emerald-600" : "text-gray-500",
                    )}
                >
                    {formatPresence(user)}
                </p>
            </div>
        </header>
    )
}

export default ChatPanelHeader
