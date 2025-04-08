import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ItemSkeleton() {
    return (
        <Card className="relative">
            <div className="h-48 rounded-t-lg bg-gray-200 animate-pulse"></div>

            <div className="flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="w-full">
                            <div className="h-7 w-3/4 bg-gray-200 rounded-md animate-pulse" />
                            <div className="flex flex-wrap gap-y-2 items-center gap-1 mt-3">
                                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                                <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                </CardHeader>

                <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-1">
                        <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse" />
                        <div className="h-4 w-10 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                        <div className="h-2 w-1/2 bg-gray-300 rounded-full animate-pulse" />
                    </div>
                </CardContent>

                <CardFooter className="flex pt-4 gap-1">
                    <div className="h-10 w-full bg-gray-300 rounded-md animate-pulse" />
                </CardFooter>
            </div>
        </Card>
    )
}
