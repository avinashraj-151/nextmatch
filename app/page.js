import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    BadgeCheck,
    CalendarHeart,
    Check,
    Heart,
    Lock,
    MessageCircleHeart,
    Quote,
    ShieldCheck,
    Sparkles,
    Star,
    Swords,
    UserPlus,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { auth } from "@/lib/schemas/auth"

const STATS = [
    { value: "250K+", label: "Curated members" },
    { value: "12K", label: "Matches each week" },
    { value: "4.9★", label: "App store rating" },
    { value: "30 days", label: "Avg. time to match" },
]

const STEPS = [
    {
        step: "01",
        icon: UserPlus,
        title: "Build a profile that feels like you",
        body: "Photos, a few honest prompts, the things you love. We help you put your best self forward in minutes.",
    },
    {
        step: "02",
        icon: Sparkles,
        title: "Get hand-picked matches every day",
        body: "Our compatibility engine looks past the surface — values, vibe, lifestyle — and surfaces people you'll actually click with.",
    },
    {
        step: "03",
        icon: MessageCircleHeart,
        title: "Start a conversation that matters",
        body: "Skip the small talk. Built-in icebreakers and shared interests make the first message effortless.",
    },
]

const FEATURES = [
    {
        icon: Heart,
        title: "Smart compatibility",
        body: "An ML model trained on millions of meaningful connections — not just looks.",
    },
    {
        icon: ShieldCheck,
        title: "Verified profiles",
        body: "Every member is photo-verified so you always know who you're talking to.",
    },
    {
        icon: Lock,
        title: "Privacy first",
        body: "Encrypted messages, blur-by-default photos, and granular visibility controls.",
    },
    {
        icon: CalendarHeart,
        title: "Daily curated picks",
        body: "A small, thoughtful list of people each morning. No endless swiping.",
    },
    {
        icon: BadgeCheck,
        title: "Real conversations",
        body: "Built-in prompts, voice notes, and video calls help things feel real, fast.",
    },
    {
        icon: Users,
        title: "A vibrant community",
        body: "Local meet-ups, interest circles, and curated events near you every month.",
    },
]

const TESTIMONIALS = [
    {
        quote: "I'd given up on apps. NextMatch felt different from the very first match — like talking to an actual human, not a profile. Six months in and still smiling.",
        name: "Aisha & Daniel",
        meta: "Matched in Brooklyn · 6 months",
        gradient: "from-rose-500 via-fuchsia-600 to-violet-600",
    },
    {
        quote: "The daily picks are tiny but mighty. Quality over quantity. I met my person in week three and we still tell our friends to download it.",
        name: "Priya & Marcus",
        meta: "Matched in Austin · 1 year",
        gradient: "from-amber-500 via-rose-500 to-fuchsia-600",
    },
    {
        quote: "I love that profiles feel curated, not curated for clicks. Conversations actually go somewhere here.",
        name: "Lena & Sofia",
        meta: "Matched in Berlin · 9 months",
        gradient: "from-violet-500 via-fuchsia-500 to-rose-500",
    },
]

const FOOTER_LINKS = [
    {
        heading: "Product",
        links: [
            { label: "How it works", href: "#how" },
            { label: "Members", href: "/members" },
            { label: "Lists", href: "/lists" },
            { label: "Messages", href: "/messages" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Press", href: "#" },
            { label: "Contact", href: "#" },
        ],
    },
    {
        heading: "Trust & safety",
        links: [
            { label: "Community guidelines", href: "#" },
            { label: "Safety center", href: "#" },
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
        ],
    },
]

export default async function Home() {
    const session = await auth()
    const isAuthenticated = Boolean(session?.user)
    const firstName = session?.user?.name?.split(" ")?.[0] ?? null

    const primaryHref = isAuthenticated ? "/members" : "/register"
    const primaryLabel = isAuthenticated
        ? "Discover matches"
        : "Get started — it's free"
    const secondaryHref = isAuthenticated ? "/messages" : "/login"
    const secondaryLabel = isAuthenticated ? "Open messages" : "Sign in"

    return (
        <main className="relative isolate">
            <BackgroundDecor />

            <Hero
                isAuthenticated={isAuthenticated}
                firstName={firstName}
                primaryHref={primaryHref}
                primaryLabel={primaryLabel}
                secondaryHref={secondaryHref}
                secondaryLabel={secondaryLabel}
            />

            <StatsStrip />

            <HowItWorks />

            <Features />

            <Testimonials />

            <FinalCta
                isAuthenticated={isAuthenticated}
                primaryHref={primaryHref}
                primaryLabel={primaryLabel}
                secondaryHref={secondaryHref}
                secondaryLabel={secondaryLabel}
            />

            <Footer />
        </main>
    )
}

function BackgroundDecor() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] overflow-hidden"
        >
            <div className="absolute inset-x-0 top-0 h-[820px] bg-linear-to-b from-rose-50 via-fuchsia-50/50 to-transparent" />
            <div className="absolute -top-32 -left-24 size-[480px] rounded-full bg-rose-300/35 blur-3xl" />
            <div className="absolute -top-24 right-[-120px] size-[520px] rounded-full bg-fuchsia-300/35 blur-3xl" />
            <div className="absolute top-40 left-1/3 size-[420px] rounded-full bg-violet-300/30 blur-3xl" />
        </div>
    )
}

