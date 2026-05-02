"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
    Cake,
    Check,
    Globe2,
    Loader2,
    MapPin,
    Pencil,
    Sparkles,
    User,
    Venus,
    X,
} from "lucide-react"
import { toast } from "sonner"

import { updateMemberProfile } from "@/app/actions/memberAction"
import { calculateAge } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const MIN_AGE_YEARS = 18

const toInputDate = (value) => {
    if (!value) return ""
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toISOString().slice(0, 10)
}

const maxDateOfBirth = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - MIN_AGE_YEARS)
    return date.toISOString().slice(0, 10)
}

/* ─── tiny field wrapper ───────────────────────────────────────── */
const Field = ({ label, children, hint }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
        </label>
        {children}
        {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
)

/* ─── styled input ─────────────────────────────────────────────── */
const PremiumInput = ({ className = "", ...props }) => (
    <input
        className={`h-10 w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition-all focus:border-fuchsia-400 focus:bg-white focus:ring-3 focus:ring-fuchsia-500/20 ${className}`}
        {...props}
    />
)

/* ─── styled textarea ──────────────────────────────────────────── */
const PremiumTextarea = ({ className = "", ...props }) => (
    <textarea
        rows={4}
        className={`w-full resize-none rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition-all focus:border-fuchsia-400 focus:bg-white focus:ring-3 focus:ring-fuchsia-500/20 ${className}`}
        {...props}
    />
)

/* ─── gender pill selector ─────────────────────────────────────── */
const GENDERS = ["male", "female", "non-binary", "prefer not to say"]

const GenderPicker = ({ value, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {GENDERS.map((g) => {
            const active = value?.toLowerCase() === g
            return (
                <button
                    key={g}
                    type="button"
                    onClick={() => onChange(active ? "" : g)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 transition-all duration-150 ${active
                            ? "bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-white ring-transparent shadow-md shadow-fuchsia-900/20"
                            : "bg-white text-gray-600 ring-gray-200 hover:ring-fuchsia-200 hover:text-fuchsia-700"
                        }`}
                >
                    {active && <Check className="size-3" />}
                    {g}
                </button>
            )
        })}
    </div>
)

/* ─── tab pill ─────────────────────────────────────────────────── */
const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${active
                ? "bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-sm shadow-fuchsia-900/20"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
    >
        <Icon className="size-3.5" />
        {label}
    </button>
)

/* ═══════════════════════════════════════════════════════════════ */
export default function EditProfileDialog({ member, trigger }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState("about")
    const [isPending, startTransition] = useTransition()

    /* controlled form state */
    const [form, setForm] = useState({
        name: member?.name ?? "",
        description: member?.description ?? "",
        city: member?.city ?? "",
        country: member?.country ?? "",
        gender: member?.gender ?? "",
        dateOfBirth: toInputDate(member?.dateOfBirth),
    })

    /* reset when member changes */
    useEffect(() => {
        setForm({
            name: member?.name ?? "",
            description: member?.description ?? "",
            city: member?.city ?? "",
            country: member?.country ?? "",
            gender: member?.gender ?? "",
            dateOfBirth: toInputDate(member?.dateOfBirth),
        })
    }, [member])

    const set = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: typeof e === "string" ? e : e.target.value }))

    const bioLength = form.description.trim().length
    const bioOk = bioLength === 0 || bioLength >= 20

    const dobMax = maxDateOfBirth()
    const dobAge = calculateAge(form.dateOfBirth)
    const dobOk = !form.dateOfBirth || (dobAge != null && dobAge >= MIN_AGE_YEARS)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!bioOk || !dobOk) return

        startTransition(async () => {
            const result = await updateMemberProfile(form)

            if (result?.error) {
                toast.error("Couldn't save changes", {
                    description: result.error,
                    className: "cn-toast",
                })
                return
            }

            toast.success("Profile updated", {
                description: "Your changes are live on NextMatch.",
                className: "cn-toast",
            })
            setOpen(false)
            router.refresh()
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent
                showCloseButton={false}
                className="max-w-lg overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl shadow-fuchsia-900/20 ring-1 ring-black/5 sm:max-w-lg"
            >
                {/* ── gradient header ── */}
                <div className="relative overflow-hidden bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 px-6 py-5">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
                    <div aria-hidden="true" className="pointer-events-none absolute right-16 top-2 size-16 rounded-full bg-fuchsia-300/20 blur-xl" />
                    <DialogHeader className="gap-0">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
                                    <Sparkles className="size-3" />
                                    Your profile
                                </span>
                                <DialogTitle className="mt-2 text-lg font-bold text-white">
                                    Edit your profile
                                </DialogTitle>
                                <p className="mt-0.5 text-xs text-white/70">
                                    Changes are saved and go live immediately.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/20 transition hover:bg-white/25"
                                aria-label="Close dialog"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </DialogHeader>
                </div>

                {/* ── tab bar ── */}
                <div className="flex gap-2 border-b border-gray-100 px-6 py-3">
                    <TabButton active={tab === "about"} icon={User} label="About" onClick={() => setTab("about")} />
                    <TabButton active={tab === "location"} icon={MapPin} label="Location" onClick={() => setTab("location")} />
                    <TabButton active={tab === "details"} icon={Venus} label="Details" onClick={() => setTab("details")} />
                </div>

                {/* ── form body ── */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-5">

                        {tab === "about" && (
                            <>
                                <Field label="Display name">
                                    <PremiumInput
                                        id="edit-name"
                                        value={form.name}
                                        onChange={set("name")}
                                        placeholder="Your name"
                                        required
                                        maxLength={60}
                                    />
                                </Field>

                                <Field
                                    label="Bio"
                                    hint={
                                        bioLength > 0
                                            ? `${bioLength} characters${!bioOk ? " — write at least 20 to save" : ""}`
                                            : "A great bio gets 3× more matches."
                                    }
                                >
                                    <PremiumTextarea
                                        id="edit-bio"
                                        value={form.description}
                                        onChange={set("description")}
                                        placeholder="Tell people what makes you, you…"
                                        maxLength={500}
                                        aria-invalid={!bioOk}
                                    />
                                    {/* char bar */}
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${bioLength >= 200
                                                        ? "bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600"
                                                        : bioLength >= 50
                                                            ? "bg-fuchsia-400"
                                                            : "bg-gray-300"
                                                    }`}
                                                style={{ width: `${Math.min(100, (bioLength / 500) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {500 - bioLength}
                                        </span>
                                    </div>
                                </Field>
                            </>
                        )}

                        {tab === "location" && (
                            <>
                                <Field label="City">
                                    <PremiumInput
                                        id="edit-city"
                                        value={form.city}
                                        onChange={set("city")}
                                        placeholder="e.g. Bengaluru"
                                        maxLength={80}
                                    />
                                </Field>
                                <Field label="Country">
                                    <PremiumInput
                                        id="edit-country"
                                        value={form.country}
                                        onChange={set("country")}
                                        placeholder="e.g. India"
                                        maxLength={80}
                                    />
                                </Field>
                            </>
                        )}

                        {tab === "details" && (
                            <>
                                <Field label="Gender" hint="Select one that best describes you.">
                                    <GenderPicker
                                        value={form.gender}
                                        onChange={(val) => setForm((prev) => ({ ...prev, gender: val }))}
                                    />
                                </Field>

                                <Field
                                    label="Date of birth"
                                    hint={
                                        form.dateOfBirth
                                            ? dobOk
                                                ? `Age: ${dobAge} years`
                                                : `You must be at least ${MIN_AGE_YEARS} to use NextMatch.`
                                            : "Used to calculate your age. Only your age is shown publicly."
                                    }
                                >
                                    <div className="relative">
                                        <Cake
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fuchsia-500"
                                        />
                                        <PremiumInput
                                            id="edit-dob"
                                            type="date"
                                            value={form.dateOfBirth}
                                            onChange={set("dateOfBirth")}
                                            min="1900-01-01"
                                            max={dobMax}
                                            aria-invalid={!dobOk}
                                            className="pl-9"
                                        />
                                    </div>
                                </Field>
                            </>
                        )}
                    </div>

                    {/* ── footer ── */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:-translate-y-px hover:border-gray-300 hover:shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !bioOk || !dobOk}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-900/20 transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-fuchsia-900/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Check className="size-4" />
                                    Save changes
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[300%]"
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
