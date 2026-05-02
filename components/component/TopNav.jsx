import Link from "next/link"
import { Swords } from "lucide-react"

import { auth } from "@/lib/schemas/auth"
import NavLinks from "@/components/component/NavLinks"
import UserMenu from "@/components/component/UserMenu"

export default async function TopNav() {
    const session = await auth()
    const isAuthenticated = Boolean(session?.user)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 shadow-lg shadow-fuchsia-900/20">
            <nav
                aria-label="Primary"
                className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
            >
                <Link
                    href="/"
                    aria-label="NextMatch home"
                    className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fuchsia-700"
                >
                    <span className="grid size-9 place-items-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:ring-white/40">
                        <Swords className="size-5 text-white drop-shadow" />
                    </span>
                    <span className="flex items-baseline text-2xl font-extrabold tracking-tight">
                        <span className="text-gray-900">Next</span>
                        <span className="text-gray-200">Match</span>
                    </span>
                </Link>

                <NavLinks />

                <div className="flex items-center gap-2 sm:gap-3">
                    {isAuthenticated ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden rounded-full px-4 py-1.5 text-sm font-medium text-white/85 transition-colors duration-200 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 sm:inline-flex"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-fuchsia-700 shadow-md shadow-rose-950/20 transition-all duration-200 outline-none hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-lg active:translate-y-0 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fuchsia-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}
