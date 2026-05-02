"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, ListChecks, MessageCircleHeart } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { href: "/members", label: "Matches", icon: Heart },
    { href: "/lists", label: "Lists", icon: ListChecks },
    { href: "/messages", label: "Messages", icon: MessageCircleHeart },
]

export default function NavLinks() {
    const pathname = usePathname()

    const isActive = (href) =>
        href === "/" ? pathname === "/" : pathname?.startsWith(href)

    return (
        <ul className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur md:flex">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white/85 transition-all duration-200 outline-none",
                                "hover:bg-white/15 hover:text-white",
                                "focus-visible:ring-2 focus-visible:ring-white/70",
                                active &&
                                    "bg-white text-fuchsia-700 shadow-sm shadow-black/10 hover:bg-white hover:text-fuchsia-700",
                            )}
                        >
                            <Icon className="size-4" />
                            <span>{label}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
