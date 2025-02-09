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
    }
>(({ className, children, errorMessage, ...props }, ref) => (
    <div>
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex w-full items-center hover:cursor-pointer hover:bg-blue-50 justify-between",
                "rounded-xl transition-all duration-200",
                "bg-[#F7F7F7]/50 font-semibold border-2 p-3 h-12 border-[#E5E5E5]",
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
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 ml-1 w-4 stroke-2 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <div
            className={cn(
                "text-red-500 h-4 transition-all duration-200",
                "flex text-sm items-center gap-1 font-medium",
                { "h-9 pb-1": !!errorMessage }
            )}
        >
            {!!errorMessage && (
                <AlertCircle className="h-4 w-4 ml-1  shrink-0" />
            )}
            <span className="first-letter:capitalize">{errorMessage}</span>
        </div>
    </div>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 min-w-[200px] overflow-hidden rounded-xl border bg-white text-neutral-950 shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
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
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex h-10 w-full active:scale-[97%] rounded-sm px-2 py-2 hover:cursor-pointer select-none items-center  shadow-[0px_1px_0px] transition-all shadow-neutral-200 pl-4 text-base font-medium  focus:bg-sky-200/70 focus:text-neutral-900 outline-none",
            className,
            { "opacity-50": props.disabled }
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
