import { Sparkles } from "lucide-react"

import MemberCardSkeleton from "@/components/component/MemberCardSkeleton"

const SKELETON_COUNT = 10

export default function MembersLoading() {
    return (
        <main
            aria-busy="true"
            aria-live="polite"
            className="relative isolate min-h-full"
        >
            <span className="sr-only">Loading members…</span>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
            />

            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5">
                            <Sparkles className="size-3" />
                            For you
                        </span>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                                Discover
                            </span>{" "}
                            people you&apos;ll love
                        </h1>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="premium-shimmer block h-3 w-44 rounded-md bg-fuchsia-100/70" />
                            <span className="inline-flex size-1.5 animate-pulse rounded-full bg-fuchsia-500" />
                        </div>
                    </div>
                </header>

                <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
                    {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                        <li key={index}>
                            <MemberCardSkeleton />
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}
