import NextAuth from "next-auth"
import { NextResponse } from "next/server"

import authConfig from "./auth.config"
import { publicRouter, authRouter } from "./route"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isAuthenticated = !!req.auth
    const isPublicRoute = publicRouter.includes(nextUrl.pathname)
    const isAuthRoute = authRouter.includes(nextUrl.pathname)

    if (isPublicRoute) {
        return NextResponse.next()
    }

    if (isAuthRoute) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/members", nextUrl))
        }
        return NextResponse.next()
    }

    if (!isPublicRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}
