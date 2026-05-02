import Link from "next/link"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

const ProfileGallery = ({
    photos = [],
}) => (
    <section aria-labelledby="profile-photos-title" className="space-y-5">
        <header className="flex items-end justify-between gap-3">
            <div>
                <div className="flex flex-row justify-center items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-800">Photos</h3>
                    <p className="text-sm text-gray-600">
                        {photos.length}
                    </p>
                </div>
            </div>
            <div>
                <button
                    type="button"
                    className={cn(
                        "group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none",
                        "bg-linear-to-r from-rose-600 via-fuchsia-600 to-violet-600",
                        "shadow-md shadow-fuchsia-900/20 transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-900/25",
                        "focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:ring-offset-2",
                    )}
                >
                    <Camera className="size-4" />
                    Add photos
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[300%]"
                    />
                </button>
            </div>
        </header>
        {/* photo gallery with ellipse when we hover so that we show the ellipse and when we click on ellipse we get popover and we have  we can option for delete and make it profile photo 
         */}
        <div>
        </div>
    </section>
)

export default ProfileGallery