function Hero({
    isAuthenticated,
    firstName,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
}) {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm shadow-fuchsia-900/5 backdrop-blur">
                        <Sparkles className="size-3" />
                        Now welcoming new members
                    </span>

                    <h1 className="mt-5 text-balance text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-[4.25rem]">
                        {isAuthenticated && firstName ? (
                            <>
                                Welcome back,{" "}
                                <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                                    {firstName}
                                </span>
                                .
                                <br />
                                Your next chapter awaits.
                            </>
                        ) : (
                            <>
                                Find your{" "}
                                <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                                    kind of love.
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-gray-600">
                        NextMatch is the calmer way to date. Curated daily picks,
                        real conversations, and a community designed for people
                        who are done with the swipe-fatigue.
                    </p>

                    <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <Button
                            asChild
                            size="lg"
                            className="group h-12 rounded-full bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 px-6 text-base font-semibold text-white shadow-lg shadow-fuchsia-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-900/30"
                        >
                            <Link href={primaryHref}>
                                {primaryLabel}
                                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-full border-gray-200 bg-white/80 px-6 text-base font-semibold text-gray-900 backdrop-blur hover:bg-white"
                        >
                            <Link href={secondaryHref}>{secondaryLabel}</Link>
                        </Button>
                    </div>

                    <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                        <li className="inline-flex items-center gap-1.5">
                            <Check className="size-4 text-emerald-600" />
                            Free to join
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <Check className="size-4 text-emerald-600" />
                            Photo-verified profiles
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <Check className="size-4 text-emerald-600" />
                            No endless swiping
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-6">
                    <HeroCollage />
                </div>
            </div>
        </section>
    )
}

const HERO_PROFILES = {
    lena: {
        initials: "LS",
        name: "Lena",
        age: 27,
        location: "Berlin, DE",
        gradient: "from-rose-400 via-fuchsia-500 to-violet-500",
        tagline: "Loves film & late-night ramen",
        imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&w=640&h=860&q=80",
    },
    amelia: {
        initials: "AM",
        name: "Amelia",
        age: 29,
        location: "Lisbon, PT",
        gradient: "from-amber-400 via-rose-500 to-fuchsia-600",
        tagline: "Surfer, designer, dog mom",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=720&h=960&q=80",
    },
    jordan: {
        initials: "JK",
        name: "Jordan",
        age: 31,
        location: "Brooklyn, NY",
        gradient: "from-violet-500 via-fuchsia-500 to-rose-500",
        tagline: "Coffee snob, weekend hiker",
        imageUrl:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=640&h=860&q=80",
    },
}

function HeroCollage() {
    return (
        <div className="relative mx-auto h-[480px] w-full max-w-[560px] sm:h-[560px]">
            <div
                aria-hidden="true"
                className="absolute inset-x-4 top-6 -z-10 h-full rounded-[2.5rem] bg-linear-to-br from-rose-200/70 via-fuchsia-200/70 to-violet-200/70 blur-3xl"
            />

            <span
                aria-hidden="true"
                className="absolute right-6 -top-2 z-30 hidden text-fuchsia-300/70 sm:block"
            >
                <Heart className="size-5 rotate-12 fill-current drop-shadow" />
            </span>
            <span
                aria-hidden="true"
                className="absolute -left-1 bottom-32 z-30 hidden text-rose-300/70 sm:block"
            >
                <Heart className="size-4 -rotate-12 fill-current" />
            </span>

            <PolaroidCard
                {...HERO_PROFILES.lena}
                className="absolute left-0 top-10 w-56 -rotate-6 sm:w-64"
            />

            <PolaroidCard
                {...HERO_PROFILES.amelia}
                className="absolute right-0 top-0 w-60 rotate-6 sm:w-72"
                isFeatured
                priority
            />

            <PolaroidCard
                {...HERO_PROFILES.jordan}
                className="absolute bottom-0 left-12 w-56 rotate-3 sm:w-64"
            />

            <div className="absolute -right-2 top-1/2 z-30 hidden w-76 -translate-y-1/2 sm:block">
                <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-3.5 shadow-2xl shadow-fuchsia-900/20 backdrop-blur-xl">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/70 to-transparent"
                    />

                    <div className="flex items-center gap-3">
                        <div className="relative flex shrink-0">
                            <span className="relative grid size-10 place-items-center overflow-hidden rounded-full ring-2 ring-white">
                                <Image
                                    src={HERO_PROFILES.jordan.imageUrl}
                                    alt=""
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </span>
                            <span className="relative -ml-3 grid size-10 place-items-center overflow-hidden rounded-full ring-2 ring-white">
                                <Image
                                    src={HERO_PROFILES.amelia.imageUrl}
                                    alt=""
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </span>
                            <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white ring-2 ring-white">
                                <Heart className="size-2.5 fill-current" />
                            </span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-sm font-bold tracking-tight text-transparent">
                                    It&apos;s a match!
                                </p>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                    Just now
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-gray-600">
                                You and{" "}
                                <span className="font-semibold text-gray-900">
                                    Amelia
                                </span>{" "}
                                liked each other.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-md shadow-fuchsia-900/10 ring-1 ring-black/5 backdrop-blur">
                <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                4,218 online now
            </div>
        </div>
    )
}

function PolaroidCard({
    initials,
    name,
    age,
    location,
    gradient,
    tagline,
    imageUrl,
    className = "",
    isFeatured = false,
    priority = false,
}) {
    return (
        <article
            className={`group/polaroid overflow-hidden rounded-3xl bg-white p-2.5 shadow-2xl shadow-fuchsia-900/20 ring-1 ring-black/5 transition-transform duration-500 ease-out hover:scale-[1.03] hover:rotate-0 ${className}`}
        >
            <div
                className={`relative aspect-3/4 overflow-hidden rounded-2xl bg-linear-to-br ${gradient}`}
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={`${name}'s profile photo`}
                        fill
                        sizes="(min-width: 640px) 18rem, 14rem"
                        priority={priority}
                        className="object-cover transition-transform duration-700 ease-out group-hover/polaroid:scale-[1.06]"
                    />
                ) : (
                    <div className="grid size-full place-items-center">
                        <span className="select-none text-5xl font-extrabold tracking-tight text-white/95 drop-shadow-sm">
                            {initials}
                        </span>
                    </div>
                )}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15"
                />

                <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
                    {isFeatured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700 ring-1 ring-fuchsia-100 shadow-sm">
                            <Sparkles className="size-3" />
                            Top pick
                        </span>
                    ) : (
                        <span aria-hidden="true" />
                    )}

                    <span className="grid size-6 place-items-center rounded-full bg-white/95 text-emerald-600 ring-1 ring-emerald-100 shadow-sm">
                        <BadgeCheck className="size-3.5" />
                    </span>
                </div>

                <div className="absolute inset-x-3 bottom-3 text-white">
                    <p className="flex items-baseline gap-1.5 text-base font-semibold leading-tight drop-shadow">
                        <span>{name}</span>
                        <span className="text-sm font-medium text-white/85">
                            {age}
                        </span>
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-white/85">
                        {location}
                    </p>
                </div>
            </div>

            <p className="px-2 pb-1 pt-2 text-center text-[11px] font-medium tracking-wide text-gray-500">
                {tagline}
            </p>
        </article>
    )
}

