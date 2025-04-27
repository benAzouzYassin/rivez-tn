import { cn } from "@/lib/ui-utils"

export default function MultipleChoiceVertical(props: {
    isIcon?: boolean
    className?: string
    itemClassName?: string
    imageClassName?: string
    textClassName: string
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
                    "border ml-4  p-2 w-40 rounded-xl",
                    props.className
                )}
            >
                <div
                    className={cn(
                        "bg-neutral-200 h-2 rounded-md w-3/4 mx-auto mt-4",
                        props.textClassName
                    )}
                ></div>
                <div
                    className={cn(
                        "bg-neutral-200 h-12 rounded-md w-full",
                        props.imageClassName
                    )}
                >
                    {" "}
                </div>
                <div
                    className={cn(
                        "grid mt-2 rtl:pr-4  grid-cols-2 gap-y-[6px] gap-x-2",
                        { "rtl:pr-0 ": props.isIcon }
                    )}
                >
                    <div
                        className={cn(
                            "bg-neutral-200 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                </div>
            </div>
        </div>
    )
}
