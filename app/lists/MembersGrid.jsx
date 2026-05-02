import { HeartCrack, Sparkles } from "lucide-react"
import Link from "next/link"

import {
    fetchCurrentUserLikeIds,
    fetchLikedMembers,
} from "@/app/actions/likeaction"
import MemberCard from "@/components/component/MemberCard"
import MemberCardSkeleton from "@/components/component/MemberCardSkeleton"

const TAB_META = {
    source: {
        empty: {
            title: "No likes yet",
            description: "Start exploring profiles — every great match begins with a tap.",
            ctaLabel: "Discover members",
            ctaHref: "/members",
        },
        fetchingLabel: "Loading people you've liked…",
    },
    target: {
        empty: {
            title: "No admirers yet",
            description: "Polish your profile and stay active — connections come to those who show up.",
            ctaLabel: "Update profile",
            ctaHref: "/members",
        },
        fetchingLabel: "Loading your admirers…",
    },
    mutual: {
        empty: {
            title: "No matches yet",
            description: "Keep liking — when someone you like likes you back, they'll land right here.",
            ctaLabel: "Find people",
            ctaHref: "/members",
        },
        fetchingLabel: "Loading your mutual matches…",
    },
}

// ─── Grid skeleton shown while Suspense is pending ──────────────────────────
export function MembersGridSkeleton({ label = "Fetching members…" }) {
    return (
        <div className="mt-8 space-y-4">
            {/* Animated fetching indicator */}
            <div className="flex items-center gap-2.5">
                <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-fuchsia-500" />
                </span>
                <p className="text-sm font-medium text-gray-400">{label}</p>
            </div>

            {/* Shimmer card grid */}
            <ul
                aria-busy="true"
                aria-label="Loading members"
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5"
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <li key={i}>
                        <MemberCardSkeleton />
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ─── Async server component — does the actual data fetching ─────────────────
export default async function MembersGrid({ activeTab, meta }) {
    const [membersResult, likedIdsResult] = await Promise.all([
        fetchLikedMembers(activeTab),
        fetchCurrentUserLikeIds(),
    ])

    const isError =
        membersResult && !Array.isArray(membersResult) && membersResult.error

    if (isError) {
        return (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-rose-200 bg-white/60 px-6 py-12 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                    <HeartCrack className="size-6" />
                </span>
                <p className="mt-3 text-sm font-medium text-gray-700">
                    Couldn&apos;t load members
                </p>
                <p className="mt-1 text-xs text-gray-400">{membersResult.error}</p>
            </div>
        )
    }

    const members = Array.isArray(membersResult) ? membersResult : []
    const likedIds = Array.isArray(likedIdsResult) ? likedIdsResult : []
    const likedSet = new Set(likedIds)
    const count = members.length

    if (count === 0) {
        return (
            <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-fuchsia-200 bg-white/60 px-6 py-16 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/15">
                    <Sparkles className="size-7" />
                </span>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-gray-900">
                    {meta.empty.title}
                </h2>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                    {meta.empty.description}
                </p>
                <Link
                    href={meta.empty.ctaHref}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-fuchsia-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/70 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                    {meta.empty.ctaLabel}
                </Link>
            </div>
        )
    }

    return (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {members.map((member) => (
                <li key={member.id}>
                    <MemberCard
                        member={member}
                        isLiked={likedSet.has(member.userId)}
                    />
                </li>
            ))}
        </ul>
    )
}

export { TAB_META }
