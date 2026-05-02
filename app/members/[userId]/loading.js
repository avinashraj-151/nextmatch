import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

const PHOTO_PLACEHOLDERS = 8

const Shimmer = ({ className }) => (
    <div
        aria-hidden="true"
        className={cn(
            "premium-shimmer rounded-md bg-gray-200/80",
            className,
        )}
    />
)

const GradientShimmer = ({ className }) => (
    <div
        aria-hidden="true"
        className={cn(
            "premium-shimmer bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100",
            className,
        )}
    />
)

const SidebarSkeleton = () => (
    <aside className="lg:sticky lg:top-6">
        <div className="inline-flex items-center gap-1.5 px-2 py-1">
            <ArrowLeft className="size-4 text-gray-300" aria-hidden="true" />
            <Shimmer className="h-3.5 w-20 rounded-full" />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5">
            <GradientShimmer className="relative aspect-3/4 w-full overflow-hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent"
                />

                <span
                    aria-hidden="true"
                    className="absolute left-3 top-3 inline-block h-6 w-14 rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur"
                />

                <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
                    <div className="h-6 w-3/5 rounded-md bg-white/40" />
                    <div className="h-3.5 w-2/5 rounded-md bg-white/30" />
                </div>
            </GradientShimmer>

            <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                    <Shimmer className="h-6 w-20 rounded-full" />
                    <Shimmer className="h-6 w-32 rounded-full" />
                </div>

                <div className="premium-shimmer h-11 w-full rounded-xl bg-linear-to-r from-rose-200/70 via-fuchsia-200/70 to-violet-200/70" />

                <div className="grid grid-cols-2 gap-2">
                    <Shimmer className="h-9 rounded-xl" />
                    <Shimmer className="h-9 rounded-xl" />
                </div>
            </div>
        </div>
    </aside>
)

const AboutSkeleton = () => (
    <section className="space-y-6" aria-hidden="true">
        <Shimmer className="h-6 w-20 rounded-full" />

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
            <div className="space-y-3">
                <Shimmer className="h-3.5 w-full" />
                <Shimmer className="h-3.5 w-[94%]" />
                <Shimmer className="h-3.5 w-[88%]" />
                <Shimmer className="h-3.5 w-[72%]" />
                <Shimmer className="h-3.5 w-[55%]" />
            </div>
        </div>
    </section>
)

const GallerySkeleton = () => (
    <section aria-hidden="true">
        <header className="flex items-end justify-between gap-3">
            <div className="space-y-3">
                <Shimmer className="h-6 w-20 rounded-full" />
                <div className="flex items-center gap-2">
                    <Shimmer className="h-8 w-28 rounded-md" />
                    <Shimmer className="h-5 w-9 rounded-full" />
                </div>
            </div>
            <Shimmer className="hidden sm:block h-6 w-32 rounded-full" />
        </header>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: PHOTO_PLACEHOLDERS }).map((_, index) => (
                <li
                    key={index}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="animate-in fade-in zoom-in-95 duration-500"
                >
                    <GradientShimmer className="aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm" />
                </li>
            ))}
        </ul>
    </section>
)

const MemberDetailLoading = () => (
    <main
        className="relative isolate min-h-full"
        role="status"
        aria-busy="true"
        aria-live="polite"
    >
        <span className="sr-only">Loading member profile</span>

        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
        />

        <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
                <SidebarSkeleton />

                <div className="space-y-10">
                    <AboutSkeleton />
                    <GallerySkeleton />
                </div>
            </div>
        </div>
    </main>
)

export default MemberDetailLoading
