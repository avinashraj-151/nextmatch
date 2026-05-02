import Link from "next/link"
import {
    Cake,
    ChevronRight,
    Globe2,
    MapPin,
    Pencil,
    Venus,
} from "lucide-react"

import { calculateAge, cn } from "@/lib/utils"
import { formatBirthday } from "../_lib/profile"

const DetailRow = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-100">
                <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {label}
                </p>
                {
                    value ? (
                        <p className="mt-0.5 truncate text-sm font-medium text-gray-900">
                            {value}
                        </p>
                    ) : (
                        <p className="mt-0.5 truncate text-sm font-medium text-gray-900">
                            Not set
                        </p>
                    )
                }
            </div>
        </div>
    )
}

const ProfileDetails = ({ member}) => {
    if (!member) return null

    const age = calculateAge(member.dateOfBirth)
    const birthday = formatBirthday(member.dateOfBirth)
    const birthdayValue = birthday
        ? `${birthday}${age != null ? ` · ${age} years` : ""}`
        : null

    return (
        <article className="rounded-3xl bg-white p-6 ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100">
                        Details
                    </span>
                    <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                        Profile details
                    </h2>
                </div>
            </header>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailRow
                    icon={Venus}
                    label="Gender"
                    value={member.gender || null}
                    
                />
                <DetailRow
                    icon={MapPin}
                    label="City"
                    value={member.city || null}
                    
                />
                <DetailRow
                    icon={Globe2}
                    label="Country"
                    value={member.country || null}
                    
                />
                <DetailRow
                    icon={Cake}
                    label="Birthday"
                    value={birthdayValue}
                    
                />
            </div>
        </article>
    )
}

export default ProfileDetails
