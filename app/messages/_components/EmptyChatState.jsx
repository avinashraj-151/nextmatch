import Link from "next/link"
import { MessageCircle, Plus } from "lucide-react"

function EmptyChatState() {
    return (
        <section
            aria-labelledby="start-conversation-title"
            className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center"
        >
            {/* Decorative backdrop blobs — subtle, brand-consistent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <span className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/30 blur-3xl" />
                <span className="absolute -right-12 bottom-12 size-64 rounded-full bg-violet-200/30 blur-3xl" />
                <span className="absolute -left-12 top-12 size-64 rounded-full bg-rose-200/30 blur-3xl" />
            </div>

            <span className="grid size-16 place-items-center rounded-full bg-linear-to-br from-rose-50 via-fuchsia-50 to-violet-50 text-fuchsia-600 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5">
                <MessageCircle className="size-7" />
            </span>
            <h2
                id="start-conversation-title"
                className="mt-4 text-xl font-semibold tracking-tight text-gray-900"
            >
                Start Conversation
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-gray-500">
                Pick a chat from the left, or start a new one with someone you&apos;ve matched with.
            </p>
            <Link
                href="/lists?type=mutual"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-fuchsia-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 focus-visible:ring-offset-2 active:scale-[0.98]"
            >
                <Plus className="size-4" />
                New chat
            </Link>
        </section>
    )
}

export default EmptyChatState
