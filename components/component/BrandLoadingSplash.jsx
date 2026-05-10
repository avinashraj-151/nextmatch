import { HeartPulse, Sparkles, Swords } from "lucide-react"

import { cn } from "@/lib/utils"

const DOT_COLORS = ["bg-rose-500", "bg-fuchsia-600", "bg-violet-600"]

// ── Shared bits ────────────────────────────────────────────────────────────
const BouncingDots = () => (
    <div aria-hidden="true" className="flex items-center gap-2">
        {DOT_COLORS.map((color, index) => (
            <span
                key={color}
                style={{ animationDelay: `${index * 0.15}s` }}
                className={cn(
                    "size-2.5 rounded-full animate-bounce",
                    color,
                )}
            />
        ))}
    </div>
)

const ProgressSliver = ({ className }) => (
    <div
        aria-hidden="true"
        className={cn(
            "relative h-1.5 w-64 overflow-hidden rounded-full bg-fuchsia-100/70 ring-1 ring-fuchsia-200/50",
            className,
        )}
    >
        <span className="brand-progress-slide absolute inset-y-0 left-0 w-1/3 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 shadow-md shadow-fuchsia-900/30" />
    </div>
)

// ── Full-page splash ───────────────────────────────────────────────────────
const FullSplash = ({ pillLabel, caption, srLabel }) => (
    <section
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"
    >
        <span className="sr-only">{srLabel}</span>

        {/* Decorative backdrop */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
        >
            <span className="absolute -left-20 top-6 size-72 rounded-full bg-rose-300/30 blur-3xl animate-pulse animation-duration-[6s]" />
            <span className="absolute -right-16 bottom-2 size-80 rounded-full bg-violet-300/30 blur-3xl animate-pulse animation-delay-[0.8s] animation-duration-[7s]" />
            <span className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/35 blur-3xl animate-pulse animation-delay-[0.4s] animation-duration-[5s]" />
        </div>

        <div className="relative flex flex-col items-center gap-8 px-6 py-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Animated logo medallion */}
            <div className="relative grid size-32 place-items-center sm:size-36">
                <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-linear-to-br from-rose-400 via-fuchsia-500 to-violet-600 opacity-50 blur-2xl animate-pulse animation-duration-[2.4s]"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-4 rounded-full bg-fuchsia-400/40 animate-ping animation-duration-[2.4s]"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#f43f5e_0%,#c026d3_35%,#7c3aed_70%,#f43f5e_100%)] animate-spin animation-duration-[4s]"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-[6px] rounded-full bg-white"
                />
                <span className="relative grid size-22 place-items-center rounded-full bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-xl shadow-fuchsia-900/30 ring-4 ring-white sm:size-26">
                    <Swords className="size-9 text-white drop-shadow sm:size-10" />
                </span>
            </div>

            {/* Wordmark + captions */}
            <div className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-200/70 shadow-sm shadow-fuchsia-900/5 backdrop-blur">
                    <Sparkles className="size-3" />
                    {pillLabel}
                </span>

                <h1 className="brand-text-shimmer text-5xl font-extrabold tracking-tight sm:text-6xl">
                    NextMatch
                </h1>

                <p className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600">
                    <HeartPulse className="size-4 text-fuchsia-500 animate-pulse animation-duration-[1.4s]" />
                    {caption}
                </p>
            </div>

            <BouncingDots />
            <ProgressSliver />
        </div>
    </section>
)

// ── Inline (compact) variant for in-page Suspense boundaries ───────────────
const InlineSplash = ({ pillLabel, caption, srLabel }) => (
    <section
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="mt-10 flex flex-col items-center gap-5 px-6 py-12 text-center animate-in fade-in zoom-in-95 duration-300"
    >
        <span className="sr-only">{srLabel}</span>

        {/* Smaller medallion — keeps the brand vocabulary without dominating */}
        <div className="relative grid size-20 place-items-center">
            <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-linear-to-br from-rose-400 via-fuchsia-500 to-violet-600 opacity-40 blur-xl animate-pulse animation-duration-[2.4s]"
            />
            <span
                aria-hidden="true"
                className="absolute inset-2 rounded-full bg-fuchsia-400/40 animate-ping animation-duration-[2.4s]"
            />
            <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#f43f5e_0%,#c026d3_35%,#7c3aed_70%,#f43f5e_100%)] animate-spin animation-duration-[4s]"
            />
            <span
                aria-hidden="true"
                className="absolute inset-[4px] rounded-full bg-white"
            />
            <span className="relative grid size-14 place-items-center rounded-full bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-lg shadow-fuchsia-900/25 ring-2 ring-white">
                <Swords className="size-6 text-white drop-shadow" />
            </span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <span className="brand-text-shimmer text-base font-bold tracking-tight sm:text-lg">
                {pillLabel}
            </span>
            <p className="inline-flex items-center gap-2 text-sm text-gray-500">
                <HeartPulse className="size-3.5 text-fuchsia-500 animate-pulse animation-duration-[1.4s]" />
                {caption}
            </p>
        </div>

        <BouncingDots />
        <ProgressSliver className="h-1 w-48" />
    </section>
)

/**
 * Branded loading state. One visual language, two scales.
 *
 * Variants:
 * - `"full"` (default) — full-screen splash with the big NextMatch wordmark.
 *   Use for `loading.js` route boundaries.
 * - `"inline"` — compact card without min-height or wordmark.
 *   Use for in-page `<Suspense>` fallbacks where surrounding chrome (header,
 *   tabs, etc.) should stay visible.
 *
 * Chrome:
 * - `withChrome={true}` wraps in <main> with the rose→fuchsia gradient sky.
 *   Only set this for routes that don't already have a layout providing
 *   <main>, otherwise you'll nest <main> elements.
 *   Ignored when variant="inline" — inline loaders shouldn't own page chrome.
 */
const BrandLoadingSplash = ({
    pillLabel = "Loading",
    caption = "Just a moment…",
    srLabel = "Loading…",
    variant = "full",
    withChrome = false,
}) => {
    if (variant === "inline") {
        return <InlineSplash pillLabel={pillLabel} caption={caption} srLabel={srLabel} />
    }

    if (!withChrome) {
        return <FullSplash pillLabel={pillLabel} caption={caption} srLabel={srLabel} />
    }

    return (
        <main className="relative isolate min-h-full">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
            />
            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                <FullSplash pillLabel={pillLabel} caption={caption} srLabel={srLabel} />
            </div>
        </main>
    )
}

export default BrandLoadingSplash
