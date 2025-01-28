"use client"

import { cn } from "@/lib/ui-utils"

export default function QuestionSkeleton() {
    return (
        <>
            <div className="flex flex-col relative h-fit items-center justify-center">
                <div className="max-w-[1000px] mb-1 h-12 bg-neutral-200 animate-pulse rounded-lg w-full" />
                <div className="relative w-fit mt-4">
                    <div className="h-[310px] w-[500px] bg-neutral-200 animate-pulse rounded-lg" />
                </div>
            </div>
            <div className="w-full">
                <div className="max-w-[1000px] mx-auto mt-10 gap-5 w-full grid grid-cols-2">
                    {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className={cn(
                                "min-h-20 rounded-lg bg-neutral-200 animate-pulse",
                                "hover:bg-neutral-200"
                            )}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
