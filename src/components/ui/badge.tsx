import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/ui-utils"
import { X } from "lucide-react"

const badgeVariants = cva(
    "inline-flex relative items-center rounded-xl px-4 py-2 text-sm !font-[800] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                red: "bg-transparent text-red-500 border-2 hover:bg-red-500/10 bg-red-500/5 border-red-500/30 focus:ring-red-500 shadow-red-500/30 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/40 dark:hover:bg-red-500/20",
                blue: "bg-transparent text-blue-500 border-2 hover:bg-blue-500/10 bg-blue-500/5 border-blue-500/30 focus:ring-blue-500 shadow-blue-500/30 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/40 dark:hover:bg-blue-500/20",
                green: "bg-transparent text-emerald-500 border-2 hover:bg-emerald-500/10 bg-emerald-500/5 border-emerald-500/30 focus:ring-emerald-500 shadow-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/40 dark:hover:bg-emerald-500/20",
                purple: "bg-transparent text-purple-500 border-2 hover:bg-purple-500/10 bg-purple-500/5 border-purple-500/30 focus:ring-purple-500 shadow-purple-500/30 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/40 dark:hover:bg-purple-500/20",
                orange: "bg-transparent text-orange-500 border-2 hover:bg-orange-500/10 bg-orange-500/5 border-orange-500/30 focus:ring-orange-500 shadow-orange-500/30 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/40 dark:hover:bg-orange-500/20",
                gray: "bg-transparent text-neutral-500 border-2 hover:bg-neutral-500/10 bg-neutral-500/5 border-neutral-500/30 focus:ring-neutral-500 shadow-neutral-500/30 dark:text-neutral-300 dark:bg-neutral-700/40 dark:border-neutral-500/40 dark:hover:bg-neutral-700/60",
            },
        },
        defaultVariants: {
            variant: "gray",
        },
    }
)

const deleteButtonVariants = cva(
    "absolute -top-2 -right-2 p-0.5 rounded-full transition-all duration-200 border hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                red: "bg-red-500/5 border-red-500/30 text-red-500 hover:bg-red-500/10 focus:ring-red-500 dark:bg-red-500/20 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/30",
                blue: "bg-blue-500/5 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 focus:ring-blue-500 dark:bg-blue-500/20 dark:border-blue-500/40 dark:text-blue-400 dark:hover:bg-blue-500/30",
                green: "bg-emerald-500/5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 focus:ring-emerald-500 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-500/30",
                purple: "bg-purple-500/5 border-purple-500/30 text-purple-500 hover:bg-purple-500/10 focus:ring-purple-500 dark:bg-purple-500/20 dark:border-purple-500/40 dark:text-purple-400 dark:hover:bg-purple-500/30",
                orange: "bg-orange-500/5 border-orange-500/30 text-orange-500 hover:bg-orange-500/10 focus:ring-orange-500 dark:bg-orange-500/20 dark:border-orange-500/40 dark:text-orange-400 dark:hover:bg-orange-500/30",
                gray: "bg-neutral-500/5 border-neutral-500/30 text-neutral-500 hover:bg-neutral-500/10 focus:ring-neutral-500 dark:bg-neutral-700/40 dark:border-neutral-500/40 dark:text-neutral-300 dark:hover:bg-neutral-700/60",
            },
        },
        defaultVariants: {
            variant: "gray",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    isLoading?: boolean
    onDelete?: () => void
}

function Badge({
    className,
    variant,
    isLoading,
    children,
    onDelete,
    ...props
}: BadgeProps) {
    if (!children) {
        return null
    }
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
            {isLoading ? (
                <div className="flex items-center relative gap-2">
                    <div className="h-3 w-3 absolute left-1/2 -translate-x-1/2 animate-spin duration-300 min-w-fit rounded-full border-2 border-current border-t-transparent" />
                    <div className="opacity-0">{children}</div>
                </div>
            ) : (
                children
            )}
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className={cn(
                        deleteButtonVariants({ variant }),
                        "bg-white dark:bg-neutral-900 cursor-pointer"
                    )}
                    aria-label="Remove"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    )
}

export { Badge, badgeVariants }
