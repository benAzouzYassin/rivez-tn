import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ItemSkeleton() {
    return (
        <Card className="relative">
            <div className="h-48 rounded-t-lg bg-gray-200 animate-pulse"></div>

            <div className="flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="w-full pb-4">
                            <div className="h-7 w-3/4 bg-gray-200 rounded-md animate-pulse" />
                            <div className="flex flex-wrap gap-y-2 items-center gap-1 mt-3">
                                <div className="h-6 w-44 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </div>
        </Card>
    )
}
