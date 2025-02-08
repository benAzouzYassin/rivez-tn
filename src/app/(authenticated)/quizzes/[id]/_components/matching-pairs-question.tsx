import { areArraysEqual } from "@/utils/array"
import { useAtom } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from "react"
import {
    currentQuestionIndexAtom,
    failedQuestionsIdsAtom,
    QuestionType,
} from "../atoms"
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
    const [, setFailedQuestionsAnswers] = useAtom(failedQuestionsIdsAtom)
    const [questionIndex, setQuestionIndex] = useAtom(currentQuestionIndexAtom)
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
    return (
        <>
            <div className="flex flex-col relative h-fit items-center justify-center">
                <div>
                    <p className="max-w-[1200px] mb-1 text-3xl font-extrabold top-0 text-neutral-700 text-left w-full left-0">
                        {props.question?.question} :
                    </p>
                    <div className="relative ">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={questionIndex}
                                variants={questionAnimations}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="max-w-[1200px] min-w-[700px] justify-center  items-center   mt-20 gap-10 w-full flex"
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
                onNextClick={() => {
                    setRightSelectedOption(null)
                    setLeftSelectedOption(null)
                    setCorrectSelections([])
                    incorrectAttempts.current = 0
                    setQuestionIndex((prev) => prev + 1)
                    setIsConfirmationBanner(false)
                }}
                isOpen={isConfirmationBanner}
            />
            <CorrectAnswerBanner
                onNextClick={() => {
                    incorrectAttempts.current = 0
                    setCorrectSelections([])
                    setRightSelectedOption(null)
                    setLeftSelectedOption(null)
                    setQuestionIndex((prev) => prev + 1)
                    setIsCorrectBannerOpen(false)
                }}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={() => {
                    setFailedQuestionsAnswers((prev) => [
                        ...prev,
                        //TODO make use of this
                    ])
                    setRightSelectedOption(null)
                    setLeftSelectedOption(null)
                    setQuestionIndex((prev) => prev + 1)
                    setIsWrongBannerOpen(false)
                    incorrectAttempts.current = 0
                    setCorrectSelections([])
                }}
                isOpen={isWrongBannerOpen}
            />
        </>
    )
}
