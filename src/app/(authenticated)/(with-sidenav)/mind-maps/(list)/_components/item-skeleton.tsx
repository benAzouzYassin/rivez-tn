import { Card, CardHeader } from "@/components/ui/card"

export default function ItemSkeleton() {
    return (
        <Card className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
            <div className="h-48 rounded-t-lg bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
            <div className="flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="w-full pb-4">
                            <div className="h-7 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                            <div className="flex flex-wrap gap-y-2 items-center gap-1 mt-3">
                                <div className="h-6 w-44 bg-gray-200 dark:bg-neutral-800 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </div>
        </Card>
    )
}
