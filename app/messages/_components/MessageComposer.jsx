"use client"

import { useEffect, useRef, useState } from "react"
import { SendHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const MAX_ROWS = 6
const LINE_HEIGHT_PX = 22

function MessageComposer({ peerName, onSend }) {
    const [text, setText] = useState("")
    const textareaRef = useRef(null)
    const trimmed = text.trim()
    const canSend = trimmed.length > 0

    // Auto-grow the textarea up to MAX_ROWS, then enable internal scroll.
    useEffect(function syncTextareaHeight() {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        const next = Math.min(el.scrollHeight, LINE_HEIGHT_PX * MAX_ROWS + 16)
        el.style.height = `${next}px`
    }, [text])

    function handleSubmit() {
        if (!canSend) return
        onSend(trimmed)
        setText("")
    }

    function handleFormSubmit(event) {
        event.preventDefault()
        handleSubmit()
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            handleSubmit()
        }
    }

    function handleTextChange(event) {
        setText(event.target.value)
    }

    return (
        <div className="border-t border-gray-100 bg-white px-3 py-3 sm:px-4">
            <form
                onSubmit={handleFormSubmit}
                className={cn(
                    "mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-shadow",
                    "focus-within:border-fuchsia-300 focus-within:ring-2 focus-within:ring-fuchsia-200 focus-within:shadow-md focus-within:shadow-fuchsia-900/10",
                )}
            >
                <label className="sr-only" htmlFor="composer-textarea">
                    Type a message
                </label>
                <textarea
                    id="composer-textarea"
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${peerName.split(" ")[0]}…`}
                    className="block max-h-40 min-h-9 w-full resize-none border-0 bg-transparent px-1 py-1.5 text-[14.5px] leading-[1.45] text-gray-900 outline-none placeholder:text-gray-400"
                />

                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Send message"
                    className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-200",
                        "outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 focus-visible:ring-offset-2",
                        canSend
                            ? "bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/25 hover:shadow-lg hover:shadow-fuchsia-900/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                            : "bg-gray-100 text-gray-400",
                    )}
                >
                    <SendHorizontal className="size-4" />
                </button>
            </form>
        </div>
    )
}

export default MessageComposer
