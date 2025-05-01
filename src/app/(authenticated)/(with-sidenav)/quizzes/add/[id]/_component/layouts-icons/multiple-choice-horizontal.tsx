import { cn } from "@/lib/ui-utils"

export default function MultipleChoiceHorizontal(props: {
    className?: string
    itemClassName?: string
    imageClassName?: string
    isIcon?: boolean
}) {
    return (
        <div
            className={cn(
                "flex rtl:scale-x-[-1] rtl:hover:scale-x-[-1] hover:cursor-pointer active:scale-[93%] hover:scale-[98%] scale-95 transition-all items-center"
            )}
        >
            <div
                className={cn(
                    "border ml-4 p-2 w-40 flex rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700",
                    props.className
                )}
            >
                <div
                    className={cn(
                        "bg-neutral-200 dark:bg-neutral-800 rtl:mr-3 h-22 rounded-md w-full",
                        props.imageClassName,
                        { "rtl:mr-0": props.isIcon }
                    )}
                ></div>
                <div
                    className={cn("ml-5 w-20 flex flex-col gap-2", {
                        "rtl:ml-0 rtl:mr-2": props.isIcon,
                    })}
                >
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 dark:bg-neutral-700 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                </div>
            </div>
        </div>
    )
}
