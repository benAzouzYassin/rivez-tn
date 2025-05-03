import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/ui-utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
    ChevronLeft,
    ChevronRight,
    DownloadIcon,
    HelpCircle,
} from "lucide-react"

export default function PagesViewerSkeleton() {
    return (
        <div
            dir={"ltr"}
            className="flex h-[89vh] overflow-hidden bg-gray-50 dark:bg-neutral-900 transition-colors"
        >
            <div className="xl:w-[360px] w-0 h-[95vh] overflow-y-hidden fixed pb-20 bg-white dark:bg-neutral-900 transition-colors">
                <ScrollArea className="w-full scale-x-[-1] xl:block hidden h-[95vh] -mt-1 border border-neutral-200 dark:border-neutral-700 overflow-y-auto py-4 bg-white dark:bg-neutral-900 transition-colors">
                    <div className="scale-x-[-1] pl-5 pr-3 pb-20 pt-5">
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-16 mt-3 transition-all animate-pulse cursor-not-allowed flex border border-neutral-200 dark:border-neutral-700 text-lg from-neutral-100 text-[#545454] dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-extrabold rounded-xl shadow-none w-full justify-start px-4"
                                    )}
                                >
                                    <p className="my-auto ml-3 rounded-sm h-3 w-[90%] bg-neutral-200 dark:bg-neutral-700"></p>
                                </div>
                            ))}
                    </div>
                </ScrollArea>
            </div>
            <div className={"xl:w-[21.5rem] xl:min-w-[21.5rem]"}></div>
            <div
                className={cn(
                    "md:max-w-[100%] max-w-screen flex-1 xl:max-w-[calc(100%-21.5rem)] xl:pl-4 relative"
                )}
            >
                <div className="w-screen"></div>

                <div className="bg-white dark:bg-neutral-900 md:p-5 p-2 rounded-lg h-[90vh] overflow-y-auto pb-20 -mt-1 pt-8 border border-neutral-200 dark:border-neutral-700 mx-auto transition-colors">
                    <div className="md:flex hidden print:hidden -mb-6 justify-end gap-2">
                        <Button variant={"secondary"} disabled>
                            Save <DownloadIcon className="ml-1" />
                        </Button>
                        <Button variant={"blue"} disabled>
                            Convert into Quiz <HelpCircle className="ml-1" />
                        </Button>
                    </div>
                    <div className="print:px-10 md:mt-0 -mt-10 md:pt-4 relative">
                        {/* Content skeleton */}
                        <div className="space-y-4 mt-8">
                            <Skeleton className="h-8 w-3/4 mb-6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />

                            <div className="py-4">
                                <Skeleton className="h-20 w-full rounded-md" />
                            </div>

                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </div>

                        <div className="print:hidden flex border-t-2 border-neutral-200 dark:border-neutral-700 pt-3 justify-between mb-4 mt-8">
                            <Button
                                variant={"secondary"}
                                className="text-base h-11 px-4 rounded-xl"
                                disabled
                            >
                                <ChevronLeft className="min-w-5 min-h-5 -mr-1 stroke-3" />
                                Previous
                            </Button>

                            <Button
                                disabled
                                className="text-base h-11 px-6 rounded-xl"
                            >
                                Next
                                <ChevronRight className="min-w-5 min-h-5 -ml-2 stroke-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
