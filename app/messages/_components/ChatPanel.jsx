"use client"

import ChatPanelHeader from "./ChatPanelHeader"
import MessageComposer from "./MessageComposer"
import MessageThread from "./MessageThread"

function ChatPanel({ conversation, onSend, onBack }) {
    function handleSend(text) {
        onSend(conversation.id, text)
    }

    return (
        <section
            aria-label={`Conversation with ${conversation.user.name}`}
            className="flex flex-1 min-h-0 flex-col bg-white"
        >
            <ChatPanelHeader conversation={conversation} onBack={onBack} />
            <MessageThread conversation={conversation} />
            <MessageComposer
                peerName={conversation.user.name}
                onSend={handleSend}
            />
        </section>
    )
}

export default ChatPanel
