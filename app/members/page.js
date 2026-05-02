import { HeartCrack, Search, Sparkles } from "lucide-react"

import { fetchCurrentUserLikeIds } from "@/app/actions/likeaction"
import { getMembers } from "@/app/actions/memberAction"
import MemberCard from "@/components/component/MemberCard"

export default async function Members() {
    const [members, likedIdsResult] = await Promise.all([
        getMembers(),
        fetchCurrentUserLikeIds(),
    ])
    const likedSet = new Set(
        Array.isArray(likedIdsResult) ? likedIdsResult : []
    )

    if (members?.error) {
        return (
            <main className="mx-auto flex min-h-full w-full max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                        <HeartCrack className="size-7" />
                    </span>
                    <h1 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">
                        We couldn&apos;t load members
                    </h1>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        {members.error}
                    </p>
                </div>
            </main>
        )
    }

    const list = members?.data ?? []
    const count = list.length

    return (
        <main className="relative isolate min-h-full">
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
                        <p className="mt-1.5 text-sm text-gray-500">
                            {count > 0
                                ? `${count} ${count === 1 ? "member" : "members"} ready to connect`
                                : "No one to show just yet — check back soon"}
                        </p>
                    </div>
                </header>

                {count === 0 ? (
                    <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-fuchsia-200 bg-white/60 px-6 py-16 text-center">
                        <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/15">
                            <Search className="size-7" />
                        </span>
                        <h2 className="mt-4 text-lg font-semibold tracking-tight text-gray-900">
                            No matches yet
                        </h2>
                        <p className="mt-1 max-w-sm text-sm text-gray-500">
                            We&apos;re finding people who match your vibe. New
                            profiles arrive every day.
                        </p>
                    </div>
                ) : (
                    <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
                        {list.map((member) => (
                            <li key={member.id}>
                                <MemberCard
                                    member={member}
                                    isLiked={likedSet.has(member.userId)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}
