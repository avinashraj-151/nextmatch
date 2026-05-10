import { getCurrentMember } from "@/app/actions/memberAction"

import ProfileAbout from "./_components/ProfileAbout"
import ProfileDetails from "./_components/ProfileDetails"
import ProfileEmptyState from "./_components/ProfileEmptyState"
import ProfileGallery from "./_components/ProfileGallery"
import ProfileHero from "./_components/ProfileHero"
import ProfileStats from "./_components/ProfileStats"
import ProfileStrength from "./_components/ProfileStrength"
import {
    buildCompletion,
    buildGalleryPhotos,
    daysSince,
    formatJoinedOn,
} from "./_lib/profile"

export default async function Profile() {
    const result = await getCurrentMember()
    // console.log(result.data)

    if (!result?.success) {
        const message =
            result?.code === "PROFILE_NOT_FOUND"
                ? "Tell us a little about yourself to start matching."
                : result?.error ?? "We couldn't load your profile right now."
        return <ProfileEmptyState message={message} />
    }

    const member = result.data
    const galleryPhotos = buildGalleryPhotos(member)
    const completion = buildCompletion(member, galleryPhotos.length)
    const memberDays = daysSince(member.createdAt)
    const joinedOn = formatJoinedOn(member.createdAt)
    const bio = member.description?.trim() ?? ""
    const isProfileComplete = completion.pct >= 100

    return (
        <section aria-labelledby="profile-page-title" className="space-y-8">
            <ProfileHero member={member} />

            <ProfileStats
                photoCount={galleryPhotos.length}
                memberDays={memberDays}
                joinedOn={joinedOn}
                completion={completion}
            />

            {isProfileComplete ? (
                <ProfileAbout bio={bio} />
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <ProfileAbout bio={bio} className="lg:col-span-2" />
                    <ProfileStrength completion={completion} />
                </div>
            )}

            <ProfileDetails member={member} />

            <ProfileGallery photos={galleryPhotos} />
        </section>
    )
}
