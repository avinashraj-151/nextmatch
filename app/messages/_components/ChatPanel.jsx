"use client"

import ChatPanelHeader from "./ChatPanelHeader"
import MessageComposer from "./MessageComposer"
import MessageThread from "./MessageThread"

function ChatPanel({
    conversation,
    onSend,
    onTyping,
    onEditMessage,
    onDeleteMessage,
    onBack,
}) {
    const handleSend = (text) => onSend(conversation.id, text)
    const handleTyping = (isTyping) => onTyping?.(conversation.id, isTyping)
    const handleEdit = (messageId, text) =>
        onEditMessage?.(conversation.id, messageId, text)
    const handleDelete = (messageId) => onDeleteMessage?.(conversation.id, messageId)

    return (
        <section
            aria-label={`Conversation with ${conversation.user.name}`}
            className="flex flex-1 min-h-0 flex-col bg-white"
        >
            <ChatPanelHeader conversation={conversation} onBack={onBack} />
            <MessageThread
                conversation={conversation}
                onEditMessage={handleEdit}
                onDeleteMessage={handleDelete}
            />
            <MessageComposer
                peerName={conversation.user.name}
                onSend={handleSend}
                onTyping={handleTyping}
            />
        </section>
    )
}

export default ChatPanel
