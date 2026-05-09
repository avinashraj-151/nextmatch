"use client"

import { useEffect, useRef } from "react"

import { getRealtimeToken } from "@/lib/realtimeToken"
import { inboxTopic, RealtimeEvents } from "@/lib/realtime"
import { getSupabaseBrowserClient, setRealtimeAuthToken } from "@/lib/supabaseBrowser"

// Refresh the JWT a few minutes before it expires so the websocket
// never falls back to anon credentials mid-session.
const REFRESH_LEAD_MS = 5 * 60 * 1000
const MIN_REFRESH_DELAY_MS = 60 * 1000

const useInboxChannel = (handlers) => {
    // Latest handlers live in a ref so the effect below can stay
    // mounted with `[]` deps — we never want to tear down and re-open
    // the websocket just because a parent re-rendered with a new
    // callback identity.
    const handlersRef = useRef(handlers)
    handlersRef.current = handlers

    useEffect(function subscribeInbox() {
        let cancelled = false
        let channel = null
        let refreshTimer = null

        const dispatch = (key, payload) => {
            const handler = handlersRef.current?.[key]
            if (typeof handler === "function") handler(payload)
        }

        const scheduleRefresh = (expiresAt) => {
            if (refreshTimer) clearTimeout(refreshTimer)
            const delay = Math.max(expiresAt - Date.now() - REFRESH_LEAD_MS, MIN_REFRESH_DELAY_MS)
            refreshTimer = setTimeout(function refresh() {
                if (cancelled) return
                rotateToken().catch(function onError() {})
            }, delay)
        }

        const rotateToken = async () => {
            const result = await getRealtimeToken()
            if (!result?.success) return null
            setRealtimeAuthToken(result.data.token)
            scheduleRefresh(result.data.expiresAt)
            return result.data.userId
        }

        const setup = async () => {
            const userId = await rotateToken()
            if (cancelled || !userId) return

            const client = getSupabaseBrowserClient()
            channel = client
                .channel(inboxTopic(userId), {
                    config: { broadcast: { self: false }, private: false },
                })
                .on(
                    "broadcast",
                    { event: RealtimeEvents.MESSAGE_NEW },
                    function onMessageNew(message) {
                        dispatch("onMessageNew", message?.payload)
                    },
                )
                .on(
                    "broadcast",
                    { event: RealtimeEvents.MESSAGE_EDIT },
                    function onMessageEdit(message) {
                        dispatch("onMessageEdit", message?.payload)
                    },
                )
                .on(
                    "broadcast",
                    { event: RealtimeEvents.MESSAGE_DELETE },
                    function onMessageDelete(message) {
                        dispatch("onMessageDelete", message?.payload)
                    },
                )
                .on(
                    "broadcast",
                    { event: RealtimeEvents.MESSAGE_READ },
                    function onMessageRead(message) {
                        dispatch("onMessageRead", message?.payload)
                    },
                )
                .on(
                    "broadcast",
                    { event: RealtimeEvents.TYPING },
                    function onTyping(message) {
                        dispatch("onTyping", message?.payload)
                    },
                )
                .subscribe()
        }

        setup()

        return function teardown() {
            cancelled = true
            if (refreshTimer) clearTimeout(refreshTimer)
            if (channel) {
                const client = getSupabaseBrowserClient()
                client.removeChannel(channel)
            }
        }
        // The effect intentionally has no deps. All dynamic data is
        // accessed via `handlersRef`, so nothing here should re-run.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export default useInboxChannel
