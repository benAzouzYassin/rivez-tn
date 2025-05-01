import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { MatchingPairsContent } from "@/schemas/questions-content"
import { areArraysEqual } from "@/utils/array"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { QuestionType, useQuestionsStore } from "../store"
import ConfirmationBanner from "./confirmation-banner"
import CorrectAnswerBanner from "./correct-answer-banner"
import MatchingPairsLeft from "./matching-pairs-left"
import MatchingPairsRight from "./matching-pairs-right"
import WrongAnswerBanner from "./wrong-answer-banner"
import HintsSheet from "./hints-sheet"
import { containsArabic } from "@/utils/is-arabic"

type Props = {
    question: { content: MatchingPairsContent } & QuestionType
    questionsCount: number
}

export default function MatchingPairsQuestion(props: Props) {
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
    const incorrectAttempts = useRef(0)
    const params = useParams()
    const quizId = params["id"] as string
    const currentQuestionIndex = useQuestionsStore(
        (s) => s.currentQuestionIndex
    )
    const incrementQuestionIndex = useQuestionsStore(
        (s) => s.incrementQuestionIndex
    )
    const handleFailedQuestions = useQuestionsStore(
        (s) => s.addFailedQuestionIds
    )
    const handleSkippedQuestions = useQuestionsStore(
        (s) => s.addSkippedQuestionIds
    )
    const handleQuizFinish = useQuestionsStore((s) => s.handleQuizFinish)
    const addAnswerToState = useQuestionsStore((s) => s.addAnswer)

    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)

    const [leftSelectedOption, setLeftSelectedOption] = useState<string | null>(
        null
    )
    const [rightSelectedOption, setRightSelectedOption] = useState<
        string | null
    >(null)

    const [correctSelections, setCorrectSelections] = useState<string[][]>([])
    const [incorrectSelections, setIncorrectSelections] = useState<string[][]>(
        []
    )
    const questionAnimations = {
        initial: { opacity: 0, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    }

    const rightSection = props.question.content.rightSideOptions
    const leftSection = props.question.content.leftSideOptions

    const isCorrectPair = (pair: string[]) => {
        const isCorrect = props.question.content.correct.some((correctPair) =>
            areArraysEqual(correctPair, pair)
        )
        return isCorrect
    }

    const handleInCorrectSelection = (pair: string[]) => {
        // max attempts is 3
        if (incorrectAttempts.current >= 2) {
            setIsWrongBannerOpen(true)
            setIncorrectSelections((prev) => [...prev, pair])
            return
        }

        incorrectAttempts.current = incorrectAttempts.current + 1
        setIncorrectSelections((prev) => [...prev, pair])
    }

    const handleCorrectSelection = (pair: string[]) => {
        const updated = [...correctSelections, pair]
        setCorrectSelections(updated)
        const isFinished =
            updated.length >= props.question.content.correct.length
        if (isFinished) {
            setIsCorrectBannerOpen(true)
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex === props.questionsCount - 1) {
            if (user.data?.id) {
                handleQuizFinish({ quizId, userId: user.data.id }).then(
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

        setRightSelectedOption(null)
        setLeftSelectedOption(null)
        incorrectAttempts.current = 0
        incrementQuestionIndex()
        setIsCorrectBannerOpen(false)
        setCorrectSelections([])
        setIncorrectSelections([])
    }

    const handleWrongAnswer = () => {
        handleFailedQuestions([props.question.id])

        addAnswerToState({
            questionId: props.question.id,
            questionType: "MATCHING_PAIRS",
            responses: [...incorrectSelections, ...correctSelections],
            failedAttempts: incorrectAttempts.current || null,
            secondsSpent: (new Date().getTime() - renderDate.getTime()) / 1000,
        })
        if (currentQuestionIndex === props.questionsCount - 1) {
            if (user.data?.id) {
                handleQuizFinish({ quizId, userId: user.data.id }).then(
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

        setRightSelectedOption(null)
        setLeftSelectedOption(null)
        incrementQuestionIndex()
        setIsWrongBannerOpen(false)
        incorrectAttempts.current = 0
        setCorrectSelections([])
        setIncorrectSelections([])
    }

    const isRtl = containsArabic(props.question.question)
    return (
        <>
            <div
                dir={isRtl ? "rtl" : "ltr"}
                className={`
                    flex flex-col relative h-fit items-center justify-center pb-56 md:pb-0
                    bg-white transition-colors
                    dark:bg-neutral-900
                `}
            >
                <HintsSheet
                    questionContent={JSON.stringify(props.question.content)}
                    questionText={props.question.question}
                    questionId={props.question.id}
                />
                <div>
                    <p
                        className={`
                        max-w-[1200px] md:mx-auto mb-1 text-2xl md:text-3xl md:px-0 pl-3 pr-1 font-extrabold top-0 text-neutral-700 text-left w-full left-0
                        dark:text-neutral-100
                    `}
                    >
                        {props.question?.question || "Match the items :"}
                    </p>
                    <p
                        className={`
                        text-base pl-3 md:hidden mt-2 underline underline-offset-4 text-neutral-500 mb-4 border-neutral-200 flex items-center gap-2 font-semibold
                        dark:text-neutral-400 dark:border-neutral-700
                    `}
                    >
                        <span>
                            Each item from{" "}
                            <span className="text-blue-600 dark:text-blue-400">
                                Group A
                            </span>{" "}
                            have a corresponding from{" "}
                            <span className="text-purple-600 dark:text-purple-400">
                                Group B
                            </span>
                            .
                        </span>
                    </p>
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                variants={questionAnimations}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className={`
                                    max-w-[1200px] md:min-w-[700px] justify-center items-center md:mt-20 md:px-0 px-3 gap-10 w-full md:flex
                                `}
                            >
                                <p className="md:hidden mt-2 py-5 text-2xl font-bold text-neutral-600 text-center dark:text-neutral-300">
                                    Group A :{" "}
                                </p>
                                <MatchingPairsLeft
                                    readonly={
                                        isWrongBannerOpen || isCorrectBannerOpen
                                    }
                                    correctSelections={correctSelections.flat()}
                                    inCorrectSelections={incorrectSelections}
                                    wrongOptions={[]}
                                    selectedOption={leftSelectedOption}
                                    onOptionClick={(opt) => {
                                        // unselect the option if it is already selected
                                        if (leftSelectedOption === opt) {
                                            setLeftSelectedOption(null)
                                        } else {
                                            setLeftSelectedOption(opt)
                                        }

                                        if (rightSelectedOption) {
                                            const isCorrect = isCorrectPair([
                                                opt,
                                                rightSelectedOption,
                                            ])
                                            if (isCorrect) {
                                                handleCorrectSelection([
                                                    opt,
                                                    rightSelectedOption,
                                                ])
                                                setLeftSelectedOption(null)
                                                setRightSelectedOption(null)
                                            } else {
                                                handleInCorrectSelection([
                                                    opt,
                                                    rightSelectedOption,
                                                ])
                                                setLeftSelectedOption(null)
                                                setRightSelectedOption(null)
                                            }
                                        }
                                    }}
                                    options={leftSection}
                                />
                                <p className="mt-10 md:hidden py-5 text-2xl font-bold text-neutral-600 text-center border-t-2 dark:text-neutral-300 dark:border-neutral-700">
                                    Group B :{" "}
                                </p>

                                <MatchingPairsRight
                                    readonly={
                                        isWrongBannerOpen || isCorrectBannerOpen
                                    }
                                    correctSelections={correctSelections.flat()}
                                    inCorrectSelections={incorrectSelections}
                                    selectedOption={rightSelectedOption}
                                    onOptionClick={(opt) => {
                                        // unselect the option if it is already selected
                                        if (rightSelectedOption === opt) {
                                            setRightSelectedOption(null)
                                        } else {
                                            setRightSelectedOption(opt)
                                        }

                                        if (leftSelectedOption) {
                                            const isCorrect = isCorrectPair([
                                                opt,
                                                leftSelectedOption,
                                            ])

                                            if (isCorrect) {
                                                handleCorrectSelection([
                                                    opt,
                                                    leftSelectedOption,
                                                ])
                                                setRightSelectedOption(null)
                                                setLeftSelectedOption(null)
                                            } else {
                                                handleInCorrectSelection([
                                                    opt,
                                                    leftSelectedOption,
                                                ])
                                                setRightSelectedOption(null)
                                                setLeftSelectedOption(null)
                                            }
                                        }
                                    }}
                                    options={rightSection}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <ConfirmationBanner
                onSkip={() => {
                    handleSkippedQuestions([props.question.id])
                    addAnswerToState({
                        questionId: props.question.id,
                        questionType: "MATCHING_PAIRS",
                        responses: [
                            ...incorrectSelections,
                            ...correctSelections,
                        ],
                        failedAttempts: incorrectAttempts.current || null,
                        secondsSpent:
                            (new Date().getTime() - renderDate.getTime()) /
                            1000,
                    })
                    handleNextQuestion()
                }}
                actionType={"skip"}
                onConfirm={() => {}}
                isOpen={true}
            />
            <CorrectAnswerBanner
                onNextClick={() => {
                    addAnswerToState({
                        questionId: props.question.id,
                        questionType: "MATCHING_PAIRS",
                        responses: [
                            ...incorrectSelections,
                            ...correctSelections,
                        ],
                        failedAttempts: incorrectAttempts.current || null,
                        secondsSpent:
                            (new Date().getTime() - renderDate.getTime()) /
                            1000,
                    })
                    handleNextQuestion()
                }}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={handleWrongAnswer}
                isOpen={isWrongBannerOpen}
            />
        </>
    )
}
