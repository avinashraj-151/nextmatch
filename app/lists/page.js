import { Suspense } from "react"
import { Eye, Heart, HeartHandshake, Sparkles } from "lucide-react"

import ListsTab from "./ListTab"
import MembersGrid, { MembersGridSkeleton, TAB_META } from "./MembersGrid"

const TAB_SUBTITLE = {
    source: "People you've shown interest in",
    target: "People who are interested in you",
    mutual: "You both liked each other — go say hi",
}

const TAB_EYEBROW = {
    source: { label: "Your hearts", icon: Heart },
    target: { label: "Admirers", icon: Eye },
    mutual: { label: "It's a match", icon: HeartHandshake },
}

const TAB_TITLE = {
    source: "Members you liked",
    target: "Members who liked you",
    mutual: "Mutual matches",
}

const VALID_TABS = new Set(["source", "target", "mutual"])
const normalizeTab = (raw) => (VALID_TABS.has(raw) ? raw : "source")

export default async function ListsPage({ searchParams }) {
    const params = (await searchParams) ?? {}
    const activeTab = normalizeTab(params?.type)
    const meta = TAB_META[activeTab]
    const eyebrow = TAB_EYEBROW[activeTab]
    const EyebrowIcon = eyebrow.icon

    return (
        <main className="relative isolate min-h-full">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
            />

            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                {/* ── Header — renders instantly, no data needed ── */}
                <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5">
                            <EyebrowIcon className="size-3" />
                            {eyebrow.label}
                        </span>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                                {TAB_TITLE[activeTab]}
                            </span>
                        </h1>
                        <p className="mt-1.5 text-sm text-gray-500">
                            {TAB_SUBTITLE[activeTab]}
                        </p>
                    </div>

                    <ListsTab activeTab={activeTab} />
                </header>

                {/* ── Grid — wrapped in Suspense, skeleton shows while fetching ── */}
                <Suspense fallback={<MembersGridSkeleton label={meta.fetchingLabel} />} >
                    <MembersGrid activeTab={activeTab} meta={meta} />
                </Suspense>
            </div>
        </main>
    )
}
