import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/ui-utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border-[#E5E5E5] font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300",
    {
        variants: {
            variant: {
                default:
                    "bg-neutral-900 h-[44px] text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
                blue: "bg-[#1CB0F6] h-[44px]   shadow-[0px_4px_0px_0px] shadow-[#1899D6]  rounded-2xl text-white   transition-all  active:shadow-transparent active:translate-y-1",
                green: "bg-[#58CC02] h-[44px]   shadow-[0px_4px_0px_0px] shadow-[#58A700]  rounded-2xl text-white   transition-all  active:shadow-transparent active:translate-y-1",
                secondary:
                    "bg-white  hover:bg-neutral-100 h-[46px]  shadow-[0px_4px_0px_0px] shadow-[#E5E5E5]  rounded-2xl text-black border-2   transition-all  active:shadow-transparent active:translate-y-1",
                destructive:
                    "bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
                outline:
                    "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
                ghost: "hover:bg-neutral-100 active:scale-95 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
                link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
            },
            size: {
                default: "text-sm px-5 ",
                sm: "h-8 text-sm rounded-md px-3 text-xs",
                lg: "h-10  rounded-md px-8",
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
                    <Loader2 className="animate-spin stroke-[2.5]   !h-[22px] duration-300 !w-[22px]" />
                ) : (
                    children
                )}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
