import ChatLayout from "./_components/ChatLayout"
import { fetchMutualConversations } from "./_lib/messageAction"

export const metadata = {
    title: "Messages — NextMatch",
    description: "Your conversations with the people you've matched with.",
}

export default async function MessagesPage({ searchParams }) {
    const params = (await searchParams) ?? {}
    const withUserId = typeof params.with === "string" ? params.with : null

    const conversationsResult = await fetchMutualConversations()
    const initialConversations = Array.isArray(conversationsResult?.data)
        ? conversationsResult.data
        : []

    const initialActiveId = withUserId
        ? initialConversations.find((c) => c.user.id === withUserId)?.id ?? null
        : null

    return (
        <ChatLayout
            initialConversations={initialConversations}
            initialActiveId={initialActiveId}
        />
    )
}
