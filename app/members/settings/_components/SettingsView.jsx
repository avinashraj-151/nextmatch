"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
    Bell,
    BellRing,
    CheckCheck,
    CircleCheck,
    Eye,
    Globe2,
    Heart,
    HeartHandshake,
    KeyRound,
    Lock,
    Mail,
    MessageCircle,
    Monitor,
    Moon,
    Palette,
    Plane,
    Radio,
    ShieldAlert,
    ShieldCheck,
    Sliders,
    Sparkles,
    Sun,
    UserCog,
    UserRound,
    Users,
    Venus,
    Waves,
} from "lucide-react"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

import DangerZoneCard from "./DangerZoneCard"
import PremiumUpsellCard from "./PremiumUpsellCard"
import SegmentedControl from "./SegmentedControl"
import SettingsCard from "./SettingsCard"
import SettingsRow from "./SettingsRow"
import SettingsSidebar from "./SettingsSidebar"
import ToggleRow from "./ToggleRow"

const SHOW_ME_OPTIONS = [
    { value: "men", label: "Men", icon: UserRound },
    { value: "women", label: "Women", icon: Venus },
    { value: "everyone", label: "Everyone", icon: Users },
]

const THEME_OPTIONS = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
]

const SIDEBAR_ITEMS = [
    { id: "account", label: "Account", icon: UserCog },
    { id: "discovery", label: "Discovery", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "premium", label: "NextMatch+", icon: Sparkles, tone: "premium" },
    { id: "danger", label: "Danger zone", icon: ShieldAlert, tone: "danger" },
]

// Brand-themed slider track + thumb. Targets the shadcn Slider's data-slots.
const BRAND_SLIDER =
    "[&_[data-slot=slider-track]]:bg-fuchsia-100/70 " +
    "[&_[data-slot=slider-range]]:bg-linear-to-r " +
    "[&_[data-slot=slider-range]]:from-rose-500 " +
    "[&_[data-slot=slider-range]]:via-fuchsia-600 " +
    "[&_[data-slot=slider-range]]:to-violet-600 " +
    "[&_[data-slot=slider-thumb]]:size-4 " +
    "[&_[data-slot=slider-thumb]]:border-2 " +
    "[&_[data-slot=slider-thumb]]:border-fuchsia-500 " +
    "[&_[data-slot=slider-thumb]]:bg-white " +
    "[&_[data-slot=slider-thumb]]:shadow-md " +
    "[&_[data-slot=slider-thumb]]:shadow-fuchsia-900/20 " +
    "[&_[data-slot=slider-thumb]]:ring-fuchsia-300/50"

const PRO_BADGE = (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
        <Sparkles className="size-2.5" />
        Pro
    </span>
)

const VERIFIED_BADGE = (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
        <CircleCheck className="size-2.5" />
        Verified
    </span>
)

const INITIAL_SETTINGS = {
    discovery: {
        showMe: "everyone",
        ageRange: [22, 38],
        maxDistanceKm: 50,
        globalMode: false,
    },
    notifications: {
        newMatches: true,
        newMessages: true,
        likesBack: true,
        weeklyDigest: false,
        promotions: false,
    },
    privacy: {
        onlineStatus: true,
        showDistance: true,
        readReceipts: true,
        recentlyActive: true,
        incognito: false,
    },
    appearance: {
        theme: "system",
        reducedMotion: false,
    },
    account: {
        paused: false,
    },
}

