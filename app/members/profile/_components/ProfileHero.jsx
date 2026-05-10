"use client"

import {
    CalendarHeart,
    Camera,
    MapPin,
    Pencil,
    Sparkles,
    Venus,
} from "lucide-react"

import { calculateAge, cn, getInitials, isNewMember } from "@/lib/utils"
import { useAvatar } from "@/app/_providers/AvatarProvider"
import { formatJoinedAgo } from "../_lib/profile"
import ChangeProfilePhotoDialog from "./ChangeProfilePhotoDialog"
import EditProfileDialog from "./EditProfileDialog"

const ProfileHero = ({ member }) => {
    const { avatar, setAvatar } = useAvatar()

    if (!member) return null

    const displayImage = avatar

    const displayName = member.name?.trim() || "Member"
    const age = calculateAge(member.dateOfBirth)
    const initials = getInitials(member.name)
    const isNew = isNewMember(member.createdAt, 7)
    const location = [member.city, member.country].filter(Boolean).join(", ")
    const joinedAgo = formatJoinedAgo(member.createdAt)

    return (
        <header className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5">
            <div className="relative aspect-21/9 w-full overflow-hidden bg-linear-to-br from-rose-200 via-fuchsia-200 to-violet-200">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt=""
                        loading="eager"
                        decoding="async"
                        aria-hidden="true"
                        className="size-full scale-110 object-cover blur-md"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="size-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(244,63,94,0.35),transparent_55%),radial-gradient(120%_120%_at_100%_0%,rgba(124,58,237,0.35),transparent_55%),radial-gradient(120%_120%_at_50%_100%,rgba(192,38,211,0.45),transparent_60%)]"
                    />
                )}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10"
                />

                <div className="absolute right-3 top-3 flex flex-wrap items-center justify-end gap-1.5 sm:right-5 sm:top-5">
                    {isNew ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200/80 shadow-sm shadow-fuchsia-900/10 backdrop-blur">
                            <Sparkles className="size-3" />
                            New
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
                    <div className="-mt-16 relative sm:-mt-20">
                        <div className="relative size-32 overflow-hidden rounded-3xl bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100 ring-4 ring-white shadow-xl shadow-fuchsia-900/15 sm:size-40">
                            {displayImage ? (
                                <img
                                    src={displayImage}
                                    alt={`Photo of ${displayName}`}
                                    loading="eager"
                                    decoding="async"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="grid size-full place-items-center">
                                    <span className="select-none bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                                        {initials}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Camera overlay button */}
                        <ChangeProfilePhotoDialog
                            member={member}
                            currentImage={displayImage}
                            onImageChange={setAvatar}
                            trigger={
                                <button
                                    type="button"
                                    className={cn(
                                        "absolute -bottom-1 -right-1 z-10",
                                        "flex size-9 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl",
                                        "bg-gradient-to-br from-rose-500 via-fuchsia-600 to-violet-600",
                                        "ring-[3px] ring-white shadow-lg shadow-fuchsia-900/25",
                                        "transition-all duration-200",
                                        "hover:scale-110 hover:shadow-xl hover:shadow-fuchsia-900/30",
                                        "active:scale-95",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 focus-visible:ring-offset-2",
                                    )}
                                    aria-label="Change profile photo"
                                >
                                    <Camera className="size-4 text-white sm:size-[18px]" />
                                </button>
                            }
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:pb-1">
                        <div className="min-w-0">
                            <h2 className="flex items-baseline gap-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                                <span className="truncate">{displayName}</span>
                                {age != null ? (
                                    <span className="shrink-0 text-xl font-semibold text-gray-500 sm:text-2xl">
                                        {age}
                                    </span>
                                ) : null}
                            </h2>
                            <ul className="mt-2 flex flex-wrap items-center gap-1.5">
                                {location ? (
                                    <li className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 ring-1 ring-fuchsia-100">
                                        <MapPin className="size-3" />
                                        {location}
                                    </li>
                                ) : null}
                                {member.gender ? (
                                    <li className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700 ring-1 ring-rose-100">
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
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <EditProfileDialog
                                member={member}
                                trigger={
                                    <button
                                        type="button"
                                        className={cn(
                                            "group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none",
                                            "bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                                            "shadow-lg shadow-fuchsia-900/20 transition-all duration-200",
                                            "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/25",
                                            "active:translate-y-0",
                                            "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                                        )}
                                    >
                                        <Pencil className="size-4" />
                                        <span>Edit profile</span>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                                        />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ProfileHero
