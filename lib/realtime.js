// Channel + event names. Must be identical on both the server (which
// publishes via the broadcast REST API) and the client (which subscribes).
// Importing constants from one place is the only thing keeping a typo
// from silently breaking realtime, so do NOT inline these strings.

const inboxTopic = (userId) => `inbox:${userId}`

const PRESENCE_TOPIC = "presence:online"

const RealtimeEvents = Object.freeze({
    MESSAGE_NEW: "message:new",
    MESSAGE_EDIT: "message:edit",
    MESSAGE_DELETE: "message:delete",
    MESSAGE_READ: "message:read",
    TYPING: "typing",
})

export { inboxTopic, PRESENCE_TOPIC, RealtimeEvents }
