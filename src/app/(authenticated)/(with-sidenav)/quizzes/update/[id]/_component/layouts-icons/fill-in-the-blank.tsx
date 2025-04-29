import { cn } from "@/lib/ui-utils"

export default function FillInTheBlank(props: {
    className?: string
    itemClassName?: string
    questionTextClassName: string
    isMinimized: boolean
}) {
    return (
        <div
            className={cn(
                "flex hover:cursor-pointer active:scale-[93%] hover:scale-[98%] scale-95 transition-all items-center",
                props.className
            )}
        >
            <div
                className={cn(
                    "border border-neutral-200 dark:border-neutral-700 ml-4 p-2 w-48 rounded-xl",
                    props.className
                )}
            >
                <div
                    className={cn(
                        "bg-neutral-200 dark:bg-neutral-800 h-2 rounded-md w-3/4 mx-auto mt-4",
                        props.questionTextClassName
                    )}
                ></div>
                <div
                    className={cn(
                        "grid mt-2 h-7 grid-cols-12 gap-y-[6px] gap-x-2",
                        {
                            "grid-cols-10 mt-3 h-3 overflow-hidden":
                                props.isMinimized,
                        }
                    )}
                >
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-5 rounded w-full col-span-3"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-5 rounded w-full col-span-2"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-5 rounded w-full col-span-3"
                        )}
                    ></div>
                </div>
                <div
                    className={
                        "grid pb-2 mt-4 grid-cols-12 gap-y-[12px] gap-x-2"
                    }
                >
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-2 rounded w-full col-span-10"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-2 rounded w-full col-span-2"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-2 rounded w-full col-span-3"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-2 rounded w-full col-span-8"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-2 rounded w-full col-span-5"
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-800 h-2 rounded w-full col-span-7"
                        )}
                    ></div>
                </div>
            </div>
        </div>
    )
}
