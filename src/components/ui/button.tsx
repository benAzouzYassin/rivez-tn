import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/ui-utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center hover:cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md border-[#E5E5E5] font-bold transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-neutral-900 h-[44px] text-neutral-50 shadow-sm hover:bg-neutral-900/90 ",
                blue: "bg-[#1CB0F6] h-[44px]   shadow-[0px_4px_0px_0px] shadow-[#1899D6]  rounded-2xl text-white   transition-all  active:shadow-transparent active:translate-y-1",
                green: "bg-[#58CC02] h-[44px]   shadow-[0px_4px_0px_0px] shadow-[#58A700]  rounded-2xl text-white   transition-all  active:shadow-transparent active:translate-y-1",
                red: "bg-[#FF5353] h-[44px]   shadow-[0px_4px_0px_0px] shadow-[#FF2020]  rounded-2xl text-white   transition-all  active:shadow-transparent active:translate-y-1",
                secondary:
                    "bg-white  hover:bg-neutral-100 h-[46px]  shadow-[0px_4px_0px_0px] shadow-[#E5E5E5]  rounded-2xl text-neutral-700 border-2   transition-all  active:shadow-transparent active:translate-y-1",
                destructive:
                    "bg-red-500 text-neutral-50 shadow-xs hover:bg-red-500/90 ",
                outline:
                    "border border-neutral-200 bg-white shadow-xs hover:bg-neutral-100 hover:text-neutral-900 ",
                "outline-red":
                    "border-2 text-red-400 hover:text-red-400 hover:bg-red-50/70 bg-white rounded-xl border-red-300 shadow-xs  active:scale-95",
                ghost: "hover:bg-neutral-100 active:scale-95 hover:text-neutral-900 ",
                link: "text-neutral-900 underline-offset-4 hover:underline ",
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
                    <>
                        {children}
                        <Loader2 className="ml-2 animate-spin stroke-[2.5]   h-[22px]! duration-300 w-[22px]!" />
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
