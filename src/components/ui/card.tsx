import * as React from "react"
import { cn } from "@/lib/ui-utils"

const Card = React.forwardRef<
    HTMLDivElement | HTMLButtonElement,
    React.HTMLAttributes<HTMLDivElement | HTMLButtonElement> & {
        asButton?: boolean
    }
>(({ className, asButton, ...props }, ref) =>
    asButton ? (
        <button
            ref={ref as any}
            className={cn(
                "rounded-2xl overflow-hidden border-2 bg-white border-[#E5E5E5] text-neutral-700 shadow-[0px_4px_0px_0px] shadow-[#E5E5E5]",
                "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:shadow-neutral-700",
                className
            )}
            {...props}
        />
    ) : (
        <div
            ref={ref as any}
            className={cn(
                "rounded-2xl overflow-hidden border-2 bg-white border-[#E5E5E5] text-neutral-700 shadow-[0px_4px_0px_0px] shadow-[#E5E5E5]",
                "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:shadow-neutral-700",
                className
            )}
            {...props}
        />
    )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "text-sm text-neutral-500 dark:text-neutral-400",
            className
        )}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
