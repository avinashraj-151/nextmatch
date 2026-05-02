"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Eye,
    EyeOff,
    Heart,
    Loader2,
    Lock,
    Mail,
    User,
    UserPlus,
} from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    registerDefaultValues,
    registerSchema,
} from "@/lib/schemas/registerSchema"
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { registerUser } from "@/app/actions/authaction"
const STRENGTH_LEVELS = [
    { label: "Weak", color: "bg-rose-500", text: "text-rose-600" },
    { label: "Fair", color: "bg-amber-500", text: "text-amber-600" },
    { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
]

const getPasswordStrength = (password) => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1
    return score
}

export default function RegisterForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver(registerSchema),
        defaultValues: registerDefaultValues,
    })

    const name = watch("name")
    const email = watch("email")
    const password = watch("password")
    const confirmPassword = watch("confirmPassword")
    const acceptTerms = watch("acceptTerms")

    const isFormIncomplete =
        !name?.trim() ||
        !email?.trim() ||
        !password ||
        !confirmPassword ||
        !acceptTerms

    const strengthScore = getPasswordStrength(password)
    const strengthIndex = Math.max(0, Math.min(strengthScore - 1, 3))
    const strength = password ? STRENGTH_LEVELS[strengthIndex] : null

    const handleRegister = async (data) => {
        try {
            const result = await registerUser(data)

            if (result?.success) {
                router.push("/")
                return
            }

            if (result?.field) {
                setError(result.field, {
                    type: "server",
                    message: result.error,
                })
            }

            toast.error("Couldn't create your account", {
                description: result?.error ?? "Please try again in a moment.",
            })
        } catch (error) {
            // console.error(error)
            toast.error("Network error", {
                description: "Please check your connection and try again.",
            })
        }
    }

    const handleTogglePassword = () => setShowPassword((prev) => !prev)
    const handleToggleConfirm = () => setShowConfirm((prev) => !prev)

    return (
        <Card className="w-full max-w-md gap-7 rounded-2xl border-0 bg-white/95 py-9 shadow-2xl shadow-fuchsia-900/15 ring-1 ring-black/5 backdrop-blur">
            <CardHeader className="flex flex-col items-center gap-4 text-center">
                <span
                    aria-hidden="true"
                    className="grid size-16 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-xl shadow-fuchsia-500/40 ring-1 ring-white/40"
                >
                    <UserPlus className="size-7 text-white drop-shadow" />
                </span>
                <div className="space-y-1.5">
                    <CardTitle className="text-[1.65rem] font-bold tracking-tight text-gray-900">
                        Create your account
                    </CardTitle>
                    <CardDescription className="text-[0.95rem] text-gray-500">
                        Join{" "}
                        <span className="bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 bg-clip-text font-semibold text-transparent">
                            NextMatch
                        </span>{" "}
                        and start finding your match
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <form
                    className="flex flex-col gap-5"
                    noValidate
                    onSubmit={handleSubmit(handleRegister)}
                >
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="name"
                            className="text-gray-700"
                        >
                            Full name
                        </Label>
                        <div className="relative">
                            <User
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Jane Doe"
                                aria-invalid={!!errors.name || undefined}
                                aria-describedby={
                                    errors.name ? "name-error" : undefined
                                }
                                className="h-11 rounded-xl border-gray-200 pl-9 text-sm focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-500/20"
                                {...register("name")}
                            />
                        </div>
                        {errors.name && (
                            <p
                                id="name-error"
                                role="alert"
                                className="text-xs font-medium text-rose-600"
                            >
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="email"
                            className="text-gray-700"
                        >
                            Email
                        </Label>
                        <div className="relative">
                            <Mail
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={!!errors.email || undefined}
                                aria-describedby={
                                    errors.email ? "email-error" : undefined
                                }
                                className="h-11 rounded-xl border-gray-200 pl-9 text-sm focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-500/20"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p
                                id="email-error"
                                role="alert"
                                className="text-xs font-medium text-rose-600"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="password"
                            className="text-gray-700"
                        >
                            Password
                        </Label>
                        <div className="relative">
                            <Lock
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                aria-invalid={!!errors.password || undefined}
                                aria-describedby={
                                    errors.password
                                        ? "password-error"
                                        : "password-strength"
                                }
                                className="h-11 rounded-xl border-gray-200 pr-10 pl-9 text-sm focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-500/20"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={handleTogglePassword}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showPassword}
                                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 focus-visible:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>

                        {password && !errors.password && (
                            <div
                                id="password-strength"
                                className="flex items-center gap-2"
                                aria-live="polite"
                            >
                                <div className="flex flex-1 gap-1">
                                    {[0, 1, 2, 3].map((index) => (
                                        <span
                                            key={index}
                                            className={cn(
                                                "h-1.5 flex-1 rounded-full bg-gray-200 transition-colors duration-200",
                                                index < strengthScore &&
                                                strength?.color,
                                            )}
                                        />
                                    ))}
                                </div>
                                {strength && (
                                    <span
                                        className={cn(
                                            "text-xs font-semibold",
                                            strength.text,
                                        )}
                                    >
                                        {strength.label}
                                    </span>
                                )}
                            </div>
                        )}

                        {errors.password && (
                            <p
                                id="password-error"
                                role="alert"
                                className="text-xs font-medium text-rose-600"
                            >
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-gray-700"
                        >
                            Confirm password
                        </Label>
                        <div className="relative">
                            <Lock
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                aria-invalid={
                                    !!errors.confirmPassword || undefined
                                }
                                aria-describedby={
                                    errors.confirmPassword
                                        ? "confirm-error"
                                        : undefined
                                }
                                className="h-11 rounded-xl border-gray-200 pr-10 pl-9 text-sm focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-500/20"
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={handleToggleConfirm}
                                aria-label={
                                    showConfirm
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showConfirm}
                                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 focus-visible:outline-none"
                            >
                                {showConfirm ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p
                                id="confirm-error"
                                role="alert"
                                className="text-xs font-medium text-rose-600"
                            >
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Controller
                            name="acceptTerms"
                            control={control}
                            render={({ field }) => (
                                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-600 select-none">
                                    <Checkbox
                                        id="acceptTerms"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        onBlur={field.onBlur}
                                        aria-invalid={
                                            !!errors.acceptTerms || undefined
                                        }
                                        aria-describedby={
                                            errors.acceptTerms
                                                ? "terms-error"
                                                : undefined
                                        }
                                        className="mt-0.5 data-checked:border-fuchsia-600 data-checked:bg-fuchsia-600"
                                    />
                                    <span className="leading-snug">
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="font-semibold text-fuchsia-700 hover:text-fuchsia-800 hover:underline"
                                        >
                                            Terms
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="font-semibold text-fuchsia-700 hover:text-fuchsia-800 hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                            )}
                        />
                        {errors.acceptTerms && (
                            <p
                                id="terms-error"
                                role="alert"
                                className="text-xs font-medium text-rose-600"
                            >
                                {errors.acceptTerms.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isFormIncomplete || isSubmitting}
                        aria-busy={isSubmitting || undefined}
                        className="h-11 w-full cursor-pointer rounded-xl border-0 bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-sm font-semibold tracking-wide text-white shadow-lg shadow-fuchsia-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-600/35 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Creating account…
                            </>
                        ) : (
                            <>
                                <Heart className="size-4" />
                                Create account
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-0 bg-transparent px-4 pt-0 pb-5 text-sm text-gray-500">
                Already have an account?
                <Link
                    href="/login"
                    className="ml-1.5 font-semibold text-fuchsia-700 transition-colors hover:text-fuchsia-800 hover:underline"
                >
                    Sign in
                </Link>
            </CardFooter>
        </Card>
    )
}
