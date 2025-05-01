import { cn } from "@/lib/ui-utils"
import { useTheme } from "next-themes"

export default function ProgressBar({
    percentage,
    className,
    filledClassName,
}: {
    className?: string
    percentage: number
    filledClassName?: string
}) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const getBarColor = (percentage: number): string => {
        if (percentage <= 33) {
            return "#3B82F6"
        } else if (percentage <= 66) {
            return "#44CC44"
        } else {
            return "#FFC800"
        }
    }

    return (
        <div
            className={cn(
                "relative w-full rounded-full bg-[#E5E5E5] dark:bg-neutral-700/50 transition-colors",
                className
            )}
        >
            <div
                style={{
                    backgroundColor: getBarColor(percentage),
                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                }}
                className={cn(
                    "relative rounded-full h-[14px] transition-all",
                    filledClassName
                )}
            >
                <div className="from-white/25 to-white/20 bg-linear-to-r h-1 absolute top-1 left-[8%] rounded-full w-[88%]" />
            </div>
        </div>
    )
}
