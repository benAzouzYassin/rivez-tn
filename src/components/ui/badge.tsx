import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/ui-utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-xl px-4 py-2 text-sm !font-[800] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ",
    {
        variants: {
            variant: {
                red: "bg-transparent text-red-500 border-2 hover:bg-red-500/10 bg-red-500/5 border-red-500/30 focus:ring-red-500 shadow-red-500/30",
                blue: "bg-transparent text-blue-500 border-2 hover:bg-blue-500/10 bg-blue-500/5 border-blue-500/30 focus:ring-blue-500 shadow-blue-500/30",
                green: "bg-transparent text-emerald-500 border-2 hover:bg-emerald-500/10 bg-emerald-500/5 border-emerald-500/30 focus:ring-emerald-500 shadow-emerald-500/30",
                purple: "bg-transparent text-purple-500 border-2 hover:bg-purple-500/10 bg-purple-500/5 border-purple-500/30 focus:ring-purple-500 shadow-purple-500/30",
                orange: "bg-transparent text-orange-500 border-2 hover:bg-orange-500/10 bg-orange-500/5 border-orange-500/30 focus:ring-orange-500 shadow-orange-500/30",
                gray: "bg-transparent text-neutral-500 border-2 hover:bg-neutral-500/10 bg-neutral-500/5 border-neutral-500/30 focus:ring-neutral-500 shadow-neutral-500/30",
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
}
function Badge({
    className,
    variant,
    isLoading,
    children,
    ...props
}: BadgeProps) {
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
        </div>
    )
}

export { Badge, badgeVariants }
