"use client"

import { useTransition } from "react"
import Link from "next/link"
import {
    Heart,
    LogOut,
    MessageCircleHeart,
    Settings,
    UserRound,
} from "lucide-react"

import { cn, getInitials } from "@/lib/utils"
import { signOutUser } from "@/app/actions/authaction"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserMenu({ user }) {
    const [isPending, startTransition] = useTransition()

    const handleSignOut = () => {
        startTransition(async () => {
            await signOutUser()
        })
    }

    const initials = getInitials(user?.name, user?.email)
    const displayName = user?.name || "Member"
    const displayEmail = user?.email || ""

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open account menu"
                className={cn(
                    "group flex items-center gap-2 rounded-full p-1 outline-none",
                    "transition-all duration-200",
                )}
            >
                <Avatar className="size-8 ring-2 ring-white/30 transition-all duration-200 group-hover:ring-white/70 group-data-[state=open]:ring-white/70">
                    {user?.image ? (
                        <AvatarImage src={user.image} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-white text-xs font-bold text-fuchsia-700 shadow-sm">
                        {initials}
                    </AvatarFallback>
                </Avatar>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-2xl border-0 p-1.5 ring-1 ring-black/5 shadow-2xl shadow-fuchsia-900/15 backdrop-blur"
            >
                <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-10 border-0">
                            {user?.image ? (
                                <AvatarImage
                                    src={user.image}
                                    alt={displayName}
                                />
                            ) : null}
                            <AvatarFallback className="bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-sm font-bold text-white shadow-sm">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                                {displayName}
                            </p>
                            {displayEmail ? (
                                <p className="truncate text-xs font-normal text-gray-500">
                                    {displayEmail}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-gray-700 focus:bg-fuchsia-50 focus:text-fuchsia-700"
                >
                    <Link href="/members/profile">
                        <UserRound className="size-4 text-gray-500 group-focus/dropdown-menu-item:text-fuchsia-600" />
                        My profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-gray-700 focus:bg-fuchsia-50 focus:text-fuchsia-700"
                >
                    <Link href="/lists">
                        <Heart className="size-4 text-gray-500 group-focus/dropdown-menu-item:text-fuchsia-600" />
                        My matches
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-gray-700 focus:bg-fuchsia-50 focus:text-fuchsia-700"
                >
                    <Link href="/messages">
                        <MessageCircleHeart className="size-4 text-gray-500 group-focus/dropdown-menu-item:text-fuchsia-600" />
                        Messages
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-gray-700 focus:bg-fuchsia-50 focus:text-fuchsia-700"
                >
                    <Link href="/settings">
                        <Settings className="size-4 text-gray-500 group-focus/dropdown-menu-item:text-fuchsia-600" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                    variant="destructive"
                    disabled={isPending}
                    onSelect={(event) => {
                        event.preventDefault()
                        handleSignOut()
                    }}
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm"
                >
                    <LogOut className="size-4" />
                    {isPending ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
