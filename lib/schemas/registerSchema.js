import { z } from "zod"

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, { message: "Name is required" })
            .min(2, { message: "Name must be at least 2 characters" })
            .max(50, { message: "Name must be less than 50 characters" }),
        email: z
            .string()
            .trim()
            .min(1, { message: "Email is required" })
            .email({ message: "Enter a valid email address" }),
        password: z
            .string()
            .min(1, { message: "Password is required" })
            .min(8, { message: "Password must be at least 8 characters" })
            .regex(/[a-z]/, {
                message: "Must include a lowercase letter",
            })
            .regex(/[A-Z]/, {
                message: "Must include an uppercase letter",
            })
            .regex(/[0-9]/, { message: "Must include a number" }),
        confirmPassword: z
            .string()
            .min(1, { message: "Please confirm your password" }),
        acceptTerms: z.literal(true, {
            errorMap: () => ({
                message: "You must accept the terms to continue",
            }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export const registerDefaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
}
