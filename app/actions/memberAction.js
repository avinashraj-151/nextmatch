"use server"

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