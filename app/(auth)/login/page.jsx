import LoginForm from "./LoginForm"

export default function LoginPage() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-linear-to-br from-rose-50 via-white to-fuchsia-50">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-rose-300/40 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-fuchsia-300/40 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 left-1/2 size-64 -translate-x-1/2 rounded-full bg-violet-300/30 blur-3xl"
            />
            
            <main className="relative z-10 h-full w-full overflow-y-auto overflow-x-hidden premium-scrollbar">
                <div className="flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-6">
                    <LoginForm />
                </div>
            </main>
        </div>
    )
}
