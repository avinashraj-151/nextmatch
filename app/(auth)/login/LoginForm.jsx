"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginDefaultValues, loginSchema } from "@/lib/schemas/login"
import { signInUser } from "@/app/actions/authaction"
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

export default function LoginForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver(loginSchema),
        defaultValues: loginDefaultValues,
    })

    const email = watch("email")
    const password = watch("password")
    const isFormEmpty = !email?.trim() || !password?.trim()

    const handleLogin = async (data) => {
        try {
            const result = await signInUser(data)

            if (result?.success) {
                toast.success("Welcome back", {
                    description: "Redirecting to your matches…",
                })
                router.push("/members")
                router.refresh()
                return
            }

            toast.error("Couldn't sign you in", {
                description: result?.error ?? "Please try again in a moment.",
            })
        } catch (error) {
            toast.error("Network error", {
                description: "Please check your connection and try again.",
            })
        }
    }

    const handleTogglePassword = () => setShowPassword((prev) => !prev)

    return (
        <Card className="w-full max-w-md gap-7 rounded-2xl border-0 bg-white/95 py-9 shadow-2xl shadow-fuchsia-900/15 ring-1 ring-black/5 backdrop-blur">
            <CardHeader className="flex flex-col items-center gap-4 text-center">
                <span
                    aria-hidden="true"
                    className="grid size-16 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 shadow-xl shadow-fuchsia-500/40 ring-1 ring-white/40"
                >
                    <Lock className="size-7 text-white drop-shadow" />
                </span>
                <div className="space-y-1.5">
                    <CardTitle className="text-[1.65rem] font-bold tracking-tight text-gray-900">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-[0.95rem] text-gray-500">
                        Sign in to continue to{" "}
                        <span className="bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 bg-clip-text font-semibold text-transparent">
                            NextMatch
                        </span>
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <form
                    className="flex flex-col gap-5"
                    noValidate
                    onSubmit={handleSubmit(handleLogin)}
                >
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
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                aria-invalid={!!errors.password || undefined}
                                aria-describedby={
                                    errors.password
                                        ? "password-error"
                                        : undefined
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

                    <Button
                        type="submit"
                        disabled={isFormEmpty || isSubmitting}
                        aria-busy={isSubmitting || undefined}
                        className="h-11 w-full cursor-pointer rounded-xl border-0 bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-sm font-semibold tracking-wide text-white shadow-lg shadow-fuchsia-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-600/35 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Logging in…
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="size-4" />
                                Sign in
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-0 bg-transparent px-4 pt-0 pb-5 text-sm text-gray-500">
                Don&apos;t have an account?
                <Link
                    href="/register"
                    className="ml-1.5 font-semibold text-fuchsia-700 transition-colors hover:text-fuchsia-800 hover:underline"
                >
                    Register
                </Link>
            </CardFooter>
        </Card>
    )
}
