export default function MemberCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm"
        >
            <div className="premium-shimmer relative aspect-3/4 overflow-hidden bg-linear-to-br from-rose-100/70 via-fuchsia-100/70 to-violet-100/70">
                <span className="absolute left-3 top-3 h-5 w-14 rounded-full bg-white/85 ring-1 ring-fuchsia-100/80 shadow-sm" />

                <span className="absolute right-3 top-3 h-4 w-12 rounded-full bg-black/15 ring-1 ring-white/15" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-28 rounded-md bg-white/70" />
                        <span className="h-3 w-7 rounded-md bg-white/55" />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                        <span className="size-3 rounded-full bg-white/55" />
                        <span className="h-3 w-24 rounded-md bg-white/55" />
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent"
                />
            </div>
        </div>
    )
}
