import { cn } from "@/lib/ui-utils"

export default function ProgressBar({
    percentage,
    className,
}: {
    className?: string
    percentage: number
}) {
    const getBarColor = (percentage: number): string => {
        if (percentage <= 33) {
            return "#3B82F6" // Blue for low progress
        } else if (percentage <= 66) {
            return "#44CC44" // Green for medium progress
        } else {
            return "#FFC800" // Yellow for high progress
        }
    }

    return (
        <div
            className={cn(
                "relative bg-[#E5E5E5] w-full rounded-full",
                className
            )}
        >
            <div
                style={{
                    backgroundColor: getBarColor(percentage),
                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                }}
                className="relative rounded-full h-[14px] transition-all"
            >
                <div className="from-white/25 to-white/20 bg-gradient-to-r h-1 absolute top-1 left-2 rounded-full w-[90%]" />
            </div>
        </div>
    )
}
