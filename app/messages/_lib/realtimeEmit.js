import "server-only"

import { inboxTopic, RealtimeEvents } from "@/lib/realtime"

// Whether channels are private. Step 6 flips this to `true` once the
// Realtime RLS policy is in place. Until then, leave it false so events
// flow without the channel-name authorization check.
const PRIVATE_CHANNELS = false

// POST a batch of broadcast events to Supabase Realtime. Using REST
// (vs the JS client's `channel.send`) means we don't have to subscribe
// from the server before publishing — perfect for fire-and-forget emits
// inside server actions.
const sendBroadcast = async (messages) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey || messages.length === 0) return false

    try {
        const response = await fetch(`${url}/realtime/v1/api/broadcast`, {
            method: "POST",
            headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages }),
            // Realtime broadcast is a side-effect; never let Next cache it.
            cache: "no-store",
        })
        return response.ok
    } catch (error) {
        return false
    }
}

const emitMessageNew = async (recipientUserId, payload) =>
    sendBroadcast([
        {
            topic: inboxTopic(recipientUserId),
            event: RealtimeEvents.MESSAGE_NEW,
            payload,
            private: PRIVATE_CHANNELS,
        },
    ])

// Edits go to both inboxes: the recipient sees the new text, and the
// sender's other tabs/devices stay in sync. The shared payload carries
// the message id + changed fields; the conversation each viewer should
// patch is identified by the OTHER party from their POV.
const emitMessageEdit = async ({ senderId, recipientId, messageId, text, edited }) => {
    const message = { id: messageId, text, edited }
    return sendBroadcast([
        {
            topic: inboxTopic(recipientId),
            event: RealtimeEvents.MESSAGE_EDIT,
            payload: { peerId: senderId, message },
            private: PRIVATE_CHANNELS,
        },
        {
            topic: inboxTopic(senderId),
            event: RealtimeEvents.MESSAGE_EDIT,
            payload: { peerId: recipientId, message },
            private: PRIVATE_CHANNELS,
        },
    ])
}

// Soft-delete is sender-only in the schema (`senderDeleted` flag), so
// the recipient's UI is unchanged. We only need to sync the sender's
// other tabs, so a single broadcast back to their own inbox is enough.
const emitMessageDelete = async ({ senderId, recipientId, messageId }) =>
    sendBroadcast([
        {
            topic: inboxTopic(senderId),
            event: RealtimeEvents.MESSAGE_DELETE,
            payload: { peerId: recipientId, messageId },
            private: PRIVATE_CHANNELS,
        },
    ])

// `readerId` just opened a conversation with `otherUserId`. We notify
// `otherUserId` so the bubbles they sent flip from "delivered" → "read".
const emitMessageRead = async ({ readerId, otherUserId, readAt }) =>
    sendBroadcast([
        {
            topic: inboxTopic(otherUserId),
            event: RealtimeEvents.MESSAGE_READ,
            payload: { peerId: readerId, readAt },
            private: PRIVATE_CHANNELS,
        },
    ])

// Ephemeral, never persisted. The receiver flips `isTyping` for the
// conversation whose peer is `senderId` (named from THEIR perspective).
const emitTyping = async ({ senderId, recipientId, isTyping }) =>
    sendBroadcast([
        {
            topic: inboxTopic(recipientId),
            event: RealtimeEvents.TYPING,
            payload: { peerId: senderId, isTyping: Boolean(isTyping) },
            private: PRIVATE_CHANNELS,
        },
    ])

export {
    emitMessageNew,
    emitMessageEdit,
    emitMessageDelete,
    emitMessageRead,
    emitTyping,
}
