import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/ui-utils"
import { Loader2 } from "lucide-react"
const buttonVariants = cva(
    "inline-flex items-center hover:cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md border-[#E5E5E5] dark:border-neutral-700 font-bold transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                blue: "bg-[#3593ff] dark:bg-[#3086e0] h-[44px] hover:bg-blue-500 dark:hover:bg-[#2973be] shadow-[0px_4px_0px_0px] shadow-[#258dbe] dark:shadow-[#256ca6] rounded-2xl text-white transition-all active:shadow-transparent active:translate-y-1",
                green: "bg-[#58CC02] dark:bg-[#56c000] h-[44px] shadow-[0px_4px_0px_0px] shadow-[#58A700] dark:shadow-[#4fa000] rounded-2xl text-white transition-all active:shadow-transparent active:translate-y-1",
                red: "bg-[#FF5353] dark:bg-[#f25a5a] h-[44px] shadow-[0px_4px_0px_0px] shadow-[#FF2020] dark:shadow-[#d13c3c] rounded-2xl text-white transition-all active:shadow-transparent active:translate-y-1",
                secondary:
                    "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 h-[46px] shadow-[0px_4px_0px_0px] shadow-[#E5E5E5] dark:shadow-neutral-700 rounded-2xl text-neutral-700 dark:text-neutral-200 border-2 dark:border-neutral-700 transition-all active:shadow-transparent active:translate-y-1",
                default:
                    "bg-neutral-800 dark:bg-neutral-650 text-white/95 hover:bg-neutral-700 dark:hover:bg-neutral-600 h-[46px] shadow-[0px_4px_0px_0px] shadow-neutral-500 dark:shadow-neutral-800 rounded-2xl border-2 transition-all active:shadow-transparent active:translate-y-1 border-neutral-500 dark:border-neutral-700",
                destructive:
                    "bg-red-500 dark:bg-red-500 text-neutral-50 shadow-xs hover:bg-red-500/90 dark:hover:bg-red-400",
                outline:
                    "border-2 active:scale-95 transition-all border-neutral-300 dark:border-neutral-600 h-[44px] bg-white dark:bg-neutral-750 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-neutral-900 dark:hover:text-neutral-100 dark:text-neutral-200",
                "outline-red":
                    "border-2 text-red-400 dark:text-red-300 hover:text-red-400 dark:hover:text-red-200 hover:bg-red-50/70 dark:hover:bg-red-800/30 bg-white dark:bg-neutral-750 rounded-xl border-red-300 dark:border-red-700 shadow-xs active:scale-95",
                ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-750 active:scale-95 hover:text-neutral-900 dark:hover:text-neutral-100 dark:text-neutral-200",
                link: "text-neutral-900 dark:text-neutral-100 underline-offset-4 hover:underline",
            },
            size: {
                default: "md:text-base px-5 text-xs",
                sm: "h-8 md:text-sm rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            disabled,
            className,
            isLoading,
            children,
            variant,
            size,
            asChild = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                disabled={isLoading || disabled}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <>
                        {children}
                        <Loader2 className="ml-2 animate-spin stroke-[2.5] h-[22px]! duration-300 w-[22px]!" />
                    </>
                ) : (
                    children
                )}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
