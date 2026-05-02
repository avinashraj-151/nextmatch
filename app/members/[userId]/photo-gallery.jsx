"use client"

import { useState } from "react"
import {
    ChevronDown,
    ChevronUp,
    Images,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const DEFAULT_INITIAL = 10
const MOSAIC_THRESHOLD = 5

const PhotoGallery = ({
    photos = [],
    displayName = "Member",
    initialCount = DEFAULT_INITIAL,
}) => {
    const [expanded, setExpanded] = useState(false)
    const [activeIndex, setActiveIndex] = useState(null)

    const total = photos.length

    if (total === 0) {
        return (
            <section
                aria-labelledby="photo-gallery-title"
                className="relative overflow-hidden rounded-3xl border border-dashed border-fuchsia-200 bg-white/60 p-10 text-center"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-fuchsia-200/40 blur-3xl"
                />
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/15">
                    <Images className="size-7" />
                </span>
                <h2
                    id="photo-gallery-title"
                    className="mt-4 text-lg font-semibold tracking-tight text-gray-900"
                >
                    No photos yet
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    {displayName} hasn&apos;t shared any photos.
                </p>
            </section>
        )
    }

    const hasOverflow = total > initialCount
    const visiblePhotos = expanded ? photos : photos.slice(0, initialCount)
    const remaining = Math.max(0, total - initialCount)
    const useMosaic = total >= MOSAIC_THRESHOLD
    const activePhoto = activeIndex != null ? photos[activeIndex] : null

    const handleToggle = () => {
        setExpanded((prev) => !prev)
    }

    const handleOpen = (index) => {
        setActiveIndex(index)
    }

    const handleClose = () => {
        setActiveIndex(null)
    }

    const handleDialogChange = (open) => {
        if (!open) handleClose()
    }

    const handlePrev = () => {
        if (activeIndex == null) return
        setActiveIndex((prev) => (prev - 1 + total) % total)
    }

    const handleNext = () => {
        if (activeIndex == null) return
        setActiveIndex((prev) => (prev + 1) % total)
    }

    return (
        <section aria-labelledby="photo-gallery-title">
            <header className="flex items-end justify-between gap-3">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5">
                       
                        Gallery
                    </span>
                    <h2
                        id="photo-gallery-title"
                        className="mt-3 flex items-baseline gap-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                    >
                        Photos
                        <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold tracking-wide text-fuchsia-700 ring-1 ring-fuchsia-100">
                            {total}
                        </span>
                    </h2>
                </div>

                {hasOverflow ? (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500 ring-1 ring-gray-100">
                        Showing {visiblePhotos.length} of {total}
                    </span>
                ) : null}
            </header>

            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {visiblePhotos.map((photo, index) => {
                    return (
                        <li
                            key={photo.id ?? `${photo.url}-${index}`}
                            className="animate-in fade-in zoom-in-95 duration-300"
                        >
                            <button
                                type="button"
                                onClick={() => handleOpen(index)}
                                aria-label={`Open photo ${index + 1} of ${displayName}`}
                                className={cn(
                                    "group/photo relative block size-full overflow-hidden rounded-2xl bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100 outline-none ring-1 ring-black/5 shadow-sm",
                                    "transition-all duration-300 ease-out",
                                    "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/15 hover:ring-fuchsia-200",
                                    "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                                )}
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <img
                                        src={photo.url}
                                        alt={`Photo ${index + 1} of ${displayName}`}
                                        loading={index < initialCount ? "eager" : "lazy"}
                                        decoding="async"
                                        className="size-full object-cover transition-transform duration-500 ease-out group-hover/photo:scale-[1.06]"
                                    />

                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center justify-center rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/photo:opacity-100"
                                    >
                                        {index + 1} / {total}
                                    </span>
                                </div>
                            </button>
                        </li>
                    )
                })}
            </ul>

            {hasOverflow ? (
                <div className="mt-6 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={expanded}
                        aria-controls="photo-gallery-title"
                        className={cn(
                            "group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-fuchsia-700 outline-none",
                            "ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5",
                            "transition-all duration-200",
                            "hover:-translate-y-0.5 hover:shadow-md hover:shadow-fuchsia-500/15 hover:ring-fuchsia-200",
                            "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                        )}
                    >
                        <span className="relative z-10 inline-flex items-center gap-2">
                            {expanded ? (
                                <>
                                    <ChevronUp className="size-4 transition-transform duration-200 group-hover/cta:-translate-y-0.5" />
                                    Show less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="size-4 transition-transform duration-200 group-hover/cta:translate-y-0.5" />
                                    Show {remaining} more
                                </>
                            )}
                        </span>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-linear-to-r from-rose-200/0 via-fuchsia-200/50 to-violet-200/0 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                        />
                    </button>
                </div>
            ) : null}

            <Dialog open={activePhoto != null} onOpenChange={handleDialogChange}>
                <DialogContent className="max-w-3xl overflow-hidden border-0 bg-black p-0 ring-1 ring-white/10 sm:max-w-3xl">
                    <DialogTitle className="sr-only">
                        Photo {activeIndex != null ? activeIndex + 1 : ""} of {displayName}
                    </DialogTitle>

                    {activePhoto ? (
                        <div className="relative">
                            <img
                                src={activePhoto.url}
                                alt={`Photo ${activeIndex + 1} of ${displayName}`}
                                className="block max-h-[80vh] w-full object-contain"
                            />

                            {total > 1 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        aria-label="Previous photo"
                                        className={cn(
                                            "absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-gray-900 outline-none ring-1 ring-black/10 backdrop-blur",
                                            "transition-all duration-200 hover:scale-105 hover:bg-white",
                                            "focus-visible:ring-2 focus-visible:ring-fuchsia-500/60",
                                        )}
                                    >
                                        <ChevronDown className="size-4 rotate-90" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        aria-label="Next photo"
                                        className={cn(
                                            "absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-gray-900 outline-none ring-1 ring-black/10 backdrop-blur",
                                            "transition-all duration-200 hover:scale-105 hover:bg-white",
                                            "focus-visible:ring-2 focus-visible:ring-fuchsia-500/60",
                                        )}
                                    >
                                        <ChevronDown className="size-4 -rotate-90" />
                                    </button>

                                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/10 backdrop-blur">
                                        {activeIndex + 1} / {total}
                                    </span>
                                </>
                            ) : null}
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default PhotoGallery
