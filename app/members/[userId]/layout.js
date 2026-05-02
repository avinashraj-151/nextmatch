import { notFound } from "next/navigation"

import { getMemberById } from "@/app/actions/memberAction"
import MemberSidebar from "@/app/members/membersidebar"
import PhotoGallery from "./photo-gallery"

const PHOTOS_INITIAL_COUNT = 10

const buildGalleryPhotos = (member) => {
    const list = []
    const seen = new Set()

    if (Array.isArray(member?.photos)) {
        member.photos.forEach((photo) => {
            if (!photo?.url || seen.has(photo.url)) return
            list.push({ id: photo.id, url: photo.url })
            seen.add(photo.url)
        })
    }

    return list
}

export default async function MemberDetailLayout({ children, params }) {
    const { userId } = await params
    const result = await getMemberById(userId)

    if (result?.error === "Member not found") {
        notFound()
    }

    const member = result?.data
    if (!member) {
        notFound()
    }

    const galleryPhotos = buildGalleryPhotos(member)
    const displayName = member.name?.trim() || "Member"

    return (
        <main className="relative isolate min-h-full">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
            />

            <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
                    <MemberSidebar member={member} />

                    <div className="space-y-10">
                        {children}
                        <PhotoGallery
                            photos={galleryPhotos}
                            displayName={displayName}
                            initialCount={PHOTOS_INITIAL_COUNT}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
