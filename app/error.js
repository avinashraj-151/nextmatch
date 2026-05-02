"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    HeartCrack,
    LifeBuoy,
    RefreshCcw,
    Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

const ErrorPage = ({ error, reset }) => {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            console.error("App error boundary:", error)
        }
    }, [error])

    const handleReset = () => {
        reset()
    }

    return (
        <main
            role="alert"
            aria-live="assertive"
            className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/50 to-transparent" />
                <div className="absolute -top-24 -left-16 size-72 rounded-full bg-rose-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -right-20 size-80 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/30 blur-3xl" />
            </div>

            <div className="relative w-full max-w-xl rounded-3xl bg-white/80 p-8 ring-1 ring-black/5 shadow-2xl shadow-fuchsia-900/10 backdrop-blur sm:p-12">
                <div className="flex flex-col items-center text-center">
                    <span className="relative grid size-16 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-500/30">
                        <HeartCrack className="size-8" />
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 rounded-2xl bg-fuchsia-500/30 blur-xl"
                        />
                    </span>

                    <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5">
                        <Sparkles className="size-3" />
                        Something broke
                    </span>
                    
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                        Something didn&apos;t go quite right on our end. Don&apos;t
                        worry &mdash; your matches are safe. Let&apos;s try this
                        again.
                    </p>

                    {error?.digest ? (
                        <code className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-500 ring-1 ring-gray-100">
                            <span className="inline-block size-1.5 rounded-full bg-rose-400" />
                            ref &middot; {error.digest}
                        </code>
                    ) : null}

                    <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={handleReset}
                            aria-label="Try loading again"
                            className={cn(
                                "group/cta relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold text-white outline-none sm:w-auto",
                                "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                                "shadow-lg shadow-fuchsia-900/20 transition-all duration-200",
                                "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/25",
                                "active:translate-y-0",
                                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                            )}
                        >
                            <span className="relative z-10 inline-flex items-center gap-2">
                                <RefreshCcw className="size-4 transition-transform duration-500 group-hover/cta:-rotate-180" />
                                Try again
                            </span>
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                            />
                        </button>

                        <Link
                            href="/"
                            className={cn(
                                "inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 outline-none sm:w-auto",
                                "transition-all duration-200 hover:-translate-y-0.5 hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700",
                                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/40",
                            )}
                            aria-label="Go back to the home page"
                        >
                            <ArrowLeft className="size-4" />
                            Back to home
                        </Link>
                    </div>

                    <p className="mt-8 inline-flex items-center gap-1.5 text-xs text-gray-400">
                        <LifeBuoy className="size-3.5" />
                        Still stuck? Refreshing the page usually helps.
                    </p>
                </div>
            </div>
        </main>
    )
}

export default ErrorPage
