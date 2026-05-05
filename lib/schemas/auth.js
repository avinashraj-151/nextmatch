import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { loginSchema } from "@/lib/schemas/login"


export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials)
                if (!parsed.success) return null

                const { email, password } = parsed.data

                const user = await prisma.user.findUnique({
                    where: { email },
                })
                if (!user || !user.passwordHash) return null

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.passwordHash,
                )
                if (!passwordsMatch) return null

                return user
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id
            }
            // Always refresh image from Member (single source of truth)
            // so profile photo changes are reflected in the navbar avatar
            if (token.sub) {
                const member = await prisma.member.findUnique({
                    where: { userId: token.sub },
                    select: { image: true },
                })
                token.image = member?.image ?? null
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                // Pass the fresh image from the token into the session
                session.user.image = token.image ?? session.user.image
            }
            return session
        },
    },
})
