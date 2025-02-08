import { areArraysEqual } from "@/utils/array"
import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from "react"
import { useQuestionsStore, QuestionType } from "../store"
import ConfirmationBanner from "./confirmation-banner"
import CorrectAnswerBanner from "./correct-answer-banner"
import MatchingPairsLeft from "./matching-pairs-left"
import MatchingPairsRight from "./matching-pairs-right"
import WrongAnswerBanner from "./wrong-answer-banner"
import { MatchingPairsContent } from "@/schemas/questions-content"

type Props = {
    question: { content: MatchingPairsContent } & QuestionType
}

export default function MatchingPairsQuestion(props: Props) {
    const incorrectAttempts = useRef(0)

    const currentQuestionIndex = useQuestionsStore(
        (s) => s.currentQuestionIndex
    )
    const incrementQuestionIndex = useQuestionsStore(
        (s) => s.incrementQuestionIndex
    )
    const addFailedQuestionIds = useQuestionsStore(
        (s) => s.addFailedQuestionIds
    )

    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)
    const [isConfirmationBanner, setIsConfirmationBanner] = useState(true)

    const [leftSelectedOption, setLeftSelectedOption] = useState<string | null>(
        null
    )
    const [rightSelectedOption, setRightSelectedOption] = useState<
        string | null
    >(null)

    const [correctSelections, setCorrectSelections] = useState<string[]>([])
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
        if (incorrectAttempts.current >= 2) {
            setIsWrongBannerOpen(true)
            setIsConfirmationBanner(false)
            setIncorrectSelections((prev) => [...prev, pair])
            return
        }

        incorrectAttempts.current = incorrectAttempts.current + 1
        setIncorrectSelections((prev) => [...prev, pair])
    }

    const handleCorrectSelection = (pair: string[]) => {
        const updated = [...correctSelections, ...pair]
        setCorrectSelections(updated)
        const isFinished =
            updated.length >= props.question.content.correct.length * 2
        if (isFinished) {
            setIsCorrectBannerOpen(true)
            setIsConfirmationBanner(false)
        }
    }

    const handleNextQuestion = () => {
        setRightSelectedOption(null)
        setLeftSelectedOption(null)
        setCorrectSelections([])
        incorrectAttempts.current = 0
        incrementQuestionIndex()
        setIsConfirmationBanner(false)
    }

    const handleWrongAnswer = () => {
        addFailedQuestionIds([props.question.id])
        setRightSelectedOption(null)
        setLeftSelectedOption(null)
        incrementQuestionIndex()
        setIsWrongBannerOpen(false)
        incorrectAttempts.current = 0
        setCorrectSelections([])
    }

    return (
        <>
            <div className="flex flex-col relative h-fit items-center justify-center">
                <div>
                    <p className="max-w-[1200px] mb-1 text-3xl font-extrabold top-0 text-neutral-700 text-left w-full left-0">
                        {props.question?.question} :
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
                                className="max-w-[1200px] min-w-[700px] justify-center items-center mt-20 gap-10 w-full flex"
                            >
                                <MatchingPairsLeft
                                    readonly={
                                        isWrongBannerOpen || isCorrectBannerOpen
                                    }
                                    correctSelections={correctSelections}
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
                                <MatchingPairsRight
                                    readonly={
                                        isWrongBannerOpen || isCorrectBannerOpen
                                    }
                                    correctSelections={correctSelections}
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
                onNextClick={handleNextQuestion}
                isOpen={isConfirmationBanner}
            />
            <CorrectAnswerBanner
                onNextClick={handleNextQuestion}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={handleWrongAnswer}
                isOpen={isWrongBannerOpen}
            />
        </>
    )
}
