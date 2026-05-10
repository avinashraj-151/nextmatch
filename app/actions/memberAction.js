"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/schemas/auth"

import prisma from "@/lib/prisma"

export async function getMembers() {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }
  const members = await prisma.member.findMany({
    where: {
      userId: {
        not: session.user.id,
      },
    },
  });
  // console.log("members", members);

  if (!members) {
    return { error: "No members found" }
  }
  return { success: true, data: members };
}


export async function getCurrentMember() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized", code: "UNAUTHORIZED" }
    }
    const member = await prisma.member.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        photos: {
          orderBy: { id: "desc" },
        },
      },
    })
    if (!member) {
      return { error: "Profile not found", code: "PROFILE_NOT_FOUND" }
    }
    return { success: true, data: member }
  } catch (error) {
    return { error: "Error getting your profile" }
  }
}


export async function getMemberById(userId) {

  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }
    if (session.user.id === userId) {
      return { error: "You cannot view your own profile" }
    }
    const member = await prisma.member.findUnique({
      where: {
        userId: userId,
      },
      include: {
        photos: {
          orderBy: { id: "desc" },
        },
      },
    });
    if (!member) {
      return { error: "Member not found" }
    }
    return { success: true, data: member };
  } catch (error) {
    // console.error("Error getting member by id", error);
    return { error: "Error getting member by id" }
  }
}


const MIN_AGE_YEARS = 18

const yearsBetween = (from, to) => {
  let years = to.getFullYear() - from.getFullYear()
  const monthDelta = to.getMonth() - from.getMonth()
  const isBeforeAnniversary =
    monthDelta < 0 || (monthDelta === 0 && to.getDate() < from.getDate())
  if (isBeforeAnniversary) years -= 1
  return years
}

const parseDateOfBirth = (raw) => {
  if (raw == null || raw === "") return { skip: true }
  const trimmed = typeof raw === "string" ? raw.trim() : raw
  if (trimmed === "") return { skip: true }

  const date = trimmed instanceof Date ? trimmed : new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return { error: "Please enter a valid date of birth." }
  }
  const now = new Date()
  if (date.getTime() > now.getTime()) {
    return { error: "Date of birth cannot be in the future." }
  }
  if (yearsBetween(date, now) < MIN_AGE_YEARS) {
    return { error: `You must be at least ${MIN_AGE_YEARS} to use NextMatch.` }
  }
  return { value: date }
}

export async function updateMemberProfile(data) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    })
    if (!member) {
      return { error: "Profile not found" }
    }

    const dob = parseDateOfBirth(data.dateOfBirth)
    if (dob.error) {
      return { error: dob.error }
    }

    const updated = await prisma.member.update({
      where: { userId: session.user.id },
      data: {
        name: data.name?.trim() || member.name,
        description: data.description?.trim() ?? member.description,
        city: data.city?.trim() || member.city,
        country: data.country?.trim() || member.country,
        gender: data.gender?.trim() || member.gender,
        dateOfBirth: dob.skip ? member.dateOfBirth : dob.value,
        updatedAt: new Date(),
      },
    })

    return { success: true, data: updated }
  } catch (error) {
    return { error: "Failed to update profile. Please try again." }
  }
}

export async function deletePhoto(photoId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    })

    if (!member) {
      return { error: "Member not found" }
    }
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    })
    if (member.id != photo.memberId) {
      return { error: "Unauthorized" }
    }

    // Delete from Supabase Storage if publicId exists
    if (photo.publicId) {
      const { supabase } = await import("@/lib/supabase")
      await supabase.storage.from("photos").remove([photo.publicId])
    }

    await prisma.photo.delete({
      where: { id: photoId },
    })

    // If this was the profile image, clear it
    if (member.image === photo.url) {
      await prisma.member.update({
        where: { id: member.id },
        data: { image: null },
      })
    }

    revalidatePath("/members/profile")
    return { success: true }

  } catch (error) {
    console.log(error)
    return { error: "Failed to delete photo. Please try again" }
  }
}


