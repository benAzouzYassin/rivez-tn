import { cn } from "@/lib/ui-utils"

export default function MatchingPairs(props: {
    className?: string
    itemClassName?: string
}) {
    return (
        <div
            className={cn(
                "flex hover:cursor-pointer active:scale-[93%] hover:scale-[98%] scale-95 transition-all items-center"
            )}
        >
            <div
                className={cn(
                    "border ml-4 p-2 w-40 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700",
                    props.className
                )}
            >
                <div className="flex gap-4">
                    <div
                        className={cn(
                            "bg-white dark:bg-neutral-900 h-4 rounded-md w-1/3",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-2/3",
                            props.itemClassName
                        )}
                    ></div>
                </div>
                <div className="flex gap-4 mt-2">
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-1/3",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-2/3",
                            props.itemClassName
                        )}
                    ></div>
                </div>
                <div className="flex gap-4 mt-2">
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-1/3",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-2/3",
                            props.itemClassName
                        )}
                    ></div>
                </div>
                <div className="flex gap-4 mt-2">
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-1/3",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-2/3",
                            props.itemClassName
                        )}
                    ></div>
                </div>
                <div className="flex gap-4 mt-2">
                    <div
                        className={cn(
                            "bg-white dark:bg-neutral-900 h-4 rounded-md w-1/3",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-2/3",
                            props.itemClassName
                        )}
                    ></div>
                </div>
            </div>
        </div>
    )
}
