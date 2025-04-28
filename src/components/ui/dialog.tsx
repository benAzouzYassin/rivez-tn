"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/ui-utils"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
    DrawerTrigger,
} from "@/components/ui/drawer"

const Dialog = ({ children, ...props }: DialogPrimitive.DialogProps) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return <Drawer {...props}>{children}</Drawer>
    }

    return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
}

const DialogTrigger = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> & {
        asChild?: boolean
    }
>(({ asChild, ...props }, ref) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return <DrawerTrigger ref={ref} asChild={asChild} {...props} />
    }

    return <DialogPrimitive.Trigger ref={ref} asChild={asChild} {...props} />
})
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        onClick={(e) => e.stopPropagation()}
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        direction?: "top" | "bottom" | "left" | "right"
    }
>(({ className, children, direction = "bottom", ...props }, ref) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return (
            <DrawerContent className={cn("p-4", className)} {...props}>
                {children}
            </DrawerContent>
        )
    }

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed max-h-[95vh] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 !rounded-2xl overflow-y-auto left-[50%] top-[50%] z-50 grid w-full max-w-[95vw] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white px-2 py-3 md:px-6 md:py-6 shadow-lg dark:shadow-neutral-900/80 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 sm:rounded-lg dark:text-neutral-200",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute rtl:left-4 ltr:right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400">
                    <div className="rounded-2xl">
                        <X className="h-5 w-5 text-neutral-500 dark:text-neutral-400 stroke-3 hover:text-red-600 dark:hover:text-red-400 cursor-pointer" />
                    </div>
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return <DrawerHeader className={className} {...props} />
    }

    return (
        <div
            className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                className
            )}
            {...props}
        />
    )
}
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return <DrawerFooter className={className} {...props} />
    }

    return (
        <div
            className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className
            )}
            {...props}
        />
    )
}
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return <DrawerTitle className={className} {...props} />
    }

    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn(
                "text-lg font-semibold leading-none tracking-tight dark:text-neutral-200",
                className
            )}
            {...props}
        />
    )
})
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
    const isSmallScreen = useIsSmallScreen()

    if (isSmallScreen) {
        return <DrawerDescription className={className} {...props} />
    }

    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn(
                "text-sm text-neutral-500 dark:text-neutral-400",
                className
            )}
            {...props}
        />
    )
})
DialogDescription.displayName = "DialogDescription"

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
