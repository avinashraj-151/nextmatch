"use client"

import Link from "next/link"
import { MessageCircle, Search, SquarePen, X } from "lucide-react"

import { cn } from "@/lib/utils"

import ConversationRow from "./ConversationRow"

const FILTERS = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
]

function matchesFilter(conversation, filter) {
    if (filter === "unread") return conversation.unreadCount > 0
    if (filter === "online") return conversation.user.online
    return true
}


function ConversationsRail({
    conversations,
    activeId,
    onSelect,
    query,
    filter,
    onFilterChange,
    className,
}) {
    const visible = conversations.filter(function keep(conversation) {
        return matchesFilter(conversation, filter) 
    })

    const hasResults = visible.length > 0

    return (
        <aside
            aria-label="Conversations"
            className={cn(
                "flex h-full flex-col border-r border-gray-100 bg-white",
                className,
            )}
        >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h1 className="text-lg font-bold tracking-tight text-gray-900">
                    Chat
                </h1>
                <Link
                    href="/lists?type=mutual"
                    aria-label="Start a new chat"
                    className="grid size-9 place-items-center rounded-full text-fuchsia-600 transition-colors duration-200 hover:bg-fuchsia-50 hover:text-fuchsia-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                >
                    <SquarePen className="size-4" />
                </Link>
            </header>

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 px-3 py-2.5">
                {FILTERS.map(function renderFilter(option) {
                    const isActive = filter === option.id
                    function handleFilterClick() {
                        onFilterChange(option.id)
                    }

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={handleFilterClick}
                            aria-pressed={isActive}
                            className={cn(
                                "rounded-full px-3 py-1 text-[12px] font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300",
                                isActive
                                    ? "bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-sm shadow-fuchsia-900/25"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
                            )}
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>

            {/* List */}
            <div className="premium-scrollbar flex-1 min-h-0 overflow-y-auto pb-4">
                {hasResults ? (
                    <ul className="divide-y divide-gray-50">
                        {visible.map(function renderRow(conversation) {
                            return (
                                <li key={conversation.id}>
                                    <ConversationRow
                                        conversation={conversation}
                                        isActive={conversation.id === activeId}
                                        onSelect={onSelect}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <span className="grid size-12 place-items-center rounded-full bg-fuchsia-50 text-fuchsia-500 ring-1 ring-fuchsia-100">
                            <MessageCircle className="size-5" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-gray-900">
                                {query ? "No matches found" : "Nothing here yet"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {query
                                    ? "Try a different name or keyword."
                                    : "Switch filters or start a new chat."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default ConversationsRail
