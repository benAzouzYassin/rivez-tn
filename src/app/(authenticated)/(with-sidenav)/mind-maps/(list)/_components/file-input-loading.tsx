"use client"

import { cn } from "@/lib/ui-utils"

interface Props {
    className?: string
    containerClassName?: string
}

export function FileInputLoading({ className, containerClassName }: Props) {
    return (
        <div
            className={cn(
                "relative flex items-center justify-center",
                className
            )}
        >
            <div
                className={cn(
                    "w-full min-h-[200px] border-2 border-dashed rounded-xl",
                    "transition-all duration-200 ease-in-out",
                    "flex items-center justify-center",
                    "border-neutral-300 bg-[#F7F7F7]/50 p-4",
                    containerClassName
                )}
            >
                <div className="relative min-w-[350px] w-full h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 animate-pulse"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-1/3 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
