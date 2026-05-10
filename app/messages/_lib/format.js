import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    format,
    isToday,
    isYesterday,
} from "date-fns"

function toDate(input) {
    return input instanceof Date ? input : new Date(input)
}

// Compact "now / 2m / 3h / Yesterday / Mon / Mar 4" — used in conversation rows.
export function formatRelativeShort(input) {
    const date = toDate(input)
    const now = new Date()
    const seconds = differenceInSeconds(now, date)
    if (seconds < 45) return "now"

    const minutes = differenceInMinutes(now, date)
    if (minutes < 60) return `${minutes}m`

    if (isToday(date)) return `${differenceInHours(now, date)}h`
    if (isYesterday(date)) return "Yesterday"

    const days = differenceInDays(now, date)
    if (days < 7) return format(date, "EEE")
    return format(date, "MMM d")
}

// Date dividers inside the message thread.
export function formatDateDivider(input) {
    const date = toDate(input)
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"

    const days = differenceInDays(new Date(), date)
    if (days < 7) return format(date, "EEEE")
    return format(date, "MMMM d, yyyy")
}

// "10:42 AM" — used under the last bubble of a group.
export function formatBubbleTime(input) {
    return format(toDate(input), "p")
}

// "Active now" / "Active 5m ago" / "Active yesterday" / "Last seen Mar 4"
export function formatPresence({ online, lastSeenAt }) {
    if (online) return "Active now"
    if (!lastSeenAt) return "Offline"

    const date = toDate(lastSeenAt)
    const minutes = differenceInMinutes(new Date(), date)
    if (minutes < 1) return "Active just now"
    if (minutes < 60) return `Active ${minutes}m ago`

    if (isToday(date)) return `Active ${differenceInHours(new Date(), date)}h ago`
    if (isYesterday(date)) return "Active yesterday"

    const days = differenceInDays(new Date(), date)
    if (days < 7) return `Active ${format(date, "EEEE")}`
    return `Last seen ${format(date, "MMM d")}`
}

// Returns YYYY-MM-DD-style key for grouping messages by calendar day.
export function dayKey(input) {
    return format(toDate(input), "yyyy-MM-dd")
}
