import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"
import { PossibleQuestionTypes } from "@/schemas/questions-content"
import { ReactNode, useState } from "react"
import useQuizStore from "../store"
import { Database } from "@/types/database.types"
import MatchingPairs from "./layouts-icons/matching-pairs"
import MultipleChoiceHorizontal from "./layouts-icons/multiple-choice-horizontal"
import MultipleChoiceVertical from "./layouts-icons/multiple-choice-vertical"
import FillInTheBlank from "./layouts-icons/fill-in-the-blank"

type Props = {
    children?: ReactNode
    contentClassName?: string
    className?: string
    selectedType: PossibleQuestionTypes
    layout: "vertical" | "horizontal"
    questionLocalId: string
    imageType: Database["public"]["Tables"]["quizzes_questions"]["Insert"]["image_type"]
}
export default function LayoutSelect(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const updateQuestion = useQuizStore((s) => s.updateQuestion)

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center">
                    <p className="text-center text-lg font-bold">Layout :</p>
                    {props.layout === "vertical" &&
                        props.imageType !== "none" &&
                        props.selectedType === "MULTIPLE_CHOICE" && (
                            <MultipleChoiceVertical textClassName="hidden" />
                        )}
                    {props.imageType === "none" &&
                        props.selectedType === "MULTIPLE_CHOICE" && (
                            <MultipleChoiceVertical
                                textClassName="mt-3 h-2 w-[80%]"
                                imageClassName="hidden"
                                itemClassName="h-5 rounded  mt-2 "
                                className="px-2 w-[220px] pb-5"
                            />
                        )}
                    {props.layout === "horizontal" &&
                        props.imageType !== "none" &&
                        props.selectedType === "MULTIPLE_CHOICE" && (
                            <MultipleChoiceHorizontal />
                        )}
                    {props.selectedType === "MATCHING_PAIRS" && (
                        <MatchingPairs />
                    )}
                    {props.selectedType === "FILL_IN_THE_BLANK" && (
                        <FillInTheBlank
                            questionTextClassName="mb-5 h-1"
                            className=""
                            isMinimized
                        />
                    )}
                </div>
            </DialogTrigger>
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
                                    updateQuestion(
                                        {
                                            imageType: "normal-image",
                                            layout: "horizontal",
                                            type: "MULTIPLE_CHOICE",
                                            content: {
                                                options: [],
                                            },
                                        },
                                        props.questionLocalId
                                    )
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
                                updateQuestion(
                                    {
                                        imageType: "normal-image",
                                        layout: "vertical",
                                        type: "MULTIPLE_CHOICE",
                                        content: {
                                            options: [],
                                        },
                                    },
                                    props.questionLocalId
                                )
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
                                updateQuestion(
                                    {
                                        layout: "vertical",
                                        type: "MATCHING_PAIRS",
                                        content: {
                                            leftOptions: [],
                                            rightOptions: [],
                                        },
                                    },
                                    props.questionLocalId
                                )
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
                                updateQuestion(
                                    {
                                        imageType: "none",
                                        layout: "vertical",
                                        type: "MULTIPLE_CHOICE",
                                        content: {
                                            options: [],
                                        },
                                    },
                                    props.questionLocalId
                                )
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
                                updateQuestion(
                                    {
                                        imageType: "none",
                                        layout: "vertical",
                                        type: "FILL_IN_THE_BLANK",
                                        content: {
                                            correct: [],
                                            options: [],
                                            parts: [],
                                        },
                                    },
                                    props.questionLocalId
                                )
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
