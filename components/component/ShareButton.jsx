"use client"

import { useState, useTransition } from "react"
import { Check, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"

export default function ShareButton({ title, text, path }) {
    const [copied, setCopied] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleShare = () => {
        startTransition(async () => {
            const url =
                typeof window !== "undefined"
                    ? new URL(path, window.location.origin).toString()
                    : path

            if (typeof navigator !== "undefined" && navigator.share) {
                try {
                    await navigator.share({ title, text, url })
                    return
                } catch (error) {
                    if (error?.name === "AbortError") return
                }
            }

            try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1800)
            } catch {
                // last-resort: do nothing — UI stays in idle state
            }
        })
    }

    return (
        <button
            type="button"
            // onClick={handleShare}
            disabled={isPending}
            aria-label={title}
            className={cn(
                "cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700",
                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/40",
                "disabled:opacity-60",
            )}
        >
            {copied ? (
                <>
                    <Check className="size-3.5" />
                    Copied
                </>
            ) : (
                <>
                    <Share2 className="size-3.5" />
                    Share
                </>
            )}
        </button>
    )
}
