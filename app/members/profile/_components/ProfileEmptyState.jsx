import Link from "next/link"
import { Pencil, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const ProfileEmptyState = ({
    message = "We couldn't load your profile right now.",
    ctaHref = "/members/profile/edit",
    ctaLabel = "Complete your profile",
}) => (
    <section
        aria-live="polite"
        className="relative overflow-hidden rounded-3xl border border-dashed border-fuchsia-200 bg-white/70 p-10 text-center shadow-sm shadow-fuchsia-900/5 backdrop-blur"
    >
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 size-56 -translate-x-1/2 rounded-full bg-fuchsia-200/40 blur-3xl"
        />
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/20">
            <Sparkles className="size-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-900">
            Let&apos;s set up your profile
        </h2>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
        <Link
            href={ctaHref}
            className={cn(
                "group/cta mt-6 inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white outline-none",
                "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                "shadow-lg shadow-fuchsia-900/20 transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/25",
                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
            )}
        >
            <Pencil className="size-4" />
            {ctaLabel}
        </Link>
    </section>
)

export default ProfileEmptyState
