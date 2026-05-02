import { MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

import { calculateAge, getInitials, isNewMember } from "@/lib/utils"
import LikeButton from "./LikeButton"

export default function MemberCard({ member, isLiked = false }) {
    const age = calculateAge(member?.dateOfBirth)
    const initials = getInitials(member?.name)
    const isNew = isNewMember(member?.createdAt, 7)
    const location = [member?.city, member?.country].filter(Boolean).join(", ")
    const displayName = member?.name?.trim() || "Member"

    return (
        <article
            className="group relative isolate overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-fuchsia-500/15 hover:ring-fuchsia-200"
            aria-label={`Profile of ${displayName}${age != null ? `, ${age}` : ""}`}
        >
            <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100">
                {member?.image ? (
                    <img
                        src={member.image}
                        alt={`Photo of ${displayName}`}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                ) : (
                    <div className="grid size-full place-items-center">
                        <span className="select-none bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
                            {initials}
                        </span>
                    </div>
                )}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"
                />

                <Link
                    href={`/members/${member.userId}`}
                    aria-label={`View ${displayName}'s profile`}
                    className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 focus-visible:ring-offset-2"
                />

                {isNew ? (
                    <span className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200/80 shadow-sm shadow-fuchsia-900/10 backdrop-blur">
                        <Sparkles className="size-3" />
                        New
                    </span>
                ) : null}

                {member?.gender ? (
                    <span className="pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur">
                        {member.gender}
                    </span>
                ) : null}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4 text-white">
                    <div className="min-w-0 flex-1">
                        <h3 className="flex items-baseline gap-2 text-lg font-semibold leading-tight tracking-tight drop-shadow-sm">
                            <span className="truncate">{displayName}</span>
                            {age != null ? (
                                <span className="shrink-0 text-base font-medium text-white/85">
                                    {age}
                                </span>
                            ) : null}
                        </h3>

                        {location ? (
                            <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
                                <MapPin className="size-3.5 shrink-0" />
                                <span className="truncate">{location}</span>
                            </p>
                        ) : null}
                    </div>

                    <div className="pointer-events-auto shrink-0 cursor-pointer">
                        <LikeButton
                            targetUserId={member.userId}
                            isLiked={isLiked}
                        />
                    </div>
                </div>
            </div>
        </article>
    )
}
