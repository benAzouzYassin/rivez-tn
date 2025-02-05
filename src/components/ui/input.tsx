import * as React from "react"
import { cn } from "@/lib/ui-utils"
import { AlertCircle } from "lucide-react"

const Input = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input"> & {
        errorMessage?: string
    }
>(({ className, errorMessage, type, ...props }, ref) => {
    return (
        <div>
            <input
                type={type}
                className={cn(
                    "rounded-xl transition-all duration-200",
                    "bg-[#F7F7F7]/50 font-medium border-2 p-3 h-12 border-[#E5E5E5]",
                    "placeholder:font-medium placeholder:text-[#AFAFAF]",
                    "placeholder:transition-all focus:placeholder:translate-x-1",
                    "focus:outline-none focus:ring-1 focus:ring-offset-0",
                    "focus:border-blue-300 focus:ring-blue-200/50",
                    {
                        "border-red-400 focus:border-red-400 focus:ring-red-200/50":
                            !!errorMessage,
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
            <div
                className={cn(
                    "text-red-500 h-4 transition-all duration-200",
                    "flex text-sm items-center gap-1 font-medium",
                    { "h-9 pb-1": !!errorMessage }
                )}
            >
                {!!errorMessage && (
                    <AlertCircle className="h-4 w-4 ml-1 shrink-0" />
                )}
                <span className="first-letter:capitalize">{errorMessage}</span>
            </div>
        </div>
    )
})
Input.displayName = "Input"

export { Input }