function StatsStrip() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl shadow-fuchsia-900/10 backdrop-blur sm:p-8">
                <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
                    {STATS.map((stat) => (
                        <li
                            key={stat.label}
                            className="flex flex-col items-center text-center"
                        >
                            <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                                {stat.value}
                            </span>
                            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                                {stat.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

function HowItWorks() {
    return (
        <section
            id="how"
            className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100">
                    How it works
                </span>
                <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Dating, but{" "}
                    <span className="bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                        finally calm.
                    </span>
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-gray-600">
                    Three thoughtful steps replace hours of mindless scrolling.
                </p>
            </div>

            <ol className="mt-14 grid gap-6 md:grid-cols-3">
                {STEPS.map(({ step, icon: Icon, title, body }) => (
                    <li
                        key={step}
                        className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-500/10"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute -right-12 -top-12 size-40 rounded-full bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                        />

                        <div className="relative flex items-center justify-between">
                            <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-rose-500 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/15">
                                <Icon className="size-6" />
                            </span>
                            <span className="text-sm font-semibold tracking-widest text-gray-300">
                                {step}
                            </span>
                        </div>

                        <h3 className="relative mt-6 text-lg font-semibold tracking-tight text-gray-900">
                            {title}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-gray-600">
                            {body}
                        </p>
                    </li>
                ))}
            </ol>
        </section>
    )
}

function Features() {
    return (
        <section className="relative">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-fuchsia-50/40 to-transparent"
            />

            <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100">
                        Why NextMatch
                    </span>
                    <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Built for people, not for swipes.
                    </h2>
                    <p className="mt-4 text-pretty text-base leading-relaxed text-gray-600">
                        Every detail is designed to help real connections
                        happen faster — and stay longer.
                    </p>
                </div>

                <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, body }) => (
                        <li
                            key={title}
                            className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-200 hover:shadow-lg hover:shadow-fuchsia-500/10"
                        >
                            <span className="grid size-11 place-items-center rounded-xl bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-100 transition-colors duration-300 group-hover:bg-linear-to-br group-hover:from-rose-500 group-hover:via-fuchsia-600 group-hover:to-violet-600 group-hover:text-white group-hover:ring-transparent">
                                <Icon className="size-5" />
                            </span>
                            <h3 className="mt-5 text-base font-semibold tracking-tight text-gray-900">
                                {title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                                {body}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

function Testimonials() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-100">
                        Real stories
                    </span>
                    <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Love stories that started here.
                    </h2>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-black/5">
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                        <Star className="size-4 fill-current" />
                        <Star className="size-4 fill-current" />
                        <Star className="size-4 fill-current" />
                        <Star className="size-4 fill-current" />
                        <Star className="size-4 fill-current" />
                    </span>
                    4.9 from 38,000 reviews
                </div>
            </div>

            <ul className="mt-12 grid gap-6 lg:grid-cols-3">
                {TESTIMONIALS.map(({ quote, name, meta, gradient }) => (
                    <li
                        key={name}
                        className="relative flex flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-fuchsia-500/10"
                    >
                        <Quote
                            aria-hidden="true"
                            className="size-7 text-fuchsia-200"
                        />
                        <p className="mt-4 flex-1 text-pretty text-base leading-relaxed text-gray-700">
                            {quote}
                        </p>
                        <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                            <span
                                className={`grid size-10 place-items-center rounded-full bg-linear-to-br ${gradient} text-sm font-semibold text-white shadow-md shadow-fuchsia-900/10`}
                            >
                                {name
                                    .split("&")[0]
                                    .trim()
                                    .charAt(0)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                    {name}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                    {meta}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

function FinalCta({
    isAuthenticated,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
}) {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden rounded-4xl bg-linear-to-br from-rose-600 via-fuchsia-600 to-violet-600 px-6 py-16 text-center shadow-2xl shadow-fuchsia-900/30 sm:px-12 sm:py-20">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-30"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.35) 0, transparent 45%)",
                    }}
                />

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur">
                    <Heart className="size-3 fill-current" />
                    {isAuthenticated
                        ? "Your matches are waiting"
                        : "Your story starts today"}
                </span>

                <h2 className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                    {isAuthenticated
                        ? "Pick up where you left off."
                        : "Ready to meet someone worth your time?"}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/85">
                    Join a community of thoughtful, real people looking for the
                    same thing you are. It only takes a minute.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        className="group h-12 rounded-full bg-white px-6 text-base font-semibold text-fuchsia-700 shadow-lg shadow-rose-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95"
                    >
                        <Link href={primaryHref}>
                            {primaryLabel}
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="h-12 rounded-full border border-white/30 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                        <Link href={secondaryHref}>{secondaryLabel}</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-black/5 bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Link
                            href="/"
                            aria-label="NextMatch home"
                            className="inline-flex items-center gap-2.5"
                        >
                            <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-rose-600 via-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/20">
                                <Swords className="size-5" />
                            </span>
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">
                                NextMatch
                            </span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
                            The calmer, smarter way to date. Curated daily
                            picks for people who are done with swiping.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                        {FOOTER_LINKS.map(({ heading, links }) => (
                            <div key={heading}>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                                    {heading}
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className="text-sm text-gray-600 transition-colors hover:text-fuchsia-700"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
                    <p className="text-xs text-gray-500">
                        © {year} NextMatch. Made with{" "}
                        <Heart className="inline size-3 fill-rose-500 text-rose-500" />{" "}
                        for real connections.
                    </p>
                    <p className="text-xs text-gray-500">
                        Designed for people, not algorithms.
                    </p>
                </div>
            </div>
        </footer>
    )
}
