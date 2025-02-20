import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/ui-utils"
import { PossibleQuestionTypes } from "@/schemas/questions-content"
import { ReactNode, useState } from "react"
import useUpdateQuizStore from "../store"

type Props = {
    children?: ReactNode
    contentClassName?: string
    className?: string
    selectedType: PossibleQuestionTypes
    layout: "vertical" | "horizontal"
    questionLocalId: string
}
export default function LayoutSelect(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const updateQuestion = useUpdateQuizStore((s) => s.updateQuestion)

    return (
        <Command className="bg-transparent">
            <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                    <div className="flex items-center">
                        <p className="text-center text-lg font-bold">
                            Layout :
                        </p>
                        {props.layout === "vertical" &&
                            props.selectedType === "MULTIPLE_CHOICE" && (
                                <MultipleChoiceVertical />
                            )}
                        {props.layout === "horizontal" &&
                            props.selectedType === "MULTIPLE_CHOICE" && (
                                <MultipleChoiceHorizontal />
                            )}
                        {props.selectedType === "MATCHING_PAIRS" && (
                            <MatchingPairs />
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className={cn(
                        "!w-[210px] translate-x-10 rounded-xl overflow-hidden border  p-0",
                        props.contentClassName
                    )}
                    align="center"
                >
                    <CommandList className="p-0">
                        <CommandGroup className="p-0">
                            <CommandItem
                                onSelect={() => {
                                    setIsOpen(false)
                                    updateQuestion(
                                        {
                                            layout: "horizontal",
                                            type: "MULTIPLE_CHOICE",
                                        },
                                        props.questionLocalId
                                    )
                                }}
                            >
                                <MultipleChoiceHorizontal />
                            </CommandItem>
                            <CommandItem
                                onSelect={() => {
                                    setIsOpen(false)
                                    updateQuestion(
                                        {
                                            layout: "vertical",
                                            type: "MULTIPLE_CHOICE",
                                        },
                                        props.questionLocalId
                                    )
                                }}
                            >
                                <MultipleChoiceVertical />
                            </CommandItem>

                            <CommandItem
                                onSelect={() => {
                                    setIsOpen(false)
                                    updateQuestion(
                                        {
                                            layout: "vertical",
                                            type: "MATCHING_PAIRS",
                                        },
                                        props.questionLocalId
                                    )
                                }}
                            >
                                <MatchingPairs />
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </PopoverContent>
            </Popover>
        </Command>
    )
}

function MultipleChoiceVertical(props: { className?: string }) {
    return (
        <div
            className={cn(
                "flex hover:cursor-pointer active:scale-[93%] hover:scale-[98%]  scale-95 transition-all items-center",
                props.className
            )}
        >
            <div className="border  ml-4 p-2 w-40 rounded-xl">
                <div className="bg-neutral-200 h-12 rounded-md w-full"> </div>
                <div className="grid mt-2 grid-cols-2  gap-y-[6px] gap-x-2">
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                </div>
            </div>
        </div>
    )
}
function MultipleChoiceHorizontal(props: { className?: string }) {
    return (
        <div
            className={cn(
                "flex hover:cursor-pointer active:scale-[93%] hover:scale-[98%]  scale-95 transition-all items-center",
                props.className
            )}
        >
            <div className="border  ml-4 p-2 w-40 flex rounded-xl">
                <div className="bg-neutral-200 h-22 rounded-md w-full"> </div>
                <div className=" ml-5 w-20 flex flex-col gap-2">
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-full"></div>
                </div>
            </div>
        </div>
    )
}
function MatchingPairs(props: { className?: string }) {
    return (
        <div
            className={cn(
                "flex hover:cursor-pointer active:scale-[93%] hover:scale-[98%]  scale-95 transition-all items-center",
                props.className
            )}
        >
            <div className="border  ml-4 p-2 w-40 rounded-xl">
                <div className="flex gap-4">
                    {" "}
                    <div className="bg-white h-4 rounded-md w-1/3"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-2/3"></div>
                </div>
                <div className="flex gap-4 mt-2">
                    {" "}
                    <div className="bg-neutral-200 h-4 rounded-md w-1/3"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-2/3"></div>
                </div>
                <div className="flex gap-4 mt-2">
                    {" "}
                    <div className="bg-neutral-200 h-4 rounded-md w-1/3"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-2/3"></div>
                </div>
                <div className="flex gap-4 mt-2">
                    {" "}
                    <div className="bg-neutral-200 h-4 rounded-md w-1/3"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-2/3"></div>
                </div>
                <div className="flex gap-4 mt-2">
                    {" "}
                    <div className="bg-white h-4 rounded-md w-1/3"></div>
                    <div className="bg-neutral-200 h-4 rounded-md w-2/3"></div>
                </div>
            </div>
        </div>
    )
}
