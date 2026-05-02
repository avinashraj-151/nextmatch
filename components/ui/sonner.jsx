"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import {
    CheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    XIcon,
    Loader2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const iconTileBase =
    "grid size-8 shrink-0 place-items-center rounded-[10px] text-white shadow-md ring-1 ring-white/40"

const LoadingIcon = (
    <span
        aria-hidden="true"
        className={cn(
            iconTileBase,
            "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-fuchsia-500/30",
        )}
    >
        <Loader2Icon className="size-4 animate-spin" />
    </span>
)

const Toaster = ({ ...props }) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme}
            position="top-center"
            expand
            offset={20}
            gap={12}
            duration={4200}
            visibleToasts={4}
            className="toaster group"
            loadingIcon={LoadingIcon}
            icons={{
                success: (
                    <span
                        aria-hidden="true"
                        className={cn(
                            iconTileBase,
                            "bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-emerald-500/30",
                        )}
                    >
                        <CheckIcon className="size-4" strokeWidth={3} />
                    </span>
                ),
                info: (
                    <span
                        aria-hidden="true"
                        className={cn(
                            iconTileBase,
                            "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-fuchsia-500/30",
                        )}
                    >
                        <InfoIcon className="size-4" strokeWidth={2.5} />
                    </span>
                ),
                warning: (
                    <span
                        aria-hidden="true"
                        className={cn(
                            iconTileBase,
                            "bg-linear-to-br from-amber-400 via-amber-500 to-orange-500 shadow-amber-500/30",
                        )}
                    >
                        <TriangleAlertIcon
                            className="size-4"
                            strokeWidth={2.5}
                        />
                    </span>
                ),
                error: (
                    <span
                        aria-hidden="true"
                        className={cn(
                            iconTileBase,
                            "bg-linear-to-br from-rose-500 via-rose-600 to-red-600 shadow-rose-500/35",
                        )}
                    >
                        <XIcon className="size-4" strokeWidth={3} />
                    </span>
                ),
                loading: LoadingIcon,
            }}
            toastOptions={{
                classNames: {
                    toast: "cn-toast",
                    title: "cn-toast__title",
                    description: "cn-toast__description",
                    icon: "cn-toast__icon",
                    content: "cn-toast__content",
                    closeButton: "cn-toast__close",
                    actionButton: "cn-toast__action",
                    cancelButton: "cn-toast__cancel",
                },
            }}
            style={{
                "--normal-bg": "rgba(255, 255, 255, 0.92)",
                "--normal-text": "#0f172a",
                "--normal-border": "rgba(15, 23, 42, 0.06)",
                "--border-radius": "1rem",
            }}
            {...props}
        />
    )
}

export { Toaster }
