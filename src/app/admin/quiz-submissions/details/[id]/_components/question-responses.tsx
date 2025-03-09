import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    FillInTheBlankContent,
    MatchingPairsContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import { Eye } from "lucide-react"
import { useState } from "react"
import FillInTheBlankResponses from "./fill-in-the-blank-responses"
import MatchingPairsResponses from "./matching-pairs-responses"
import MultipleChoiceResponses from "./multiple-choice-responses"

type Props = {
    question: string
    questionType: PossibleQuestionTypes
    responses:
        | string[]
        | string[][]
        | {
              wrong: { index: number; option: string | null }[]
              correct: { index: number; option: string | null }[]
          }
    correctAnswers: string[] | string[][]
    questionImage?: string
    questionContent:
        | MatchingPairsContent
        | MultipleChoiceContent
        | FillInTheBlankContent
        | null
}

const QuestionResponses = ({
    question,
    questionType,
    responses,
    correctAnswers,
    questionImage,
    questionContent,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant={"outline"}
                className="rounded-xl px-4 border-blue-300/80 bg-blue-50/80  text-blue-500 hover:text-blue-500 text-sm"
                onClick={() => setIsOpen(true)}
            >
                Details <Eye className="!w-5 !h-5 " />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <div className="px-2">
                        <DialogTitle className="text-2xl font-semibold text-neutral-800 mb-6"></DialogTitle>
                        <DialogDescription className="mt-4">
                            {" "}
                        </DialogDescription>
                        <div className="space-y-8">
                            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                                <p className="text-xl text-neutral-800 font-extrabold">
                                    {question}
                                </p>
                            </div>
                            {!!questionImage && (
                                <div className="h-[250px] overflow-hidden  rounded-xl relative mx-auto border w-[450px]">
                                    <img
                                        alt=""
                                        src={questionImage}
                                        className="absolute top-0 left-0  w-full h-full object-cover object-center"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-sm font-extrabold uppercase tracking-wider  text-neutral-500 mb-2">
                                    User Answers
                                </h3>
                                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                                    {questionType === "MULTIPLE_CHOICE" && (
                                        <MultipleChoiceResponses
                                            correctAnswers={correctAnswers}
                                            responses={responses as any}
                                        />
                                    )}
                                    {questionType === "MATCHING_PAIRS" && (
                                        <MatchingPairsResponses
                                            correctAnswers={correctAnswers}
                                            responses={responses as any}
                                        />
                                    )}
                                    {questionType === "FILL_IN_THE_BLANK" && (
                                        <FillInTheBlankResponses
                                            content={questionContent as any}
                                            correctAnswers={correctAnswers}
                                            responses={responses as any}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default QuestionResponses
