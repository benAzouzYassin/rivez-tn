import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/ui-utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ",
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
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
