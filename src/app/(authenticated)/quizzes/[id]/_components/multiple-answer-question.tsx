import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import { areArraysEqual } from "@/utils/array"
import { useQueryClient } from "@tanstack/react-query"
import { ImageIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { QuestionType, useQuestionsStore } from "../store"
import CodeSnippets from "./code-snippets"
import ConfirmationBanner from "./confirmation-banner"
import CorrectAnswerBanner from "./correct-answer-banner"
import HintsSheet from "./hints-sheet"
import WrongAnswerBanner from "./wrong-answer-banner"

type Props = {
    question: { content: MultipleChoiceContent } & QuestionType
    questionsCount: number
}

export default function MultipleAnswerQuestion(props: Props) {
    const params = useParams()
    const quizId = params["id"] as string
    const [renderDate, setRenderDate] = useState(new Date())
    const queryClient = useQueryClient()

    useEffect(() => {
        setRenderDate(new Date())
        if (window !== undefined) {
            window.scroll({
                behavior: "smooth",
                top: 0,
            })
        }
    }, [props.question])
    const user = useCurrentUser()
    const questionIndex = useQuestionsStore((s) => s.currentQuestionIndex)
    const incrementQuestionIndex = useQuestionsStore(
        (s) => s.incrementQuestionIndex
    )
    const handleQuizFinish = useQuestionsStore((s) => s.handleQuizFinish)
    const handleSkippedQuestions = useQuestionsStore(
        (s) => s.addSkippedQuestionIds
    )
    const handleFailedQuestions = useQuestionsStore(
        (s) => s.addFailedQuestionIds
    )
    const addAnswerToState = useQuestionsStore((s) => s.addAnswer)

    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)

    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const correctAnswers = props.question.content.correct
    const imageType = props.question.image_type

    const handleOptionClick = (opt: string, isSelected: boolean) => {
        setSelectedOptions((prev) =>
            isSelected
                ? prev.filter((selected) => selected !== opt)
                : [...prev, opt]
        )
    }
    const handleNextQuestion = (isBannerCorrect: boolean) => {
        if (questionIndex === props.questionsCount - 1) {
            if (user.data?.id) {
                handleQuizFinish({ quizId, userId: user.data?.id }).then(
                    (success) => {
                        if (success) {
                            queryClient.invalidateQueries({
                                predicate: (query) =>
                                    query.queryKey.some(
                                        (key) => key === "quiz_submissions"
                                    ),
                            })
                        } else {
                            toastError("Something went wrong.")
                        }
                    }
                )
            } else {
                return toastError("Something went wrong.")
            }
        }
        setSelectedOptions([])
        incrementQuestionIndex()
        if (isBannerCorrect) {
            setIsCorrectBannerOpen(false)
        } else {
            setIsWrongBannerOpen(false)
        }
    }

    const handleConfirmation = () => {
        addAnswerToState({
            questionId: props.question.id,
            questionType: "MULTIPLE_CHOICE",
            responses: selectedOptions,
            failedAttempts: null,
            secondsSpent: (new Date().getTime() - renderDate.getTime()) / 1000,
        })
        if (areArraysEqual(correctAnswers, selectedOptions)) {
            setIsCorrectBannerOpen(true)
        } else {
            setSelectedOptions(props.question.content.options)
            setIsWrongBannerOpen(true)
        }
    }
    return (
        <>
            <div
                className={cn(
                    "flex flex-col relative h-fit items-center justify-center pb-44"
                )}
            >
                <HintsSheet
                    questionContent={JSON.stringify(props.question.content)}
                    questionText={props.question.question}
                    questionId={props.question.id}
                />
                <div
                    className={cn(" ", {
                        "flex flex-col w-full  items-center justify-center":
                            props.question.layout == "horizontal",
                    })}
                >
                    <p
                        className={cn(
                            " max-w-[1000px] text-center  items-center justify-center w-full mt-1  flex pt-0 pb-5 text-lg sm:text-3xl lg:text-4xl font-extrabold top-0 text-neutral-700 px-2  ",
                            {
                                "max-w-[1250px] mt-5":
                                    props.question.layout === "horizontal",
                            }
                        )}
                    >
                        {props?.question.question}
                    </p>
                    <div
                        className={cn(
                            "relative w-full md:mt-6 flex-col flex xl:px-0 px-4 ",

                            {
                                " xl:flex-row md:mt-6 max-w-[1300px]":
                                    props.question.layout === "horizontal",
                            }
                        )}
                    >
                        <div
                            className={cn(
                                "md:h-[400px] w-[80vw] rounded-xl mb-4 md:mb-0 xl:min-w-[700px] overflow-hidden  h-[250px] flex items-center justify-center relative  md:mx-auto  border bg-neutral-50 xl:w-[800px] ",
                                {
                                    "xl:w-[700px] w-full xl:mb-0  xl:mr-10  sm:max-w-[80vw]  h-[250px] xl:h-[500px] ":
                                        props.question.layout === "horizontal",
                                    hidden:
                                        props.question.image_type === "none",
                                }
                            )}
                        >
                            {imageType === "code-snippets" && (
                                <CodeSnippets
                                    snippets={
                                        props.question.content.codeSnippets
                                    }
                                />
                            )}
                            {imageType === "normal-image" && (
                                <>
                                    {" "}
                                    <ImageIcon className="w-32 text-neutral-300 h-32" />
                                    {!!props.question.image && (
                                        <img
                                            className={cn(
                                                "h-full mx-auto absolute top-0 left-0 w-full object-contain"
                                            )}
                                            src={props.question.image}
                                            alt=""
                                        />
                                    )}
                                </>
                            )}{" "}
                        </div>
                        <div
                            key={questionIndex}
                            className={cn(
                                "max-w-[1000px] xl:px-4 lg:px-0  mx-auto md:mt-10 mt-2 gap-5 w-full grid xl:grid-cols-2",
                                {
                                    "flex xl:w-[700px] w-full xl:mr-0 flex-col xl:ml-auto":
                                        props.question.layout === "horizontal",
                                    "min-w-[70vw] gap-6 md:gap-10":
                                        props.question.image_type === "none",
                                }
                            )}
                        >
                            {props.question.content.options.map((opt, i) => {
                                const isCorrect =
                                    props.question.content.correct.includes(opt)
                                const isSelected = selectedOptions.includes(opt)

                                return (
                                    <Button
                                        key={i}
                                        onClick={() =>
                                            handleOptionClick(opt, isSelected)
                                        }
                                        className={cn(
                                            "min-h-[85px]  text-lg overflow-auto small-scroll-bar hover:bg-sky-100 text-wrap hover:shadow-sky-300/50 hover:border-sky-300/45 text-neutral-700 font-bold max-h-48",
                                            {
                                                "hover:bg-red-200/50 bg-red-200/50 text-red-500 font-extrabold hover:shadow-red-300 shadow-red-300 hover:border-red-300 border-red-300":
                                                    !isCorrect &&
                                                    (isWrongBannerOpen ||
                                                        isCorrectBannerOpen) &&
                                                    isSelected,
                                                "hover:bg-[#D2FFCC] bg-[#D2FFCC] text-[#58A700] font-extrabold hover:shadow-[#58CC02]/50 shadow-[#58CC02]/50 hover:border-[#58CC02]/40 border-[#58CC02]/40":
                                                    isCorrect &&
                                                    (isWrongBannerOpen ||
                                                        isCorrectBannerOpen) &&
                                                    isSelected,
                                                "hover:bg-sky-200/50 bg-sky-200/50 text-sky-500 font-extrabold hover:shadow-sky-300 shadow-sky-300 hover:border-sky-300 border-sky-300":
                                                    isSelected &&
                                                    !isWrongBannerOpen &&
                                                    !isCorrectBannerOpen,
                                            }
                                        )}
                                        variant="secondary"
                                    >
                                        <p className="max-w-[80%] md:text-base text-sm text-wrap h-fit ">
                                            {" "}
                                            {opt}
                                        </p>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <CorrectAnswerBanner
                onNextClick={() => {
                    handleNextQuestion(true)
                }}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={() => {
                    handleFailedQuestions([props.question.id])
                    handleNextQuestion(false)
                }}
                isOpen={isWrongBannerOpen}
            />
            <ConfirmationBanner
                actionType={selectedOptions.length ? "confirm" : "skip"}
                onSkip={() => {
                    handleSkippedQuestions([props.question.id])
                    addAnswerToState({
                        questionId: props.question.id,
                        questionType: "MULTIPLE_CHOICE",
                        responses: selectedOptions,
                        failedAttempts: null,
                        secondsSpent:
                            (new Date().getTime() - renderDate.getTime()) /
                            1000,
                    })
                    handleNextQuestion(false)
                }}
                onConfirm={handleConfirmation}
                isOpen={!isWrongBannerOpen && !isCorrectBannerOpen}
            />
        </>
    )
}