export async function uplodeUserPhoto(formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    })
    if (!member) {
      return { error: "Member not found" }
    }

    const file = formData.get("file")
    if (!file || !(file instanceof File)) {
      return { error: "No file provided" }
    }

    // 1. Upload to Supabase Storage
    const { supabase } = await import("@/lib/supabase")
    const ext = file.name.split(".").pop()
    const filePath = `${member.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.log("Upload error:", uploadError)
      return { error: "Failed to upload image to storage" }
    }

    // 2. Get the public URL
    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // 3. Save Photo record in the database
    await prisma.photo.create({
      data: {
        url: publicUrl,
        publicId: filePath,
        memberId: member.id,
      },
    })

    // 4. If member has no profile image yet, set this as their profile image
    if (!member.image) {
      await prisma.member.update({
        where: { id: member.id },
        data: { image: publicUrl },
      })
    }

    revalidatePath("/members/profile")

    return { success: true }

  } catch (error) {
    console.log(error)
    return { error: "Failed to upload photo. Please try again" }
  }
}


export async function setProfileImage(photoId) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    return { success: true }

  } catch (error) {
    console.log(error)
    return { error: "Failed to set profile image" }
  }
}


// Profile image dedicated upload — capped at 240KB.
const PROFILE_IMAGE_MAX_BYTES = 240 * 1024
const PROFILE_IMAGE_ACCEPTED = ["image/jpeg", "image/png", "image/webp"]
const STORAGE_PATH_MARKER = "/storage/v1/object/public/photos/"

// Extract the bucket-relative storage path from a Supabase public URL.
const extractStoragePath = (publicUrl) => {
  if (!publicUrl) return null
  const idx = publicUrl.indexOf(STORAGE_PATH_MARKER)
  if (idx === -1) return null
  return publicUrl.slice(idx + STORAGE_PATH_MARKER.length)
}

// Remove the previous profile image from storage only when it isn't also
// referenced by a Photo row (i.e. it was a profile-only upload, not a
// gallery photo that the member chose as their avatar).
const cleanupOrphanProfileImage = async (memberId, previousUrl, supabase) => {
  if (!previousUrl) return
  const stillReferenced = await prisma.photo.findFirst({
    where: { memberId, url: previousUrl },
    select: { id: true },
  })
  if (stillReferenced) return
  const path = extractStoragePath(previousUrl)
  if (!path) return
  await supabase.storage.from("photos").remove([path])
}

export async function updateProfileImage(formData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    })
    if (!member) {
      return { error: "Member not found" }
    }

    const file = formData.get("file")
    if (!file || !(file instanceof File)) {
      return { error: "No file provided" }
    }

    if (!PROFILE_IMAGE_ACCEPTED.includes(file.type)) {
      return { error: "Please upload a JPEG, PNG or WebP image." }
    }

    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      return { error: "File is too large. Max size is 240 KB." }
    }

    const { supabase } = await import("@/lib/supabase")
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
    const filePath = `${member.id}/profile-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.log("Profile image upload error:", uploadError)
      return { error: "Failed to upload image to storage" }
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl
    const previousImage = member.image

    await prisma.member.update({
      where: { id: member.id },
      data: { image: publicUrl },
    })

    // Best-effort cleanup of the old profile-only image. Storage failures
    // shouldn't break the user-facing update, so we log and move on.
    if (previousImage && previousImage !== publicUrl) {
      try {
        await cleanupOrphanProfileImage(member.id, previousImage, supabase)
      } catch (cleanupErr) {
        console.log("Profile image cleanup error:", cleanupErr)
      }
    }

    revalidatePath("/members/profile")
    return { success: true, url: publicUrl }

  } catch (error) {
    console.log(error)
    return { error: "Failed to update profile photo. Please try again" }
  }
}

export async function removeProfileImage() {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    })
    if (!member) {
      return { error: "Member not found" }
    }

    if (!member.image) {
      return { success: true }
    }

    const previousImage = member.image

    await prisma.member.update({
      where: { id: member.id },
      data: { image: null },
    })

    try {
      const { supabase } = await import("@/lib/supabase")
      await cleanupOrphanProfileImage(member.id, previousImage, supabase)
    } catch (cleanupErr) {
      console.log("Profile image cleanup error:", cleanupErr)
    }

    revalidatePath("/members/profile")
    return { success: true }

  } catch (error) {
    console.log(error)
    return { error: "Failed to remove profile photo. Please try again" }
  }
}
