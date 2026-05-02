import { format, formatDistanceToNow } from "date-fns"

const toDate = (value) => {
    if (!value) return null
    const parsed = value instanceof Date ? value : new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const formatJoinedAgo = (value) => {
    const date = toDate(value)
    if (!date) return null
    return formatDistanceToNow(date, { addSuffix: true })
}

export const formatBirthday = (value) => {
    const date = toDate(value)
    if (!date) return null
    return format(date, "MMM d, yyyy")
}

export const formatJoinedOn = (value) => {
    const date = toDate(value)
    if (!date) return null
    return format(date, "MMM yyyy")
}

export const daysSince = (value) => {
    const date = toDate(value)
    if (!date) return 0
    const diff = Date.now() - date.getTime()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export const buildGalleryPhotos = (member) => {
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

export const buildCompletion = (member, photoCount = 0) => {
    const items = [
        { id: "photo", label: "Add a profile photo", done: Boolean(member?.image) },
        { id: "gallery", label: "Upload at least 3 gallery photos", done: photoCount >= 3 },
        { id: "bio", label: "Write a short bio (50+ characters)", done: (member?.description?.trim()?.length ?? 0) >= 50 },
        { id: "location", label: "Add your city and country", done: Boolean(member?.city && member?.country) },
        { id: "gender", label: "Set your gender", done: Boolean(member?.gender) },
        { id: "dob", label: "Confirm your date of birth", done: Boolean(member?.dateOfBirth) },
    ]
    const completed = items.filter((item) => item.done).length
    const pct = Math.round((completed / items.length) * 100)
    return { items, pct, completed, total: items.length }
}
