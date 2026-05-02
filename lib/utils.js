import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// get initials from name or email
export const getInitials = (name = "", email = "") => {
  const source = name?.trim() || email?.trim() || ""
  if (!source) return "U"
  const parts = source.split(/[\s@.]+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => part[0]).join("")
  return initials.toUpperCase() || "U"
}

// calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null
  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null

  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDelta = now.getMonth() - dob.getMonth()
  const isBeforeBirthdayThisYear =
    monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())
  if (isBeforeBirthdayThisYear) age -= 1
  return age >= 0 ? age : null
}

// check if member is new
export const isNewMember = (date, withinDays = 7) => {
  if (!date) return false
  const created = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(created.getTime())) return false
  const diffMs = Date.now() - created.getTime()
  return diffMs >= 0 && diffMs <= withinDays * 24 * 60 * 60 * 1000
}
