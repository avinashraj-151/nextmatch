"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, MessageCircleHeart } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { canMessageMember } from "@/app/messages/_lib/messageAction"

function MessageMemberButton({ otherUserId, firstName }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isChecking, setIsChecking] = useState(false)

    const isBusy = isPending || isChecking

    const handleClick = async () => {
        if (isBusy || !otherUserId) return

        setIsChecking(true)
        const result = await canMessageMember(otherUserId)
        setIsChecking(false)

        if (!result?.canMessage) {
            toast.error(result?.error ?? "You can't message this person yet.")
            return
        }

        startTransition(() => {
            router.push(`/messages?with=${otherUserId}`)
        })
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isBusy}
            aria-label={`Message ${firstName}`}
            className={cn(
                "group/cta relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none",
                "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                "shadow-lg shadow-fuchsia-900/20 transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/25",
                "active:translate-y-0",
                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                "disabled:cursor-wait disabled:opacity-90",
            )}
        >
            {isBusy ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <MessageCircleHeart className="size-4" />
            )}
            <span>{isBusy ? "Opening…" : `Message ${firstName}`}</span>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
            />
        </button>
    )
}

export default MessageMemberButton
