"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { toggleLikeMember } from "@/app/actions/likeaction"

export default function LikeButton({ targetUserId, isLiked = false }) {
    const router = useRouter()
    const [optimisticLiked, setOptimisticLiked] = useState(Boolean(isLiked))
    const [isPending, startTransition] = useTransition()

    const handleLike = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isPending) return

        const previous = optimisticLiked
        const next = !previous
        setOptimisticLiked(next)

        startTransition(async () => {
            try {
                const res = await toggleLikeMember(targetUserId, previous)
                if (res?.error) {
                    setOptimisticLiked(previous)
                    return
                }
                router.refresh()
            } catch {
                setOptimisticLiked(previous)
            }
        })
    }

    const label = optimisticLiked ? "Unlike" : "Like"

    return (
        <button
            type="button"
            onClick={handleLike}
            disabled={isPending}
            aria-label={label}
            aria-pressed={optimisticLiked}
            title={label}
            className={`relative z-20 grid size-10 place-items-center rounded-full backdrop-blur-md ring-1 transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500/70 active:scale-90 disabled:opacity-80 ${optimisticLiked
                    ? "bg-linear-to-br from-rose-500 via-fuchsia-500 to-violet-500 text-white ring-white/40 shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60"
                    : "bg-white/20 text-white ring-white/40 shadow-md shadow-black/20 hover:bg-white/35 hover:ring-white/60"
                }`}
        >
            <Heart
                aria-hidden="true"

                className={`size-5 transition-all duration-300 ${optimisticLiked
                        ? "fill-current scale-110 drop-shadow-[0_1px_2px_rgba(244,63,94,0.45)]"
                        : "scale-100"
                    } ${isPending ? "animate-pulse" : ""}`}
            />
            <span className="sr-only">{label}</span>
        </button>
    )
}
