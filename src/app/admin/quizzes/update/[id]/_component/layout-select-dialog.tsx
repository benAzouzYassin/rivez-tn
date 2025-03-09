import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"
import { PossibleQuestionTypes } from "@/schemas/questions-content"
import { Database } from "@/types/database.types"
import { ReactNode, useState } from "react"
import FillInTheBlank from "./layouts-icons/fill-in-the-blank"
import MatchingPairs from "./layouts-icons/matching-pairs"
import MultipleChoiceHorizontal from "./layouts-icons/multiple-choice-horizontal"
import MultipleChoiceVertical from "./layouts-icons/multiple-choice-vertical"

type Props = {
    contentClassName?: string
    trigger: ReactNode
    onSelect: (layoutType: LayoutOptions) => void
}

export default function LayoutSelectDialog(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent
                className={cn(
                    " rounded-xl pb-6 overflow-hidden border  max-w-[1000px] ",
                    props.contentClassName
                )}
            >
                <div className="p-4 bg-muted">
                    <DialogTitle className="text-center  pb-3 text-neutral-500 font-extrabold text-3xl">
                        Select a question layout
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </div>
                <div className="p-0">
                    <div className="p-0 grid gap-5 grid-cols-3">
                        <div className="fle flex-col items-center justify-center">
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                Image on left, options on right
                            </h3>
                            <div
                                onClick={() => {
                                    setIsOpen(false)
                                    props.onSelect("horizontal-multiple-choice")
                                }}
                                className="ml-auto mt-1 flex items-center justify-center"
                            >
                                <MultipleChoiceHorizontal
                                    imageClassName="h-[140px] w-[130px] ml-2 mt-6"
                                    itemClassName="h-7 mt-1 first:mt-5 w-[110px]"
                                    className="!w-[290px] h-[210px]"
                                />
                            </div>
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("vertical-multiple-choice")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                Image on the top, options on bottom
                            </h3>

                            <MultipleChoiceVertical
                                textClassName="hidden"
                                imageClassName="h-20 w-[90%] mx-auto mt-4"
                                itemClassName="h-7 mt-1 w-[85%] odd:ml-4 even:ml-1"
                                className="!w-[310px] h-[210px]"
                            />
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("matching-pairs")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                Terms on left, definitions on right
                            </h3>

                            <MatchingPairs
                                itemClassName="h-6 mt-1"
                                className="!w-[290px] pt-4 px-5 h-[210px]"
                            />
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("multiple-choice-without-image")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                Options without an image.
                            </h3>

                            <MultipleChoiceVertical
                                textClassName="mb-7 mt-8"
                                imageClassName="hidden"
                                itemClassName="h-8  mt-1 w-[85%] odd:ml-4 even:ml-1"
                                className="!w-[310px] h-[210px]"
                            />
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("fill-in-the-blank")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                Fill in the blank.
                            </h3>

                            <FillInTheBlank
                                isMinimized={false}
                                questionTextClassName="mb-7 mt-8"
                                className="!w-[310px] h-[210px]"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
type LayoutOptions =
    | "vertical-multiple-choice"
    | "horizontal-multiple-choice"
    | "matching-pairs"
    | "multiple-choice-without-image"
    | "fill-in-the-blank"
