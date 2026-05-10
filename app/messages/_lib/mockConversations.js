// Pure mock data for the chat experience. The shape mirrors what a real
// API response would look like so the UI can switch over by swapping the
// data source — no component changes needed.
//
// Conventions:
//  - All timestamps are anchored relative to "now" so the UI always shows
//    fresh-looking activity regardless of when the demo is opened.
//  - `messages` are ordered oldest → newest. The last entry is the preview.
//  - Photos use Unsplash IDs that are allowed by next.config.mjs and are
//    stable, but the Avatar primitive falls back to initials gracefully if
//    a URL ever 404s.

const SELF_ID = "me"
export const CURRENT_USER = { id: SELF_ID, name: "You" }

function minutesAgo(m) {
    return new Date(Date.now() - m * 60_000).toISOString()
}

function hoursAgo(h) {
    return new Date(Date.now() - h * 60 * 60_000).toISOString()
}

function daysAgo(d) {
    return new Date(Date.now() - d * 24 * 60 * 60_000).toISOString()
}

function photo(id) {
    return `https://images.unsplash.com/photo-${id}?w=240&h=240&fit=crop&crop=faces&q=80`
}

let messageCounter = 0

function m(fromSelf, text, sentAt, status = "read") {
    messageCounter += 1
    return {
        id: `msg_${messageCounter}`,
        fromSelf,
        text,
        sentAt,
        status: fromSelf ? status : undefined,
    }
}

export const MOCK_CONVERSATIONS = [
    {
        id: "conv_aria",
        user: {
            id: "u_aria",
            name: "Aria Mitchell",
            avatar: photo("1494790108377-be9c29b29330"),
            online: true,
            lastSeenAt: minutesAgo(0),
            tagline: "Travel, dim sum, and very loud playlists.",
        },
        matchedAt: daysAgo(3),
        unreadCount: 2,
        isTyping: true,
        messages: [
            m(false, "Hey! Loved your travel photos — Lisbon looks unreal 🌅", daysAgo(1)),
            m(true,  "Right? Easily my favorite city this year. Have you been?", daysAgo(1)),
            m(false, "Not yet! It's at the very top of my list though. What's the one thing I have to do?", daysAgo(1)),
            m(true,  "Honestly? Get lost in Alfama at sunset. Just walk and let the trams find you.", hoursAgo(6)),
            m(true,  "Oh — and pastéis de Belém. Accept no substitutes 🥐", hoursAgo(6)),
            m(false, "Adding that to the list right now haha. Do you travel often?", hoursAgo(5)),
            m(true,  "Trying to. Three trips this year already 😅 What about you, what's the next one?", hoursAgo(5)),
            m(false, "Iceland in two weeks!! I'm a little obsessed with the idea of seeing the northern lights", hoursAgo(2)),
            m(false, "Have you ever?", hoursAgo(2)),
            m(true,  "Once, in Tromsø. It's one of those things photos genuinely don't do justice to.", minutesAgo(45)),
            m(false, "Okay now I'm even more excited. We should compare notes when I'm back ✨", minutesAgo(8)),
            m(false, "Random — what's the song you've had on repeat lately?", minutesAgo(4)),
        ],
    },
    {
        id: "conv_sophie",
        user: {
            id: "u_sophie",
            name: "Sophie Bennett",
            avatar: photo("1531746020798-e6953c6e8e04"),
            online: true,
            lastSeenAt: minutesAgo(0),
            tagline: "Architect by day, pasta evangelist by night.",
        },
        matchedAt: daysAgo(7),
        unreadCount: 1,
        isTyping: false,
        messages: [
            m(true,  "Tried that little café you mentioned — the one near the gallery", hoursAgo(5)),
            m(false, "And?? Tell me everything 😄", hoursAgo(4)),
            m(true,  "Genuinely the best flat white I've had in months", hoursAgo(4)),
            m(false, "Okay we have to go together next time. That café is incredible at golden hour ✨", hoursAgo(3)),
        ],
    },
    {
        id: "conv_mia",
        user: {
            id: "u_mia",
            name: "Mia Chen",
            avatar: photo("1438761681033-6461ffad8d80"),
            online: false,
            lastSeenAt: hoursAgo(5),
            tagline: "Climbs rocks, reads sci-fi, makes terrible puns.",
        },
        matchedAt: daysAgo(12),
        unreadCount: 0,
        isTyping: false,
        messages: [
            m(false, "So Saturday's plan still good?", daysAgo(2)),
            m(true,  "Definitely — booked the table for 7", daysAgo(2)),
            m(false, "Perfect. Looking forward to it!", daysAgo(1)),
            m(true,  "Same. See you Saturday 🙌", daysAgo(1)),
        ],
    },
    {
        id: "conv_lila",
        user: {
            id: "u_lila",
            name: "Lila Rodriguez",
            avatar: photo("1573496359142-b8d87734a5a2"),
            online: false,
            lastSeenAt: daysAgo(1),
            tagline: "Chef, cyclist, weirdly good at trivia.",
        },
        matchedAt: daysAgo(20),
        unreadCount: 0,
        isTyping: false,
        messages: [
            m(false, "If you're ever near Mission, the new ramen place is unreal", daysAgo(2)),
            m(true,  "That sounds amazing 😄 next weekend?", daysAgo(1)),
        ],
    },
    {
        id: "conv_eva",
        user: {
            id: "u_eva",
            name: "Eva Park",
            avatar: photo("1487412720507-e7ab37603c6f"),
            online: false,
            lastSeenAt: daysAgo(3),
            tagline: "Designer, runner, owner of a very dramatic cat.",
        },
        matchedAt: daysAgo(30),
        unreadCount: 1,
        isTyping: false,
        messages: [
            m(true,  "Your cat's Instagram is honestly cinema", daysAgo(4)),
            m(false, "Ha — exactly what he'd want you to think", daysAgo(3)),
        ],
    },
]
