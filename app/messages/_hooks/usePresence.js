"use client"

import { useEffect, useState } from "react"

import { getRealtimeToken } from "@/lib/realtimeToken"
import { PRESENCE_TOPIC } from "@/lib/realtime"
import { getSupabaseBrowserClient, setRealtimeAuthToken } from "@/lib/supabaseBrowser"

// Single global channel. Every signed-in browser joins it, tracks
// itself with `{ userId }`, and Supabase Realtime keeps an authoritative
// list of who's online. When a tab closes, Supabase fires `leave`
// after a short grace period (configurable but defaults are sane).

const usePresence = () => {
    const [onlineUserIds, setOnlineUserIds] = useState(() => new Set())

    useEffect(function joinPresence() {
        let cancelled = false
        let channel = null

        const applyState = (state) => {
            // presenceState() returns `{ presenceKey: [{ userId, ... }, ...] }`.
            // We use userId as the key, so Object.keys is the online set.
            // Building a fresh Set keeps reference equality reliable for
            // downstream useMemo deps.
            setOnlineUserIds(new Set(Object.keys(state ?? {})))
        }

        const setup = async () => {
            const token = await getRealtimeToken()
            if (!token?.success || cancelled) return

            setRealtimeAuthToken(token.data.token)
            const userId = token.data.userId

            const client = getSupabaseBrowserClient()
            channel = client.channel(PRESENCE_TOPIC, {
                // `key: userId` makes Supabase index this user's presence
                // entries by userId across tabs/devices, so the same person
                // with two windows shows up as ONE online entry.
                config: { presence: { key: userId }, private: false },
            })

            channel
                .on("presence", { event: "sync" }, function onSync() {
                    applyState(channel.presenceState())
                })
                .subscribe(async function onSubscribed(status) {
                    if (status !== "SUBSCRIBED" || cancelled) return
                    // Track ourselves AFTER subscribe — Supabase requires the
                    // channel to be joined before we can publish presence.
                    await channel.track({ userId, at: Date.now() })
                })
        }

        setup()

        return function teardown() {
            cancelled = true
            if (channel) {
                const client = getSupabaseBrowserClient()
                // `untrack()` is implicit when the channel is removed.
                client.removeChannel(channel)
            }
        }
        // No deps — single global channel for the lifetime of the page.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return onlineUserIds
}

export default usePresence
