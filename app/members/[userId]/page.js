import { notFound } from "next/navigation"

import { getMemberById } from "@/app/actions/memberAction"

export default async function MemberDetailsPage({ params }) {
    const { userId } = await params
    const result = await getMemberById(userId)

    if (result?.error === "Member not found") {
        notFound()
    }

    const member = result?.data
    if (!member) {
        notFound()
    }

    const firstName = member.name?.trim()?.split(/\s+/)[0] || "this member"

    return (
        <section className="space-y-6">
            <header>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5">
                    About
                </span>
            </header>

            {member.description ? (
                <article className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
                    <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {member.description}
                    </p>
                </article>
            ) : (
                <article className="rounded-2xl border border-dashed border-fuchsia-200 bg-white/60 p-6">
                    <p className="text-sm text-gray-500">
                        {firstName} hasn&apos;t added a bio yet.
                    </p>
                </article>
            )}
        </section>
    )
}
