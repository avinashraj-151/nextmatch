import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
    ArrowLeft,
    BadgeCheck,
    CalendarHeart,
    Flag,
    MapPin,
    MessageCircleHeart,
    Sparkles,
    Venus,
} from "lucide-react"

import {
    calculateAge,
    cn,
    getInitials,
    isNewMember,
} from "@/lib/utils"
import ShareButton from "@/components/component/ShareButton"

const formatJoinedAgo = (date) => {
    if (!date) return null
    const parsed = date instanceof Date ? date : new Date(date)
    if (Number.isNaN(parsed.getTime())) return null
    return formatDistanceToNow(parsed, { addSuffix: true })
}

const getFirstName = (name = "") => {
    const trimmed = name?.trim() ?? ""
    if (!trimmed) return "them"
    return trimmed.split(/\s+/)[0]
}

export default function MemberSidebar({ member }) {
    if (!member) return null

    const age = calculateAge(member.dateOfBirth)
    const initials = getInitials(member.name)
    const isNew = isNewMember(member.createdAt, 7)
    const location = [member.city, member.country].filter(Boolean).join(", ")
    const joinedAgo = formatJoinedAgo(member.createdAt)
    const displayName = member.name?.trim() || "Member"
    const firstName = getFirstName(displayName)
    const reportSubject = encodeURIComponent(`Report profile: ${displayName}`)

    return (
        <aside className="lg:sticky lg:top-6">
            <Link
                href="/members"
                className={cn(
                    "group/back inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-gray-500 outline-none",
                    "transition-colors duration-200 hover:text-fuchsia-700",
                    "focus-visible:ring-2 focus-visible:ring-fuchsia-500/40",
                )}
                aria-label="Back to all matches"
            >
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
                <span>All matches</span>
            </Link>

            <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5">
                <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100">
                    {member.image ? (
                        <img
                            src={member.image}
                            alt={`Photo of ${displayName}`}
                            loading="eager"
                            decoding="async"
                            className="size-full object-cover"
                        />
                    ) : (
                        <div className="grid size-full place-items-center">
                            <span className="select-none bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent">
                                {initials}
                            </span>
                        </div>
                    )}

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent"
                    />

                    {isNew ? (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200/80 shadow-sm shadow-fuchsia-900/10 backdrop-blur">
                            <Sparkles className="size-3" />
                            New
                        </span>
                    ) : null}

                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <h1 className="flex items-baseline gap-2 text-2xl font-bold leading-tight tracking-tight drop-shadow-sm">
                            <span className="truncate">{displayName}</span>
                            {age != null ? (
                                <span className="shrink-0 text-xl font-semibold text-white/90">
                                    {age}
                                </span>
                            ) : null}
                            <BadgeCheck
                                className="size-5 shrink-0 text-white drop-shadow"
                                aria-label="Verified profile"
                            />
                        </h1>
                        {location ? (
                            <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                                <MapPin className="size-4 shrink-0" />
                                <span className="truncate">{location}</span>
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="space-y-4 p-4">
                    {(member.gender || joinedAgo) ? (
                        <ul className="flex flex-wrap items-center gap-1.5">
                            {member.gender ? (
                                <li className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700 ring-1 ring-fuchsia-100">
                                    <Venus className="size-3" />
                                    {member.gender}
                                </li>
                            ) : null}
                            {joinedAgo ? (
                                <li className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-gray-100">
                                    <CalendarHeart className="size-3" />
                                    Joined {joinedAgo}
                                </li>
                            ) : null}
                        </ul>
                    ) : null}
                
                
                    <Link
                        href={`/messages/${member.userId}`}
                        className={cn(
                            "group/cta relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none",
                            "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                            "shadow-lg shadow-fuchsia-900/20 transition-all duration-200",
                            "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/25",
                            "active:translate-y-0",
                            "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                        )}
                    >
                        <MessageCircleHeart className="size-4" />
                        <span>Message {firstName}</span>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                        />
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                        <ShareButton
                            title={`${displayName} on NextMatch`}
                            text={`Check out ${displayName}'s profile`}
                            // path={`/members/${member.userId}`}
                        />
                        <a

                            className={cn(
                                "cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none",
                                "transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700",
                                "focus-visible:ring-2 focus-visible:ring-rose-500/40",
                            )}
                            aria-label={`Report ${displayName}`}
                        >
                            <Flag className="size-3.5" />
                            Report
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    )
}
