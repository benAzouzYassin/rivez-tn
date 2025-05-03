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
import { containsArabic } from "@/utils/is-arabic"

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
    const isRtl = containsArabic(question)

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <Button
                variant={"secondary"}
                className="px-3"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="!w-6 text-neutral-400 dark:text-neutral-500 !h-6" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent
                    dir={isRtl ? "rtl" : "ltr"}
                    className=" md:min-w-[800px]  bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                >
                    <div className="px-2 overflow-y-auto pb-6 md:pb-0">
                        <DialogTitle className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6"></DialogTitle>
                        <DialogDescription className="mt-4"></DialogDescription>
                        <div className="space-y-8">
                            <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <p className="text-xl text-neutral-800 dark:text-neutral-100 font-extrabold">
                                    {question}
                                </p>
                            </div>
                            {!!questionImage && (
                                <div className="h-[250px] overflow-hidden rounded-xl relative mx-auto border w-[450px] border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                        alt=""
                                        src={questionImage}
                                        className="absolute top-0 left-0 w-full h-full object-cover object-center"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                                    User Answers
                                </h3>
                                <div className="bg-neutral-50 overflow-x-auto dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
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
        </div>
    )
}

export default QuestionResponses
