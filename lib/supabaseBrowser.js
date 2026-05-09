"use client"

import { createClient } from "@supabase/supabase-js"

// Module-level singleton: every client component that imports this file
// shares ONE websocket connection to Supabase Realtime. Creating a new
// client per component would open a new websocket each time.
let cachedClient = null

const getSupabaseBrowserClient = () => {
    if (cachedClient) return cachedClient

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
        throw new Error(
            "Supabase browser client missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        )
    }

    cachedClient = createClient(url, anonKey, {
        // We use NextAuth, not Supabase Auth, so don't let the SDK
        // try to manage a Supabase session in localStorage.
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    return cachedClient
}

// Hand the realtime websocket a JWT minted by our server action.
// Calling this also re-authenticates an already-open connection,
// which is what we want when the token is refreshed.
const setRealtimeAuthToken = (token) => {
    const client = getSupabaseBrowserClient()
    client.realtime.setAuth(token)
    return client
}

export { getSupabaseBrowserClient, setRealtimeAuthToken }
