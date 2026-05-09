"use server"

import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import { AuthError } from "next-auth"

import { registerSchema } from "@/lib/schemas/registerSchema"
import { loginSchema } from "@/lib/schemas/login"
import prisma from "@/lib/prisma"
import { signIn, signOut } from "@/lib/schemas/auth"

export async function signInUser(data) {
    const parsed = loginSchema.safeParse(data)
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.issues[0]?.message ?? "Invalid form data",
        }
    }

    try {
        await signIn("credentials", {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        })

        return { success: true, data: "Logged in successfully" }
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return {
                    success: false,
                    error: "Invalid email or password",
                }
            }
            return {
                success: false,
                error: "Authentication failed. Please try again.",
            }
        }

        return {
            success: false,
            error: "Something went wrong. Please try again.",
        }
    }
}




export async function registerUser(data) {
    const result = registerSchema.safeParse(data)
    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0]?.message ?? "Invalid form data",
        }
    }

    const { name, email, password } = result.data

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: { name, email, passwordHash },
            select: { id: true, name: true, email: true },
        })
        await prisma.member.create({
            data: { userId: user.id, name: user.name },
        })

        return { success: true, user }
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                field: "email",
                error: "An account with this email already exists",
            }
        }
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        }
    }
}

export async function signOutUser() {
    await signOut({ redirectTo: "/" })
}

export async function getUserByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email },
    })
    return user
}

export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
    })
    return user
}