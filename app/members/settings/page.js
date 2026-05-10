import { Settings } from "lucide-react"

import { auth } from "@/lib/schemas/auth"

import SettingsView from "./_components/SettingsView"

export const metadata = {
    title: "Settings — NextMatch",
    description: "Tune your discovery, notifications, privacy, and more.",
}

async function SettingsPage() {
    const session = await auth()
    const email = session?.user?.email ?? "you@nextmatch.app"
    const isPremium = false

    return (
        <main className="relative isolate min-h-full">
            {/* ── Soft gradient sky chrome (matches the rest of the app) ── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
            />

            {/* ── Decorative backdrop blobs ── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] overflow-hidden"
            >
                <span className="absolute -left-16 top-10 size-72 rounded-full bg-rose-200/40 blur-3xl" />
                <span className="absolute -right-12 top-24 size-72 rounded-full bg-violet-200/40 blur-3xl" />
                <span className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/30 blur-3xl" />
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                {/* ── Header ── */}
                <header>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-200/70 shadow-sm shadow-fuchsia-900/5 backdrop-blur">
                        <Settings className="size-3" />
                        Account · Settings
                    </span>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                            Settings
                        </span>
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
                        Tune NextMatch to feel like yours. Everything you change here updates instantly.
                    </p>
                </header>

                <SettingsView email={email} isPremium={isPremium} />
            </div>
        </main>
    )
}

export default SettingsPage
