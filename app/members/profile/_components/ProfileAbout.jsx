import Link from "next/link"
import { Pencil } from "lucide-react"

import { cn } from "@/lib/utils"

const ProfileAbout = ({ bio = "", className }) => (
    <article
        className={cn(
            "rounded-3xl bg-white p-6 ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5",
            className,
        )}
    >
        <header className="flex items-center justify-between gap-3">
            <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100">
                    About
                </span>
            </div>
        </header>
        {bio ? (
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                {bio}
            </p>
        ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-fuchsia-200 bg-fuchsia-50/40 p-5 text-center">
                <p className="text-sm text-gray-600">
                    A great bio gets up to{" "}
                    <span className="font-semibold text-fuchsia-700">
                        3× more matches
                    </span>
                    .
                </p>
            </div>
        )}
    </article>
)

export default ProfileAbout
