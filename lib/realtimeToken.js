"use server"

import crypto from "node:crypto"

import { auth } from "@/lib/schemas/auth"

const TOKEN_TTL_SECONDS = 60 * 60 // 1 hour

// Supabase signs JWTs with HS256, so we sign the same way using the
// project's JWT secret. We avoid pulling in `jsonwebtoken` for ~15 lines.
const toBase64Url = (input) =>
    Buffer.from(input)
        .toString("base64")
        .replace(/=+$/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")

const signRealtimeJwt = (userId, secret) => {
    const issuedAt = Math.floor(Date.now() / 1000)
    const expiresAt = issuedAt + TOKEN_TTL_SECONDS

    const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    // `role: "authenticated"` is what Supabase Realtime RLS policies
    // check against; `sub` carries our user id so policies can match it.
    const payload = toBase64Url(
        JSON.stringify({
            iss: "supabase",
            sub: userId,
            role: "authenticated",
            aud: "authenticated",
            iat: issuedAt,
            exp: expiresAt,
        }),
    )

    const signingInput = `${header}.${payload}`
    const signature = crypto
        .createHmac("sha256", secret)
        .update(signingInput)
        .digest("base64")
        .replace(/=+$/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")

    return { token: `${signingInput}.${signature}`, expiresAt: expiresAt * 1000 }
}

export async function getRealtimeToken() {
    try {
        const session = await auth()
        const userId = session?.user?.id
        if (!userId) return { error: "Unauthorized" }

        const secret = process.env.SUPABASE_JWT_SECRET
        if (!secret) return { error: "Realtime is not configured" }

        const { token, expiresAt } = signRealtimeJwt(userId, secret)
        return { success: true, data: { token, expiresAt, userId } }
    } catch (error) {
        return { error: "Failed to issue realtime token" }
    }
}
