import { cn } from "@/lib/utils"

const SIZE = {
    sm: "size-2.5 ring-2",
    md: "size-3 ring-2",
    lg: "size-3.5 ring-[3px]",
}

function PresenceDot({ online, size = "sm", className }) {
    if (!online) return null

    return (
        <span
            aria-hidden="true"
            className={cn(
                "absolute right-0 bottom-0 rounded-full bg-emerald-500 ring-white shadow-sm shadow-emerald-900/20",
                SIZE[size],
                className,
            )}
        />
    )
}

export default PresenceDot
