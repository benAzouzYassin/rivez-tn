import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ItemSkeleton() {
    return (
        <Card className="relative dark:bg-neutral-800 dark:border-neutral-700">
            <div className="h-48 rounded-t-lg bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>

            <div className="flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="w-full">
                            <div className="h-7 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded-md animate-pulse" />
                            <div className="flex flex-wrap gap-y-2 items-center gap-1 mt-3">
                                <div className="h-6 w-16 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                                <div className="h-6 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-2 my-3">
                    <div className="h-10 w-full bg-gray-300 dark:bg-neutral-600 rounded-md animate-pulse" />
                </CardContent>
            </div>
        </Card>
    )
}
