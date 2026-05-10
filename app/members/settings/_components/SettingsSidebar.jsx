"use client"

import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function SettingsSidebar({ items, activeId, onSelect }) {
    function activeIndex() {
        return items.findIndex(function byId(item) {
            return item.id === activeId
        })
    }

    function handleKeyDown(event) {
        const idx = activeIndex()
        if (idx < 0) return

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault()
            const nextIdx = (idx + 1) % items.length
            onSelect(items[nextIdx].id)
            return
        }

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault()
            const prevIdx = (idx - 1 + items.length) % items.length
            onSelect(items[prevIdx].id)
            return
        }

        if (event.key === "Home") {
            event.preventDefault()
            onSelect(items[0].id)
            return
        }

        if (event.key === "End") {
            event.preventDefault()
            onSelect(items[items.length - 1].id)
        }
    }

    return (
        <nav aria-label="Settings sections">
            <div
                role="tablist"
                aria-orientation="vertical"
                onKeyDown={handleKeyDown}
                className="flex w-full gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0"
            >
                {items.map(function renderItem(item) {
                    const Icon = item.icon
                    const isActive = item.id === activeId
                    const isPremium = item.tone === "premium"
                    const isDanger = item.tone === "danger"

                    function handleClick() {
                        onSelect(item.id)
                    }

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            id={`${item.id}-tab`}
                            aria-selected={isActive}
                            aria-controls={`${item.id}-panel`}
                            tabIndex={isActive ? 0 : -1}
                            onClick={handleClick}
                            className={cn(
                                "group/nav flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium outline-none transition-all duration-200 lg:shrink",
                                "focus-visible:ring-2 focus-visible:ring-fuchsia-300",
                                isActive
                                    ? isPremium
                                        ? "bg-fuchsia-50 font-semibold text-fuchsia-700 shadow-sm shadow-fuchsia-900/5 ring-1 ring-fuchsia-100"
                                        : isDanger
                                            ? "bg-rose-50 font-semibold text-rose-600 shadow-sm shadow-rose-900/5 ring-1 ring-rose-100"
                                            : "bg-fuchsia-50/80 font-semibold text-fuchsia-700 shadow-sm shadow-fuchsia-900/5 ring-1 ring-fuchsia-100"
                                    : isPremium
                                        ? "text-fuchsia-700 hover:bg-fuchsia-50"
                                        : isDanger
                                            ? "text-rose-600 hover:bg-rose-50"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            )}
                        >
                            <span
                                className={cn(
                                    "grid size-7 shrink-0 place-items-center rounded-lg transition-all duration-200",
                                    isActive
                                        ? isDanger
                                            ? "bg-linear-to-br from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-900/30 ring-2 ring-white"
                                            : "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-sm shadow-fuchsia-900/30 ring-2 ring-white"
                                        : isPremium
                                            ? "bg-linear-to-br from-rose-50 via-fuchsia-50 to-violet-50 text-fuchsia-600 ring-1 ring-fuchsia-100"
                                            : isDanger
                                                ? "bg-rose-50 text-rose-500 ring-1 ring-rose-100"
                                                : "bg-gray-50 text-gray-500 ring-1 ring-gray-100 group-hover/nav:bg-fuchsia-50 group-hover/nav:text-fuchsia-600 group-hover/nav:ring-fuchsia-100",
                                )}
                            >
                                <Icon className="size-3.5" />
                            </span>

                            <span className="flex-1 text-left">{item.label}</span>

                            <ChevronRight
                                aria-hidden="true"
                                className={cn(
                                    "hidden size-3.5 transition-all duration-200 lg:block",
                                    isActive
                                        ? "translate-x-0 text-fuchsia-500"
                                        : "text-gray-300 group-hover/nav:translate-x-0.5 group-hover/nav:text-gray-400",
                                    isActive && isDanger && "text-rose-500",
                                    !isActive && isDanger && "group-hover/nav:text-rose-400",
                                )}
                            />
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

export default SettingsSidebar
