"use client"

import { cn } from "@/lib/ui-utils"
import * as SelectPrimitive from "@radix-ui/react-select"
import { AlertCircle, ChevronDown } from "lucide-react"
import * as React from "react"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value
const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
        errorMessage?: string
        isDarkMode?: boolean
    }
>(({ className, children, errorMessage, isDarkMode, ...props }, ref) => (
    <div>
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex rtl:flex-row-reverse w-full items-center hover:cursor-pointer justify-between",
                "rounded-xl transition-all duration-200",
                "font-semibold border-2 p-3 h-12",
                "placeholder:font-medium",
                "placeholder:transition-all focus:placeholder:translate-x-1",
                "focus:outline-none focus:ring-1 focus:ring-offset-0",
                // Light mode styles
                {
                    "bg-[#F7F7F7]/50 border-[#E5E5E5] hover:bg-blue-50":
                        !isDarkMode,
                    "placeholder:text-[#AFAFAF]": !isDarkMode,
                    "focus:border-blue-300 focus:ring-blue-200/50":
                        !isDarkMode && !errorMessage,
                },
                // Dark mode styles
                {
                    "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700":
                        isDarkMode,
                    "placeholder:text-gray-500": isDarkMode,
                    "focus:border-blue-600 focus:ring-blue-800/50":
                        isDarkMode && !errorMessage,
                },
                // Error styles for both modes
                {
                    "border-red-400 focus:border-red-400 focus:ring-red-200/50":
                        !!errorMessage && !isDarkMode,
                    "border-red-500 focus:border-red-500 focus:ring-red-800/50":
                        !!errorMessage && isDarkMode,
                },
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown
                    className={cn("h-4 ml-1 w-4 stroke-2", {
                        "opacity-50": !isDarkMode,
                        "opacity-70": isDarkMode,
                    })}
                />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <div
            className={cn(
                "h-4 transition-all duration-200",
                "flex text-sm items-center gap-1 font-medium",
                { "h-9 pb-1": !!errorMessage },
                { "text-red-500": !isDarkMode && !!errorMessage },
                { "text-red-400": isDarkMode && !!errorMessage }
            )}
        >
            {!!errorMessage && (
                <AlertCircle className="h-4 w-4 ml-1 shrink-0" />
            )}
            <span className="first-letter:capitalize">{errorMessage}</span>
        </div>
    </div>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
        isDarkMode?: boolean
    }
>(({ className, children, position = "popper", isDarkMode, ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 min-w-[200px] overflow-hidden rounded-xl border shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                // Light mode styles
                { "bg-white text-neutral-950 border-neutral-200": !isDarkMode },
                // Dark mode styles
                { "bg-gray-800 text-gray-200 border-gray-700": isDarkMode },
                className
            )}
            position={position}
            {...props}
        >
            <SelectPrimitive.Viewport
                className={cn(
                    "h-[150px] p-0",
                    position === "popper" &&
                        "w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
        isDarkMode?: boolean
    }
>(({ className, children, isDarkMode, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex rtl:flex-row-reverse h-10 w-full active:scale-[97%] rounded-sm px-2 py-2 hover:cursor-pointer select-none items-center shadow-[0px_1px_0px] transition-all pl-4 text-base font-medium outline-none",
            // Light mode styles
            {
                "shadow-neutral-200 hover:bg-sky-200/70 focus:bg-sky-200/70 focus:text-neutral-900":
                    !isDarkMode,
            },
            // Dark mode styles
            {
                "shadow-gray-700 hover:bg-blue-800/40 focus:bg-blue-800/40 focus:text-gray-100":
                    isDarkMode,
            },
            { "opacity-50": props.disabled },
            className
        )}
        {...props}
    >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// Keep other components but remove unused ones
export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
}
