import Link from "next/link"
import { Eye, Heart, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const TABS = [
    { id: "source", label: "Liked", icon: Heart },
    { id: "target", label: "Liked you", icon: Eye },
    { id: "mutual", label: "Matches", icon: Sparkles },
]

export default function ListsTab({ activeTab = "source" }) {
    return (
        <nav
            role="tablist"
            aria-label="Connection lists"
            className="inline-flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-full border border-black/5 bg-white/70 p-1 shadow-sm shadow-fuchsia-900/5 backdrop-blur sm:w-auto"
        >
            {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id
                return (
                    <Link
                        key={id}
                        href={`/lists?type=${id}`}
                        role="tab"
                        aria-selected={isActive}
                        scroll={false}
                        className={cn(
                            "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fuchsia-500/60",
                            isActive
                                ? "bg-white text-gray-900 shadow-md shadow-fuchsia-900/10 ring-1 ring-fuchsia-100"
                                : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                        )}
                    >
                        <Icon
                            aria-hidden="true"
                            className={cn(
                                "size-4 transition-colors duration-300",
                                isActive
                                    ? "text-fuchsia-600"
                                    : "text-gray-400 group-hover:text-gray-700"
                            )}
                        />
                        <span
                            className={cn(
                                "transition-colors duration-300",
                                isActive
                                    ? "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent"
                                    : ""
                            )}
                        >
                            {label}
                        </span>
                    </Link>
                )
            })}
        </nav>
    )
}
