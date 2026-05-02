import { CalendarHeart, Images, ShieldCheck } from "lucide-react"

const StatCard = ({ icon: Icon, label, value, hint }) => (
    <div className="relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-fuchsia-200/30 blur-2xl"
        />
        <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-sm shadow-fuchsia-900/20">
                <Icon className="size-5" />
            </span>
            <div className="min-w-0">
                <p className="text-2xl font-bold leading-none tracking-tight text-gray-900">
                    {value}
                </p>
                <p className="mt-1 truncate text-xs font-medium text-gray-500">
                    {label}
                </p>
            </div>
        </div>
        {hint ? (
            <p className="mt-3 text-[11px] font-medium text-gray-400">{hint}</p>
        ) : null}
    </div>
)

const ProfileStats = ({ photoCount = 0, memberDays = 0, joinedOn, completion }) => {
    const photosHint =
        photoCount < 3 ? "Add more to boost matches" : "Looking great"
    const daysLabel = memberDays === 1 ? "Day on NextMatch" : "Days on NextMatch"

    return (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <li>
                <StatCard
                    icon={Images}
                    label="Photos in your gallery"
                    value={photoCount}
                    hint={photosHint}
                />
            </li>
            <li>
                <StatCard
                    icon={CalendarHeart}
                    label={daysLabel}
                    value={memberDays}
                    hint={joinedOn ? `Member since ${joinedOn}` : null}
                />
            </li>
            <li>
                <StatCard
                    icon={ShieldCheck}
                    label="Profile completion"
                    value={`${completion?.pct ?? 0}%`}
                    hint={`${completion?.completed ?? 0} of ${completion?.total ?? 0} steps complete`}
                />
            </li>
        </ul>
    )
}

export default ProfileStats
