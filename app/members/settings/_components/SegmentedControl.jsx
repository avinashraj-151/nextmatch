"use client"

import { cn } from "@/lib/utils"

function SegmentedControl({
    options,
    value,
    onChange,
    ariaLabel,
    className,
}) {
    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={cn(
                "inline-flex items-center rounded-full bg-gray-100 p-1 ring-1 ring-gray-200/70",
                className,
            )}
        >
            {options.map(function renderOption(option) {
                const isActive = option.value === value
                const Icon = option.icon

                function handleClick() {
                    onChange(option.value)
                }

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={handleClick}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 outline-none",
                            "focus-visible:ring-2 focus-visible:ring-fuchsia-300",
                            isActive
                                ? "bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-sm shadow-fuchsia-900/20"
                                : "text-gray-600 hover:text-gray-900",
                        )}
                    >
                        {Icon ? <Icon className="size-3.5" /> : null}
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}

export default SegmentedControl
