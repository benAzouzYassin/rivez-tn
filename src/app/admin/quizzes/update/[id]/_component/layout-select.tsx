import { memo } from "react"
import useUpdateQuizStore, { QuizQuestionType } from "../store"
import LayoutSelectDialog from "./layout-select-dialog"
import FillInTheBlank from "./layouts-icons/fill-in-the-blank"
import MatchingPairs from "./layouts-icons/matching-pairs"
import MultipleChoiceHorizontal from "./layouts-icons/multiple-choice-horizontal"
import MultipleChoiceVertical from "./layouts-icons/multiple-choice-vertical"

interface Props {
    selectedQuestion: QuizQuestionType
}
function LayoutSelect(props: Props) {
    const updateQuestion = useUpdateQuizStore((s) => s.updateQuestion)

    return (
        <LayoutSelectDialog
            onSelect={(layoutType) => {
                switch (layoutType) {
                    case "fill-in-the-blank":
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
                            props.selectedQuestion.localId
                        )
                        break
                    case "multiple-choice-without-image":
                        updateQuestion(
                            {
                                imageType: "none",
                                layout: "vertical",
                                type: "MULTIPLE_CHOICE",
                                content: {
                                    options: [],
                                },
                            },
                            props.selectedQuestion.localId
                        )
                        break
                    case "matching-pairs":
                        updateQuestion(
                            {
                                layout: "vertical",
                                type: "MATCHING_PAIRS",
                                content: {
                                    leftOptions: [],
                                    rightOptions: [],
                                },
                            },
                            props.selectedQuestion.localId
                        )
                        break
                    case "matching-pairs":
                        updateQuestion(
                            {
                                layout: "vertical",
                                type: "MATCHING_PAIRS",
                                content: {
                                    leftOptions: [],
                                    rightOptions: [],
                                },
                            },
                            props.selectedQuestion.localId
                        )
                        break
                    case "vertical-multiple-choice":
                        updateQuestion(
                            {
                                imageType: "normal-image",
                                layout: "vertical",
                                type: "MULTIPLE_CHOICE",
                                content: {
                                    options: [],
                                },
                            },
                            props.selectedQuestion.localId
                        )
                        break
                    case "horizontal-multiple-choice":
                        updateQuestion(
                            {
                                imageType: "normal-image",
                                layout: "horizontal",
                                type: "MULTIPLE_CHOICE",
                                content: {
                                    options: [],
                                },
                            },
                            props.selectedQuestion.localId
                        )
                        break
                    default:
                        break
                }
            }}
            trigger={
                <div className="flex items-center">
                    <p className="text-center text-lg font-bold">Layout :</p>
                    {props.selectedQuestion.layout === "vertical" &&
                        props.selectedQuestion.imageType !== "none" &&
                        props.selectedQuestion.type === "MULTIPLE_CHOICE" && (
                            <MultipleChoiceVertical textClassName="hidden" />
                        )}
                    {props.selectedQuestion.imageType === "none" &&
                        props.selectedQuestion.type === "MULTIPLE_CHOICE" && (
                            <MultipleChoiceVertical
                                textClassName="mt-3 h-2 w-[80%]"
                                imageClassName="hidden"
                                itemClassName="h-5 rounded  mt-2 "
                                className="px-2 w-[220px] pb-5"
                            />
                        )}
                    {props.selectedQuestion.layout === "horizontal" &&
                        props.selectedQuestion.imageType !== "none" &&
                        props.selectedQuestion.type === "MULTIPLE_CHOICE" && (
                            <MultipleChoiceHorizontal />
                        )}
                    {props.selectedQuestion.type === "MATCHING_PAIRS" && (
                        <MatchingPairs />
                    )}
                    {props.selectedQuestion.type === "FILL_IN_THE_BLANK" && (
                        <FillInTheBlank
                            questionTextClassName="mb-5 h-1"
                            className=""
                            isMinimized
                        />
                    )}
                </div>
            }
        />
    )
}
export default memo(LayoutSelect)