function SettingsView({ email = "you@nextmatch.app", isPremium = false }) {
    const [settings, setSettings] = useState(INITIAL_SETTINGS)
    const [activeSection, setActiveSection] = useState("account")
    const contentRef = useRef(null)

    function update(section, key, value) {
        setSettings(function applyUpdate(prev) {
            return {
                ...prev,
                [section]: { ...prev[section], [key]: value },
            }
        })
    }

    function handleSelect(id) {
        setActiveSection(id)
        // Wait for re-render so the new panel exists, then bring its top into
        // view. Especially matters on mobile where the chip rail sits above
        // the panel and the user just tapped it.
        requestAnimationFrame(function scrollAfterRender() {
            if (contentRef.current) {
                contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        })
    }

    const { discovery, notifications, privacy, appearance, account } = settings

    return (
        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="lg:sticky lg:top-6 lg:self-start">
                <SettingsSidebar
                    items={SIDEBAR_ITEMS}
                    activeId={activeSection}
                    onSelect={handleSelect}
                />
            </aside>

            <div
                ref={contentRef}
                role="tabpanel"
                id={`${activeSection}-panel`}
                aria-labelledby={`${activeSection}-tab`}
                tabIndex={0}
                key={activeSection}
                className="scroll-mt-6 outline-none animate-in fade-in slide-in-from-bottom-1 duration-200"
            >
                {activeSection === "account" ? (
                    <SettingsCard
                        id="account"
                        icon={UserCog}
                        eyebrow="Profile & sign in"
                        title="Account"
                        description="Where we send things and who you signed up as."
                    >
                        <SettingsRow
                            icon={Mail}
                            label="Email"
                            description={email}
                            badge={VERIFIED_BADGE}
                        >
                            <span className="hidden text-xs font-medium text-gray-400 sm:inline">
                                Used for sign in
                            </span>
                        </SettingsRow>

                        <SettingsRow
                            icon={KeyRound}
                            label="Google"
                            description="Connected as your sign-in method."
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                <CircleCheck className="size-3" />
                                Connected
                            </span>
                        </SettingsRow>

                        <SettingsRow
                            icon={UserRound}
                            label="Profile details"
                            description="Bio, photos, location and the little things that make you, you."
                        >
                            <Link
                                href="/members/profile"
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-xl border border-fuchsia-200 bg-white px-3.5 py-2 text-xs font-semibold text-fuchsia-700 outline-none transition-all duration-200",
                                    "hover:border-fuchsia-300 hover:bg-fuchsia-50",
                                    "focus-visible:ring-2 focus-visible:ring-fuchsia-300",
                                )}
                            >
                                Manage profile
                            </Link>
                        </SettingsRow>
                    </SettingsCard>
                ) : null}

                {activeSection === "discovery" ? (
                    <SettingsCard
                        id="discovery"
                        icon={Sliders}
                        eyebrow="Who you'll see"
                        title="Discovery"
                        description="Tune the kinds of people you're shown, and how far we look."
                    >
                        <SettingsRow
                            label="Show me"
                            description="Who would you like to be matched with?"
                            align="start"
                        >
                            <SegmentedControl
                                ariaLabel="Show me"
                                options={SHOW_ME_OPTIONS}
                                value={discovery.showMe}
                                onChange={function handleShowMe(value) {
                                    update("discovery", "showMe", value)
                                }}
                            />
                        </SettingsRow>

                        {/* Age range — slider gets its own stacked layout */}
                        <div className="px-5 py-5 sm:px-6">
                            <div className="flex items-baseline justify-between gap-4">
                                <span className="text-sm font-semibold tracking-tight text-gray-900">
                                    Age range
                                </span>
                                <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-fuchsia-700 ring-1 ring-fuchsia-100">
                                    {discovery.ageRange[0]} – {discovery.ageRange[1]}
                                </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                People you&apos;d like to meet should fall in this window.
                            </p>
                            <Slider
                                value={discovery.ageRange}
                                min={18}
                                max={80}
                                step={1}
                                minStepsBetweenThumbs={1}
                                onValueChange={function handleAgeRange(value) {
                                    update("discovery", "ageRange", value)
                                }}
                                aria-label="Age range"
                                className={cn("mt-5", BRAND_SLIDER)}
                            />
                        </div>

                        {/* Distance */}
                        <div className="px-5 py-5 sm:px-6">
                            <div className="flex items-baseline justify-between gap-4">
                                <span className="text-sm font-semibold tracking-tight text-gray-900">
                                    Maximum distance
                                </span>
                                <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-fuchsia-700 ring-1 ring-fuchsia-100">
                                    {discovery.maxDistanceKm === 160 ? "160+ km" : `${discovery.maxDistanceKm} km`}
                                </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                Show people within this distance of where you live.
                            </p>
                            <Slider
                                value={[discovery.maxDistanceKm]}
                                min={1}
                                max={160}
                                step={1}
                                onValueChange={function handleDistance(value) {
                                    update("discovery", "maxDistanceKm", value[0])
                                }}
                                aria-label="Maximum distance in kilometers"
                                className={cn("mt-5", BRAND_SLIDER)}
                            />
                        </div>

                        <ToggleRow
                            icon={Plane}
                            label="Global mode"
                            description="Match with people anywhere in the world — distance becomes optional."
                            checked={discovery.globalMode}
                            onCheckedChange={function handleGlobalMode(value) {
                                update("discovery", "globalMode", value)
                            }}
                        />
                    </SettingsCard>
                ) : null}

                {activeSection === "notifications" ? (
                    <SettingsCard
                        id="notifications"
                        icon={Bell}
                        eyebrow="What we send you"
                        title="Notifications"
                        description="Pick what's worth a buzz and what isn't."
                    >
                        <ToggleRow
                            icon={Heart}
                            label="New matches"
                            description="A push the moment two hearts line up."
                            checked={notifications.newMatches}
                            onCheckedChange={function handleNewMatches(value) {
                                update("notifications", "newMatches", value)
                            }}
                        />
                        <ToggleRow
                            icon={MessageCircle}
                            label="New messages"
                            description="Don't keep them waiting."
                            checked={notifications.newMessages}
                            onCheckedChange={function handleNewMessages(value) {
                                update("notifications", "newMessages", value)
                            }}
                        />
                        <ToggleRow
                            icon={HeartHandshake}
                            label="They liked you back"
                            description="When someone you liked likes you back."
                            checked={notifications.likesBack}
                            onCheckedChange={function handleLikesBack(value) {
                                update("notifications", "likesBack", value)
                            }}
                        />
                        <ToggleRow
                            icon={BellRing}
                            label="Weekly digest"
                            description="A short Sunday recap of who's new in your area."
                            checked={notifications.weeklyDigest}
                            onCheckedChange={function handleWeeklyDigest(value) {
                                update("notifications", "weeklyDigest", value)
                            }}
                        />
                        <ToggleRow
                            icon={Sparkles}
                            label="Tips & promotions"
                            description="Occasional product updates and offers. We don't share your email with anyone."
                            checked={notifications.promotions}
                            onCheckedChange={function handlePromotions(value) {
                                update("notifications", "promotions", value)
                            }}
                        />
                    </SettingsCard>
                ) : null}

                {activeSection === "privacy" ? (
                    <SettingsCard
                        id="privacy"
                        icon={ShieldCheck}
                        eyebrow="What others see"
                        title="Privacy"
                        description="Decide what you share with the people who can see your profile."
                    >
                        <ToggleRow
                            icon={Eye}
                            label="Show online status"
                            description="A green dot when you're active on NextMatch."
                            checked={privacy.onlineStatus}
                            onCheckedChange={function handleOnlineStatus(value) {
                                update("privacy", "onlineStatus", value)
                            }}
                        />
                        <ToggleRow
                            icon={Globe2}
                            label="Show distance"
                            description="Display how far away you are on your profile."
                            checked={privacy.showDistance}
                            onCheckedChange={function handleShowDistance(value) {
                                update("privacy", "showDistance", value)
                            }}
                        />
                        <ToggleRow
                            icon={CheckCheck}
                            label="Read receipts"
                            description="Let your matches know when you've read a message."
                            checked={privacy.readReceipts}
                            onCheckedChange={function handleReadReceipts(value) {
                                update("privacy", "readReceipts", value)
                            }}
                        />
                        <ToggleRow
                            icon={Radio}
                            label="Show recently active"
                            description="Appear higher in lists when you've been on recently."
                            checked={privacy.recentlyActive}
                            onCheckedChange={function handleRecentlyActive(value) {
                                update("privacy", "recentlyActive", value)
                            }}
                        />
                        <ToggleRow
                            icon={Lock}
                            label="Incognito mode"
                            badge={PRO_BADGE}
                            description="Browse without appearing in anyone's discovery — only people you like will see you."
                            checked={privacy.incognito}
                            onCheckedChange={function handleIncognito(value) {
                                update("privacy", "incognito", value)
                            }}
                        />
                    </SettingsCard>
                ) : null}

                {activeSection === "appearance" ? (
                    <SettingsCard
                        id="appearance"
                        icon={Palette}
                        eyebrow="How NextMatch feels"
                        title="Appearance"
                        description="Light when you're out, dark when you're winding down."
                    >
                        <SettingsRow
                            label="Theme"
                            description="Match your system or pick a side. Always."
                            align="start"
                        >
                            <SegmentedControl
                                ariaLabel="Theme"
                                options={THEME_OPTIONS}
                                value={appearance.theme}
                                onChange={function handleTheme(value) {
                                    update("appearance", "theme", value)
                                }}
                            />
                        </SettingsRow>

                        <ToggleRow
                            icon={Waves}
                            label="Reduce motion"
                            description="Disable subtle animations across the app — kinder on the eyes and on small batteries."
                            checked={appearance.reducedMotion}
                            onCheckedChange={function handleReducedMotion(value) {
                                update("appearance", "reducedMotion", value)
                            }}
                        />
                    </SettingsCard>
                ) : null}

                {activeSection === "premium" ? (
                    <PremiumUpsellCard id="premium" isPremium={isPremium} />
                ) : null}

                {activeSection === "danger" ? (
                    <DangerZoneCard
                        id="danger"
                        paused={account.paused}
                        onPausedChange={function handlePaused(value) {
                            update("account", "paused", value)
                        }}
                        accountEmail={email}
                    />
                ) : null}
            </div>
        </div>
    )
}

export default SettingsView
