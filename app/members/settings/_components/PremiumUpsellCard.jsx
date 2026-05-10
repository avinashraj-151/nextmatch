"use client"

import { Eye, Globe, HeartHandshake, Sparkles, Undo2, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

const PERKS = [
    {
        icon: Eye,
        title: "See who liked you",
        description: "Skip the guessing game — see admirers up front.",
    },
    {
        icon: Zap,
        title: "Unlimited likes",
        description: "Never run out of hearts again.",
    },
    {
        icon: Globe,
        title: "Travel mode",
        description: "Match with people anywhere in the world.",
    },
    {
        icon: Undo2,
        title: "Rewind passes",
        description: "Take back a swipe — everyone deserves a second look.",
    },
]

function PremiumUpsellCard({ id, isPremium = false }) {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-6 relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 p-6 text-white shadow-xl shadow-fuchsia-900/25 sm:p-8"
        >
            {/* Decorative blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <span className="absolute -top-12 -right-10 size-56 rounded-full bg-white/10 blur-3xl" />
                <span className="absolute -bottom-12 -left-10 size-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
                <div className="max-w-md">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur">
                        <Sparkles className="size-3" />
                        {isPremium ? "Your plan" : "Go further"}
                    </span>

                    <h2
                        id={`${id}-title`}
                        className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
                    >
                        {isPremium ? "You're on NextMatch+" : "Upgrade to NextMatch+"}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
                        {isPremium
                            ? "Thank you for supporting the community. Your perks are active across every device you sign in on."
                            : "Unlock the features that turn matches into real conversations — and real connections."}
                    </p>

                    <div className="mt-6 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            className={cn(
                                "group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-3 text-sm font-semibold text-fuchsia-700 outline-none shadow-lg shadow-black/15 transition-all duration-200",
                                "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 active:translate-y-0",
                                "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fuchsia-600",
                            )}
                        >
                            <HeartHandshake className="size-4" />
                            <span>{isPremium ? "Manage subscription" : "Get NextMatch+"}</span>
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-fuchsia-500/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                            />
                        </button>

                        {isPremium ? null : (
                            <p className="text-center text-xs font-medium text-white/80 sm:text-left">
                                Cancel anytime · 7-day free trial
                            </p>
                        )}
                    </div>
                </div>

                {/* Perks list */}
                <ul className="grid w-full grid-cols-1 gap-2.5 sm:max-w-sm sm:grid-cols-2">
                    {PERKS.map(function renderPerk(perk) {
                        const PerkIcon = perk.icon
                        return (
                            <li
                                key={perk.title}
                                className="flex items-start gap-2.5 rounded-xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur"
                            >
                                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/15 text-white ring-1 ring-white/25">
                                    <PerkIcon className="size-3.5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold tracking-tight text-white">
                                        {perk.title}
                                    </p>
                                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/75">
                                        {perk.description}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default PremiumUpsellCard
