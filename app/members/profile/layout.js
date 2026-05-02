export default function ProfileLayout({ children }) {
    return (
        <main className="relative isolate min-h-full">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-rose-50 via-fuchsia-50/40 to-transparent"
            />
            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                {children}
            </div>
        </main>
    )
}