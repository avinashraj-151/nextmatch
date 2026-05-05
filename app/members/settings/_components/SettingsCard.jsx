import { cn } from "@/lib/utils"

function SettingsCard({
    id,
    icon: Icon,
    eyebrow,
    title,
    description,
    children,
    className,
}) {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className={cn(
                "scroll-mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm shadow-fuchsia-900/5",
                className,
            )}
        >
            {/* Header */}
            <header className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
                {Icon ? (
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/20 ring-2 ring-white">
                        <Icon className="size-5" />
                    </span>
                ) : null}

                <div className="min-w-0 flex-1">
                    {eyebrow ? (
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700">
                            {eyebrow}
                        </p>
                    ) : null}
                    <h2
                        id={`${id}-title`}
                        className="text-lg font-bold tracking-tight text-gray-900"
                    >
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                            {description}
                        </p>
                    ) : null}
                </div>
            </header>

            {/* Body — children stack with hairline dividers */}
            <div className="divide-y divide-gray-100">
                {children}
            </div>
        </section>
    )
}

export default SettingsCard
