import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

function MarkdownShadowLoading() {
    return (
        <div className="space-y-4 p-3 md:p-5  w-full  mx-auto">
            <Skeleton className="h-10 w-3/4 mt-5 mb-6" />

            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-8 w-2/3 my-6" />

            <Skeleton className="h-32 w-full rounded-md" />

            <div className="space-y-2 mt-6">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-11/12" />
            </div>

            <Skeleton className="h-8 w-1/2 my-6" />

            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}

export default MarkdownShadowLoading
