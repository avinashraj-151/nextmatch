import Link from "next/link"
import { ArrowLeft, Compass, HeartCrack, Sparkles } from "lucide-react"

const NotFound = () => (
    <main
        role="main"
        aria-labelledby="not-found-title"
        className="relative isolate flex min-h-full items-center justify-center overflow-hidden"
    >
        {/* ── Soft gradient sky chrome (matches the rest of the app) ── */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
        />

        {/* ── Decorative backdrop blobs ── */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
        >
            <span className="absolute -left-20 top-10 size-72 rounded-full bg-rose-300/30 blur-3xl animate-pulse animation-duration-[7s]" />
            <span className="absolute -right-16 bottom-4 size-80 rounded-full bg-violet-300/30 blur-3xl animate-pulse animation-delay-[1s] animation-duration-[8s]" />
            <span className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/35 blur-3xl animate-pulse animation-delay-[0.5s] animation-duration-[6s]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-7 px-6 py-16 text-center animate-in fade-in zoom-in-95 duration-500">

            {/* ── Eyebrow pill ── */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-200/70 shadow-sm shadow-fuchsia-900/5 backdrop-blur">
                <Sparkles className="size-3" />
                Lost connection
            </span>

            {/* ── Medallion: HeartCrack on a brand disc ── */}
            <div className="relative grid size-32 place-items-center sm:size-36">
                <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-linear-to-br from-rose-400 via-fuchsia-500 to-violet-600 opacity-40 blur-2xl animate-pulse animation-duration-[3s]"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-3 rounded-full bg-fuchsia-300/35 animate-ping animation-duration-[3.2s]"
                />
                <span className="relative grid size-24 place-items-center rounded-full bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-xl shadow-fuchsia-900/30 ring-4 ring-white sm:size-28">
                    <HeartCrack className="size-10 text-white drop-shadow sm:size-12" />
                </span>
            </div>

            {/* ── 404 brand-shimmer wordmark ── */}
            <div className="flex flex-col items-center gap-3">
                <p className="brand-text-shimmer text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">
                    404
                </p>
                <h1
                    id="not-found-title"
                    className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                >
                    This page didn&apos;t make it past the first date
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
                    The link might be broken, or the page may have moved on.
                    Let&apos;s get you back to people who actually want to meet you.
                </p>
            </div>

            {/* ── CTAs ── */}
            <div className="flex w-full flex-col items-stretch gap-2.5 sm:w-auto sm:flex-row sm:items-center">
                <Link
                    href="/"
                    className="group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold text-white outline-none bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 shadow-lg shadow-fuchsia-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/30 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 focus-visible:ring-offset-2"
                >
                    <ArrowLeft className="size-4" />
                    <span>Back to home</span>
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                    />
                </Link>

                <Link
                    href="/members"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-fuchsia-200 bg-white/70 px-5 py-3 text-sm font-semibold text-fuchsia-700 backdrop-blur transition-all duration-200 hover:border-fuchsia-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 focus-visible:ring-offset-2"
                >
                    <Compass className="size-4" />
                    <span>Discover people</span>
                </Link>
            </div>

            {/* ── Footer wordmark for grounding ── */}
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                    NextMatch
                </span>
            </p>
        </div>
    </main>
)

export default NotFound
