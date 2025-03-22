import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { Check } from "lucide-react"
import { ComponentProps } from "react"
import Continue from "../_icons/continue"
import Star from "../_icons/star"
import Banner from "./banner"

type Props = {} & ComponentProps<typeof Banner>

export default function LearningPathSection(props: Props) {
    const fakeItems = [
        {
            courseDone: 8,
            totalCourses: 8,
            name: "useState",
            status: "done",
            id: "1",
        },
        {
            courseDone: 7,
            totalCourses: 8,
            name: "useEffect",
            status: "in-progress",
            id: "2",
        },
        {
            courseDone: 0,
            totalCourses: 8,
            name: "useEffect",
            status: "disabled",
            id: "3",
        },
        {
            courseDone: 0,
            totalCourses: 8,
            name: "useEffect",
            status: "disabled",
            id: "3",
        },
        {
            courseDone: 0,
            totalCourses: 8,
            name: "useEffect",
            status: "disabled",
            id: "4",
        },
    ]

    // Function to chunk array into groups of specified size
    function chunkArray<T>(array: T[], size: number) {
        const result = []
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size))
        }
        return result
    }

    // Group items into rows of 3
    const groupedItems = chunkArray(fakeItems, 3)

    return (
        <div>
            <Banner
                content={props.content}
                title={props.title}
                variant={props.variant}
            />
            <div className="flex   h-fit pb-20 flex-col mt-10 gap-4">
                {groupedItems.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="flex flex-col gap-16 mt-5 w-fit mx-auto isolate  justify-center"
                    >
                        {group.map((item, itemIndex) => {
                            const translateX = `${
                                groupIndex % 2 === 0 ? "-" : ""
                            }${(itemIndex % 3) * 7}0px`
                            return (
                                <div
                                    style={{ translate: translateX }}
                                    key={`${groupIndex}-${itemIndex}`}
                                    className="relative"
                                >
                                    {item.status === "in-progress" && (
                                        <svg
                                            viewBox="0 0 36 36"
                                            className="absolute  overflow-visible -translate-y-[18px] scale-x-[113%] scale-y-[106%] -z-50 -translate-x-[8px] top-0 left-0  m-[10px_auto] w-[6.3rem] "
                                        >
                                            <path
                                                className=" fill-none "
                                                d="M18 2.0845  a 15.9155 15.9155 0 0 1 0 31.831  a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className="fill-none   stroke-amber-400/80 stroke-5  circle"
                                                strokeDasharray={cn(
                                                    `${
                                                        (item.courseDone *
                                                            100) /
                                                        item.totalCourses
                                                    }, 100`
                                                )}
                                                strokeLinecap="round"
                                                d="M18 2.0845      a 15.9155 15.9155 0 0 1 0 31.831      a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                    )}
                                    {item.status === "in-progress" && (
                                        <div
                                            className={cn(
                                                "h-12 absolute font-extrabold text-base  bounce-horizontal  w-24 flex items-center justify-center top-2 -left-28 border-neutral-200 rounded-xl bg-white border-2",
                                                {
                                                    "text-sky-400 ":
                                                        props.variant === "sky",
                                                    "text-green-400":
                                                        props.variant ===
                                                        "green",
                                                    "text-purple-400":
                                                        props.variant ===
                                                        "purple",
                                                    "text-yellow-400":
                                                        props.variant ===
                                                        "yellow",
                                                    "text-orange-400":
                                                        props.variant ===
                                                        "orange",

                                                    "text-emerald-400 ":
                                                        props.variant ===
                                                        "emerald",
                                                }
                                            )}
                                        >
                                            START
                                            <svg
                                                width="42"
                                                height="33"
                                                viewBox="0 0 42 33"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-neutral-200 absolute -right-[14px] scale-y-[120%] overflow-visible rotate-90 h-3 w-3 white "
                                            >
                                                <path
                                                    className="stroke-5 fill-white"
                                                    stroke="currentColor"
                                                    d="M56.7917 36.5L42.7187 17.75L31.0452 2.19678C29.8452 0.597917 27.4465 0.597919 26.2465 2.19678L0.5 36.5"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    <Button
                                        className={cn(
                                            "rounded-full   shadow-[0px_6px_0px_0px] active:translate-y-[6px] scale-x-[115%] h-20 z-20",
                                            {
                                                "!bg-neutral-100   !shadow-neutral-300 !border-neutral-300 ":
                                                    item.status === "disabled",

                                                "hover:bg-sky-400/90 bg-sky-400 border-2 shadow-sky-600 border-sky-600":
                                                    props.variant === "sky",
                                                "hover:bg-green-400/90 bg-green-400 border-2  shadow-green-500  border-green-500":
                                                    props.variant === "green",
                                                "hover:bg-purple-400/90 bg-purple-400 border-2 shadow-purple-500 border-purple-500":
                                                    props.variant === "purple",
                                                "hover:bg-yellow-400/90 bg-yellow-400 border-2  shadow-yellow-500 border-yellow-500":
                                                    props.variant === "yellow",
                                                "hover:bg-orange-400/90 bg-orange-400 border-2 shadow-orange-500 border-orange-500":
                                                    props.variant === "orange",

                                                "hover:bg-emerald-400/90 bg-emerald-400 border-2  shadow-emerald-500 border-emerald-500 ":
                                                    props.variant === "emerald",
                                            }
                                        )}
                                        disabled={item.status === "done"}
                                        variant={
                                            item.status === "disabled"
                                                ? "secondary"
                                                : "blue"
                                        }
                                    >
                                        {item.status === "done" && (
                                            <Check className="stroke-5 stroke-white text-white !h-10 !w-10" />
                                        )}

                                        {item.status === "in-progress" && (
                                            <Continue className="!w-10 !h-10 scale-y-115  text-white" />
                                        )}
                                        {item.status === "disabled" && (
                                            <Star className="!w-10 !h-10  text-neutral-300" />
                                        )}
                                    </Button>
                                    <p
                                        className={cn(
                                            "font-extrabold text-neutral-500 text-lg  absolute left-1/2 -translate-x-1/2 -bottom-10  ",
                                            {
                                                "-bottom-12":
                                                    item.status ===
                                                    "in-progress",
                                            }
                                        )}
                                    >
                                        {item.name}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
