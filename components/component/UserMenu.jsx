"use client"

import { useTransition } from "react"
import Link from "next/link"
import {
    Loader2,
    LogOut,
    Settings,
    UserRound,
} from "lucide-react"

import { cn, getInitials } from "@/lib/utils"
import { signOutUser } from "@/app/actions/authaction"
import { useAvatar } from "@/app/_providers/AvatarProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Account-only entries here. Browse / Lists / Messages live in the top-nav
// pill switcher (NavLinks) — keeping them here would duplicate primary nav.
const NAV_ITEMS = [
    { href: "/members/profile", icon: UserRound, label: "My Profile", color: "text-fuchsia-500" },
    { href: "/members/settings",        icon: Settings,  label: "Settings",   color: "text-gray-400"    },
]

export default function UserMenu({ user }) {
    const [isPending, startTransition] = useTransition()
    const { avatar } = useAvatar()

    const handleSignOut = () => {
        startTransition(async () => {
            await signOutUser()
        })
    }

    const initials = getInitials(user?.name, user?.email)
    const displayName = user?.name || "Member"
    const displayEmail = user?.email || ""
    // Trust the AvatarProvider as the single source of truth.
    // `null` is a meaningful "removed" state — falling back to
    // `user.image` here would mask optimistic removals until
    // router.refresh() finishes propagating the new session.
    const avatarSrc = avatar

    return (
        <DropdownMenu>
            {/* ── Trigger ── */}
            <DropdownMenuTrigger
                aria-label="Open account menu"
                className="group flex items-center gap-2 rounded-full p-0.5 outline-none transition-all duration-200"
            >
                <Avatar className="size-9 ring-2 ring-white/40 transition-all duration-200 group-hover:ring-white/80 group-data-[state=open]:ring-white/80 group-hover:scale-105">
                    {/*
                        Always render AvatarImage so Radix's loading status
                        flips to 'error' when the src is removed — otherwise
                        the fallback never re-appears after photo removal.
                    */}
                    <AvatarImage src={avatarSrc || undefined} alt={displayName} />
                    <AvatarFallback className="bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-xs font-bold text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            {/* ── Content ── */}
            <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-64 overflow-hidden rounded-2xl border-0 p-0 ring-1 ring-black/8 shadow-2xl shadow-fuchsia-900/15 !bg-white"
            >
                {/* ── Gradient header card ── */}
                <div className="relative overflow-hidden px-4 py-4 bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600">
                    {/* decorative blobs */}
                    <div aria-hidden="true" className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/10 blur-2xl" />
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-4 -left-4 size-20 rounded-full bg-white/10 blur-xl" />

                    <div className="relative flex items-center gap-3">
                        <Avatar className="size-12 ring-2 ring-white/50 shadow-lg shadow-black/20">
                            <AvatarImage src={avatarSrc || undefined} alt={displayName} />
                            <AvatarFallback className="bg-white/20 text-base font-bold text-white backdrop-blur">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white leading-tight">
                                {displayName}
                            </p>
                            {displayEmail ? (
                                <p className="truncate text-xs text-white/70 mt-0.5">
                                    {displayEmail}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* ── Nav items ── */}
                <div className="p-1.5 space-y-0.5">
                    {NAV_ITEMS.map(({ href, icon: Icon, label, color }) => (
                        <DropdownMenuItem
                            key={href}
                            asChild
                            className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:bg-fuchsia-50 focus:text-fuchsia-700 group/item"
                        >
                            <Link href={href}>
                                <span className={cn(
                                    "flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-colors group-focus/item:bg-fuchsia-100",
                                )}>
                                    <Icon className={cn("size-3.5 transition-colors group-focus/item:text-fuchsia-600", color)} />
                                </span>
                                {label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </div>

                {/* ── Separator ── */}
                <DropdownMenuSeparator className="mx-3 my-0" />

                {/* ── Sign out ── */}
                <div className="p-1.5">
                    <DropdownMenuItem
                        disabled={isPending}
                        onSelect={(e) => {
                            e.preventDefault()
                            handleSignOut()
                        }}
                        className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors focus:bg-red-50 focus:text-red-600 group/signout"
                    >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-50 transition-colors group-focus/signout:bg-red-100">
                            {isPending
                                ? <Loader2 className="size-3.5 animate-spin text-red-500" />
                                : <LogOut className="size-3.5 text-red-500" />
                            }
                        </span>
                        {isPending ? "Signing out…" : "Sign out"}
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
