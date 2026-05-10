"use client"

import { useId, useState } from "react"
import { Pause, ShieldAlert, Trash2, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

function DangerZoneCard({ id, paused, onPausedChange, accountEmail }) {
    const pauseSwitchId = useId()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmText, setConfirmText] = useState("")

    // Mirrors how production deletion flows actually work: user confirms in
    // an irreversible-action dialog, then receives an email to actually delete.
    function handleConfirmDelete() {
        toast.success("Deletion request sent", {
            description: `We've sent a confirmation email to ${accountEmail}. Click the link there to permanently delete your account.`,
        })
        setConfirmOpen(false)
        setConfirmText("")
    }

    function handleConfirmTextChange(event) {
        setConfirmText(event.target.value)
    }

    function handleDialogOpenChange(open) {
        setConfirmOpen(open)
        if (!open) setConfirmText("")
    }

    const canConfirm = confirmText.trim().toLowerCase() === "delete"

    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-rose-100 shadow-sm shadow-rose-900/5"
        >
            <header className="flex items-start gap-4 border-b border-rose-100 bg-rose-50/50 px-5 py-5 sm:px-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-900/20 ring-2 ring-white">
                    <ShieldAlert className="size-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                        Careful zone
                    </p>
                    <h2
                        id={`${id}-title`}
                        className="text-lg font-bold tracking-tight text-gray-900"
                    >
                        Pause or delete
                    </h2>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                        These actions affect what other people can see — and some can&apos;t be undone.
                    </p>
                </div>
            </header>

            <div className="divide-y divide-rose-100/60">
                {/* Pause */}
                <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
                    <label
                        htmlFor={pauseSwitchId}
                        className="flex min-w-0 flex-1 items-start gap-3"
                    >
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                            <Pause className="size-4" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-sm font-semibold tracking-tight text-gray-900">
                                Pause your profile
                            </span>
                            <span className="text-xs leading-relaxed text-gray-500">
                                Hide your profile from discovery while you take a break. Your conversations and matches stay safe — flip this back on anytime.
                            </span>
                        </span>
                    </label>
                    <div className="flex shrink-0 items-center justify-end">
                        <Switch
                            id={pauseSwitchId}
                            checked={paused}
                            onCheckedChange={onPausedChange}
                            className="data-checked:bg-amber-500 data-checked:shadow-sm data-checked:shadow-amber-900/20"
                        />
                    </div>
                </div>

                {/* Delete */}
                <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                            <Trash2 className="size-4" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-sm font-semibold tracking-tight text-gray-900">
                                Delete your account
                            </span>
                            <span className="text-xs leading-relaxed text-gray-500">
                                Permanently remove your profile, photos, matches, and message history. This cannot be undone.
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-end">
                        <AlertDialog open={confirmOpen} onOpenChange={handleDialogOpenChange}>
                            <AlertDialogTrigger
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 outline-none transition-all duration-200",
                                    "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700",
                                    "focus-visible:ring-2 focus-visible:ring-rose-300",
                                    "active:scale-[0.98]",
                                )}
                            >
                                <Trash2 className="size-3.5" />
                                Delete account
                            </AlertDialogTrigger>

                            <AlertDialogContent className="!bg-white">
                                <AlertDialogHeader>
                                    <span className="grid size-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                                        <TriangleAlert className="size-5" />
                                    </span>
                                    <AlertDialogTitle className="text-base font-bold tracking-tight text-gray-900">
                                        Delete your account?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm leading-relaxed text-gray-500">
                                        This will remove your profile, photos, matches, and entire message history. We&apos;ll send a confirmation email to <span className="font-semibold text-gray-700">{accountEmail}</span> — your account is only deleted after you click the link there.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="confirm-delete-input"
                                        className="text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Type <span className="font-mono text-rose-600">delete</span> to continue
                                    </label>
                                    <input
                                        id="confirm-delete-input"
                                        type="text"
                                        value={confirmText}
                                        onChange={handleConfirmTextChange}
                                        autoComplete="off"
                                        spellCheck="false"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                                        placeholder="delete"
                                    />
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleConfirmDelete}
                                        disabled={!canConfirm}
                                        className={cn(
                                            "bg-linear-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-900/20 hover:bg-linear-to-r hover:from-rose-600 hover:to-rose-700",
                                            !canConfirm && "pointer-events-none opacity-50",
                                        )}
                                    >
                                        Send confirmation email
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DangerZoneCard
