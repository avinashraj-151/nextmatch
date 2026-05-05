import { cn } from "@/lib/utils"

function SettingsRow({
    icon: Icon,
    label,
    description,
    badge,
    children,
    htmlFor,
    align = "center",
    className,
}) {
    const LabelTag = htmlFor ? "label" : "div"

    return (
        <div
            className={cn(
                "flex flex-col gap-3 px-5 py-4 transition-colors sm:flex-row sm:items-center sm:gap-6",
                align === "start" && "sm:items-start",
                className,
            )}
        >
            <LabelTag
                {...(htmlFor ? { htmlFor } : {})}
                className="flex min-w-0 flex-1 items-start gap-3"
            >
                {Icon ? (
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-fuchsia-50 text-fuchsia-600 ring-1 ring-fuchsia-100">
                        <Icon className="size-4" />
                    </span>
                ) : null}

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-gray-900">
                            {label}
                        </span>
                        {badge ? badge : null}
                    </span>
                    {description ? (
                        <span className="text-xs leading-relaxed text-gray-500">
                            {description}
                        </span>
                    ) : null}
                </span>
            </LabelTag>

            <div className="flex shrink-0 items-center justify-end">
                {children}
            </div>
        </div>
    )
}

export default SettingsRow
