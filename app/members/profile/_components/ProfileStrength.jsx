import { BadgeCheck, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const ProfileStrength = ({ completion, className }) => {
    if (!completion) return null

    const { pct = 0, items = [] } = completion

    return (
        <aside
            aria-labelledby="profile-strength-title"
            className={cn(
                "relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5",
                className,
            )}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-fuchsia-200/30 blur-3xl"
            />
            <header className="flex items-center justify-between gap-3">
                <h2
                    id="profile-strength-title"
                    className="text-base font-bold tracking-tight text-gray-900"
                >
                    Profile strength
                </h2>
                <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold tracking-wide text-fuchsia-700 ring-1 ring-fuchsia-100">
                    {pct}%
                </span>
            </header>

            <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Profile completion"
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-fuchsia-100/70"
            >
                <div
                    className="h-full rounded-full bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 transition-[width] duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <ul className="mt-5 space-y-2">
                {items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5 text-sm">
                        <span
                            aria-hidden="true"
                            className={cn(
                                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ring-1",
                                item.done
                                    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                    : "bg-gray-50 text-gray-400 ring-gray-100",
                            )}
                        >
                            {item.done ? (
                                <BadgeCheck className="size-3.5" />
                            ) : (
                                <Sparkles className="size-3" />
                            )}
                        </span>
                        <span
                            className={cn(
                                "leading-snug",
                                item.done
                                    ? "text-gray-500 line-through decoration-emerald-300"
                                    : "text-gray-700",
                            )}
                        >
                            {item.label}
                        </span>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default ProfileStrength
