"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, Images, Loader2, MoreHorizontal, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { deletePhoto, updateProfilePhoto } from "@/app/actions/memberAction"
import UploadPhotoModal from "./UploadPhotoModal"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function PhotoCard({ photo, index, total }) {
    // console.log("PhotoCard", photo)
    const router = useRouter()
    const [isDeleting, startDeleting] = useTransition()

    const isPending = isDeleting

    const handleDelete = () => {
        startDeleting(async () => {
            const result = await deletePhoto(photo.id)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Photo deleted.")
                router.refresh()
            }
        })
    }

    return (
        <figure
            className={cn(
                "group/photo relative aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100 ring-1 ring-black/5 shadow-sm",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/15 hover:ring-fuchsia-200",
                isPending && "opacity-70 pointer-events-none",
            )}
        >
            <img
                src={photo.url}
                alt={`Gallery photo ${index + 1}`}
                loading={index < 8 ? "eager" : "lazy"}
                decoding="async"
                className="size-full object-cover transition-transform duration-500 ease-out group-hover/photo:scale-[1.06]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100"
            />

            {/* Loading overlay */}
            {isPending && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <Loader2 className="size-6 animate-spin text-fuchsia-600" />
                </div>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md border border-white/20 shadow-sm transition-all duration-300 opacity-0 group-hover/photo:opacity-100 data-[state=open]:opacity-100 data-[state=open]:bg-black/40 hover:bg-black/40 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-56 rounded-2xl border-0 p-1.5 ring-1 ring-black/5 shadow-2xl shadow-fuchsia-900/15 !bg-white"
                >
                    <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer gap-2 rounded-lg px-2 py-2 text-sm font-medium focus:bg-red-50 focus:text-red-600 text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600"
                        onSelect={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="size-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center justify-center rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/photo:opacity-100"
            >
                {index + 1} / {total}
            </span>
        </figure>
    )
}

export default function ProfileGallery({ photos = [] }) {
    const [uploadOpen, setUploadOpen] = useState(false)
    return (
        <section aria-labelledby="profile-photos-title" className="space-y-5">
            <header className="flex items-end justify-between gap-3">
                <div>
                    <div className="flex flex-row justify-center items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-800">Photos</h3>
                        <p className="text-sm text-gray-600">
                            {photos.length}
                        </p>
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => setUploadOpen(true)}
                        className={cn(
                            "group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none",
                            "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                            "shadow-md shadow-fuchsia-900/20 transition-all duration-200",
                            "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-900/25",
                            "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                        )}
                    >
                        <Camera className="size-4" />
                        Add photos
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                        />
                    </button>
                </div>
            </header>

            <UploadPhotoModal open={uploadOpen} onOpenChange={setUploadOpen} />
            {photos.length === 0 ? (
                <div className="relative overflow-hidden rounded-3xl border border-dashed border-fuchsia-200 bg-white/60 p-10 text-center">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-fuchsia-200/40 blur-3xl"
                    />
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/15">
                        <Images className="size-7" />
                    </span>
                    <h4 className="mt-4 text-lg font-semibold tracking-tight text-gray-900">
                        Your gallery is empty
                    </h4>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                        Add a few photos to bring your profile to life.
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                    {photos.map((photo, index) => (
                        <li
                            key={photo.id ?? `${photo.url}-${index}`}
                            className="animate-in fade-in zoom-in-95 duration-300"
                        >
                            <PhotoCard photo={photo} index={index} total={photos.length} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
