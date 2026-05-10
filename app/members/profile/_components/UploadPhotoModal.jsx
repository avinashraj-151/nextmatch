"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"

import { uplodeUserPhoto } from "@/app/actions/memberAction"

// ─── helpers ────────────────────────────────────────────────────────────────

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_MB = 8
const MAX_BYTES = MAX_MB * 1024 * 1024

function fileToDataUrl(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
    })
}

// ─── UploadPhotoModal ────────────────────────────────────────────────────────

export default function UploadPhotoModal({ open, onOpenChange }) {
    const router = useRouter()
    const inputRef = useRef(null)
    const [isPending, startTransition] = useTransition()

    const [preview, setPreview] = useState(null)   // { file, dataUrl }
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState("")

    // ── file validation + preview ──────────────────────────────────────────
    const handleFile = useCallback(async (file) => {
        setError("")
        if (!file) return
        if (!ACCEPTED.includes(file.type)) {
            setError("Please upload a JPEG, PNG, WebP or GIF image.")
            return
        }
        if (file.size > MAX_BYTES) {
            setError(`File is too large. Max size is ${MAX_MB} MB.`)
            return
        }
        const dataUrl = await fileToDataUrl(file)
        setPreview({ file, dataUrl })
    }, [])

    // ── input change ──────────────────────────────────────────────────────
    const onInputChange = (e) => handleFile(e.target.files?.[0])

    // ── drag handlers ──────────────────────────────────────────────────────
    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
    const onDragLeave = () => setIsDragging(false)
    const onDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files?.[0])
    }

    // ── upload ─────────────────────────────────────────────────────────────
    const handleUpload = () => {
        if (!preview) return
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("file", preview.file)
                const result = await uplodeUserPhoto(formData)
                if (result?.error) throw new Error(result.error)

                toast.success("Photo uploaded!")
                router.refresh()
                handleClose()
            } catch (err) {
                toast.error(err?.message ?? "Upload failed. Please try again.")
            }
        })
    }

    // ── close / reset ──────────────────────────────────────────────────────
    const handleClose = () => {
        if (isPending) return
        setPreview(null)
        setError("")
        setIsDragging(false)
        if (inputRef.current) inputRef.current.value = ""
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                showCloseButton={false}
                className="!bg-white w-full max-w-md overflow-hidden rounded-3xl border-0 p-0 ring-1 ring-black/8 shadow-2xl shadow-fuchsia-900/20"
            >
                {/* ── Gradient header ─────────────────────────────────────── */}
                <div className="relative overflow-hidden px-6 py-5 bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600">
                    <div aria-hidden className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-white/10 blur-2xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-white/10 blur-xl" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                                <Camera className="size-5 text-white" />
                            </span>
                            <div>
                                <DialogTitle className="text-base font-semibold text-white">
                                    Add a photo
                                </DialogTitle>
                                <p className="text-xs text-white/70 mt-0.5">
                                    JPEG · PNG · WebP · GIF — up to {MAX_MB} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isPending}
                            className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 disabled:opacity-50"
                            aria-label="Close"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* ── Body ────────────────────────────────────────────────── */}
                <div className="p-5 space-y-4">

                    {/* ── Drop zone / Preview ──────────────────────────────── */}
                    {preview ? (
                        /* Preview state */
                        <div className="relative overflow-hidden rounded-2xl ring-1 ring-fuchsia-200 shadow-sm">
                            <img
                                src={preview.dataUrl}
                                alt="Preview"
                                className="h-56 w-full object-cover"
                            />
                            {/* overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                            {/* filename chip */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">
                                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                                    <span className="max-w-[180px] truncate">{preview.file.name}</span>
                                </span>
                                <button
                                    onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = "" }}
                                    className="flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-red-500/80"
                                    aria-label="Remove selected photo"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Drop zone */
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className={cn(
                                "group/dz relative flex h-48 w-full flex-col items-center justify-center gap-3",
                                "rounded-2xl border-2 border-dashed transition-all duration-200",
                                isDragging
                                    ? "border-fuchsia-400 bg-fuchsia-50 scale-[1.01]"
                                    : "border-fuchsia-200 bg-fuchsia-50/50 hover:border-fuchsia-400 hover:bg-fuchsia-50",
                            )}
                        >
                            {/* glow blob */}
                            <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/40 blur-3xl" />

                            <span className={cn(
                                "relative flex size-14 items-center justify-center rounded-2xl transition-all duration-200",
                                "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-lg shadow-fuchsia-900/20",
                                isDragging ? "scale-110" : "group-hover/dz:scale-105",
                            )}>
                                <ImagePlus className="size-6 text-white" />
                            </span>

                            <div className="relative text-center">
                                <p className="text-sm font-semibold text-gray-800">
                                    {isDragging ? "Drop it here!" : "Drag & drop or click to browse"}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    Supports JPEG, PNG, WebP, GIF up to {MAX_MB} MB
                                </p>
                            </div>
                        </button>
                    )}

                    {/* hidden file input */}
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED.join(",")}
                        className="sr-only"
                        onChange={onInputChange}
                        tabIndex={-1}
                    />

                    {/* error */}
                    {error && (
                        <p className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                            <X className="size-3.5 shrink-0" />
                            {error}
                        </p>
                    )}

                    {/* ── Footer actions ───────────────────────────────────── */}
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isPending}
                            className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={!preview || isPending}
                            className={cn(
                                "group/upload relative flex-1 overflow-hidden rounded-xl py-2.5 text-sm font-semibold text-white outline-none",
                                "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                                "shadow-md shadow-fuchsia-900/20 transition-all duration-200",
                                "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-900/25",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0",
                            )}
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                {isPending
                                    ? <><Loader2 className="size-4 animate-spin" /> Uploading…</>
                                    : <><Upload className="size-4" /> Upload photo</>
                                }
                            </span>
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/upload:translate-x-[300%]"
                            />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
