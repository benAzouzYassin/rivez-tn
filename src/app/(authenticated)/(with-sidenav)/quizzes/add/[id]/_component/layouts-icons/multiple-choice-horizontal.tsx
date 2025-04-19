import { cn } from "@/lib/ui-utils"

export default function MultipleChoiceHorizontal(props: {
    className?: string
    itemClassName?: string
    imageClassName?: string
}) {
    return (
        <div
            className={cn(
                "flex hover:cursor-pointer  active:scale-[93%] hover:scale-[98%] scale-95 transition-all items-center"
            )}
        >
            <div
                className={cn(
                    "border ml-4 p-2  w-32 md:w-40 flex rounded-xl",
                    props.className
                )}
            >
                <div
                    className={cn(
                        "bg-neutral-200 md:h-22 h-16 rounded-md w-full",
                        props.imageClassName
                    )}
                >
                    {" "}
                </div>
                <div className="md:ml-5 ml-2 w-20 flex flex-col gap-2">
                    <div
                        className={cn(
                            "bg-neutral-200 h-2 md:h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 h-2 md:h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 h-2 md:h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                    <div
                        className={cn(
                            "bg-neutral-200 h-2 md:h-4 rounded-md w-full",
                            props.itemClassName
                        )}
                    ></div>
                </div>
            </div>
        </div>
    )
}
