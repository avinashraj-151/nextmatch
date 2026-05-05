"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Camera,
    CheckCircle2,
    ImagePlus,
    Loader2,
    Save,
    Trash2,
    Undo2,
    X,
} from "lucide-react"
import { toast } from "sonner"

import { cn, getInitials } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    removeProfileImage,
    updateProfileImage,
} from "@/app/actions/memberAction"

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"]
const MAX_KB = 240
const MAX_BYTES = MAX_KB * 1024

const fileToDataUrl = (file) =>
    new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
    })

const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const preloadImage = (src) =>
    new Promise((resolve) => {
        if (!src) return resolve()
        const img = new Image()
        img.onload = resolve
        img.onerror = resolve
        img.src = src
    })

const ChangeProfilePhotoDialog = ({
    member,
    trigger,
    currentImage: currentImageProp,
    onImageChange,
}) => {
    const router = useRouter()
    const inputRef = useRef(null)

    const [open, setOpen] = useState(false)
    const [preview, setPreview] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState("")
    const [confirmRemove, setConfirmRemove] = useState(false)

    // Two-state machines: idle | saving / idle | removing.
    // On success we close the dialog right away (no celebration hold).
    const [savePhase, setSavePhase] = useState("idle")     // idle | saving
    const [removePhase, setRemovePhase] = useState("idle") // idle | removing

    const isBusy = savePhase === "saving" || removePhase === "removing"

    const displayName = member?.name?.trim() || "Member"
    const initials = getInitials(member?.name)
    const currentImage = currentImageProp ?? member?.image ?? null
    const visibleImage = preview?.dataUrl || currentImage

    const handleFile = useCallback(async (file) => {
        setError("")
        if (!file) return

        if (!ACCEPTED.includes(file.type)) {
            setError("Please upload a JPEG, PNG or WebP image.")
            return
        }

        if (file.size > MAX_BYTES) {
            setError(
                `File is too large (${formatBytes(file.size)}). Max size is ${MAX_KB} KB.`,
            )
            return
        }

        const dataUrl = await fileToDataUrl(file)
        setPreview({ file, dataUrl })
        setConfirmRemove(false)
    }, [])

    const handleInputChange = (e) => handleFile(e.target.files?.[0])

    const handleDragOver = (e) => {
        if (isBusy) return
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const handleDrop = (e) => {
        if (isBusy) return
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files?.[0])
    }

    const resetState = () => {
        setPreview(null)
        setError("")
        setIsDragging(false)
        setConfirmRemove(false)
        if (inputRef.current) inputRef.current.value = ""
    }

    const handleClose = (next) => {
        if (isBusy) return
        if (!next) resetState()
        setOpen(next)
    }

    const handleRevertSelection = () => {
        if (isBusy) return
        setPreview(null)
        setError("")
        if (inputRef.current) inputRef.current.value = ""
    }

    const handleSave = () => {
        if (!preview || isBusy) return

        const dataUrl = preview.dataUrl
        const file = preview.file
        const previousImage = currentImage

        // Optimistic: navbar + hero update instantly behind the dialog.
        onImageChange?.(dataUrl)
        setSavePhase("saving")

        ;(async () => {
            try {
                const formData = new FormData()
                formData.append("file", file)
                const result = await updateProfileImage(formData)
                if (result?.error) throw new Error(result.error)

                // Preload CDN URL so the swap from data URL → CDN is invisible.
                if (result.url) {
                    await preloadImage(result.url)
                    onImageChange?.(result.url)
                }

                toast.success("Profile photo updated")
                router.refresh()
                resetState()
                setSavePhase("idle")
                setOpen(false)
            } catch (err) {
                onImageChange?.(previousImage)
                setSavePhase("idle")
                toast.error(err?.message ?? "Couldn't update photo. Please try again.")
            }
        })()
    }

    const handleRemove = () => {
        if (!currentImage || isBusy) return
        if (!confirmRemove) {
            setConfirmRemove(true)
            return
        }

        const previousImage = currentImage

        onImageChange?.(null)
        setRemovePhase("removing")

        ;(async () => {
            try {
                const result = await removeProfileImage()
                if (result?.error) throw new Error(result.error)

                toast.success("Profile photo removed")
                router.refresh()
                resetState()
                setRemovePhase("idle")
                setOpen(false)
            } catch (err) {
                onImageChange?.(previousImage)
                setRemovePhase("idle")
                toast.error(err?.message ?? "Couldn't remove photo. Please try again.")
            }
        })()
    }

    const openFilePicker = () => {
        if (isBusy) return
        inputRef.current?.click()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent
                showCloseButton={false}
                className="!bg-white w-full max-w-md overflow-hidden rounded-3xl border-0 p-0 ring-1 ring-black/8 shadow-2xl shadow-fuchsia-900/20"
            >
                {/* gradient header */}
                <div className="relative overflow-hidden px-6 py-5 bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-white/10 blur-2xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-white/10 blur-xl"
                    />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                                <Camera className="size-5 text-white" />
                            </span>
                            <div>
                                <DialogTitle className="text-base font-semibold text-white">
                                    Change profile photo
                                </DialogTitle>
                                <p className="mt-0.5 text-xs text-white/75">
                                    JPEG, PNG, WebP — up to {MAX_KB} KB
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleClose(false)}
                            disabled={isBusy}
                            aria-label="Close dialog"
                            className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 disabled:opacity-50"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* body */}
                <div className="space-y-4 p-5">
                    <div className="flex flex-col items-center gap-4">
                        {/* preview + drop zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "group/drop relative size-48 overflow-hidden rounded-3xl ring-2 transition-all duration-200",
                                "bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100",
                                isDragging
                                    ? "ring-fuchsia-400 scale-[1.02] shadow-lg shadow-fuchsia-900/15"
                                    : "ring-fuchsia-200 shadow-sm",
                            )}
                        >
                            {visibleImage ? (
                                <img
                                    src={visibleImage}
                                    alt={`Photo of ${displayName}`}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="grid size-full place-items-center">
                                    <span className="select-none bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
                                        {initials}
                                    </span>
                                </div>
                            )}

                            {/* upload overlay (hover or drag) — hidden while saving/done */}
                            {!isBusy ? (
                                <button
                                    type="button"
                                    onClick={openFilePicker}
                                    aria-label={visibleImage ? "Replace profile photo" : "Upload profile photo"}
                                    className={cn(
                                        "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-white transition-opacity duration-200",
                                        "bg-black/55 backdrop-blur-[2px]",
                                        isDragging
                                            ? "opacity-100"
                                            : visibleImage
                                                ? "opacity-0 group-hover/drop:opacity-100 focus-visible:opacity-100"
                                                : "opacity-100 bg-black/30",
                                    )}
                                >
                                    <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                                        <ImagePlus className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold">
                                        {isDragging
                                            ? "Drop it here"
                                            : visibleImage
                                                ? "Click or drop to replace"
                                                : "Click or drop to upload"}
                                    </span>
                                </button>
                            ) : null}

                            {/* working overlay — frosted backdrop + spinner */}
                            {isBusy ? (
                                <div className="absolute inset-0 z-30 grid place-items-center bg-white/55 backdrop-blur-sm animate-in fade-in duration-200">
                                    <span className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-fuchsia-900/15 ring-1 ring-fuchsia-100">
                                        <Loader2 className="size-6 animate-spin text-fuchsia-600" />
                                    </span>
                                </div>
                            ) : null}

                            {/* selected pill + revert — hidden while busy */}
                            {preview && !isBusy ? (
                                <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between">
                                    <span className="inline-flex max-w-[70%] items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
                                        <span className="truncate">{preview.file.name}</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRevertSelection}
                                        aria-label="Revert to current photo"
                                        className="flex size-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-red-500/80"
                                    >
                                        <Undo2 className="size-3.5" />
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        {/* file meta */}
                        {preview ? (
                            <p className="text-[11px] font-medium text-gray-500">
                                {formatBytes(preview.file.size)} of {MAX_KB} KB
                            </p>
                        ) : (
                            <p className="text-[11px] font-medium text-gray-400">
                                Square images look best.
                            </p>
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED.join(",")}
                        className="sr-only"
                        onChange={handleInputChange}
                        tabIndex={-1}
                    />

                    {error ? (
                        <p className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                            <X className="size-3.5 shrink-0" />
                            {error}
                        </p>
                    ) : null}

                    {/* footer */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={!currentImage || isBusy}
                            aria-busy={removePhase === "removing"}
                            aria-label={
                                removePhase === "removing"
                                    ? "Removing profile photo"
                                    : confirmRemove
                                        ? "Confirm remove profile photo"
                                        : "Remove profile photo"
                            }
                            className={cn(
                                "inline-flex min-w-[124px] items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40",
                                removePhase === "removing"
                                    ? "bg-red-600 text-white shadow-md shadow-red-900/25"
                                    : confirmRemove
                                        ? "bg-red-600 text-white shadow-md shadow-red-900/20 hover:bg-red-700"
                                        : "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50",
                            )}
                        >
                            {removePhase === "removing" ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Removing…
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4" />
                                    <span>{confirmRemove ? "Confirm remove" : "Remove"}</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleClose(false)}
                                disabled={isBusy}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!preview || isBusy}
                                aria-busy={savePhase === "saving"}
                                className={cn(
                                    "group/save relative inline-flex min-w-[124px] items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none",
                                    "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                                    "shadow-md shadow-fuchsia-900/20 transition-all duration-200",
                                    savePhase === "idle" && "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-900/25",
                                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none",
                                )}
                            >
                                {savePhase === "saving" ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Save
                                    </>
                                )}
                                {savePhase === "idle" ? (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/save:translate-x-[300%]"
                                    />
                                ) : null}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeProfilePhotoDialog
