import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import { areArraysEqual } from "@/utils/array"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { QuestionType, useQuestionsStore } from "../store"
import CorrectAnswerBanner from "./correct-answer-banner"
import WrongAnswerBanner from "./wrong-answer-banner"

type Props = {
    question: { content: MultipleChoiceContent } & QuestionType
}

export default function MultipleAnswerQuestion(props: Props) {
    const questionIndex = useQuestionsStore((s) => s.currentQuestionIndex)
    const incrementQuestionIndex = useQuestionsStore(
        (s) => s.incrementQuestionIndex
    )

    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])

    const correctAnswers = props.question.content.correct
    const correctAnswersLength = correctAnswers.length

    const handleOptionClick = (opt: string, isSelected: boolean) => {
        if (
            !isSelected &&
            correctAnswersLength - 1 === selectedOptions.length
        ) {
            const newSelectedOptions = [...selectedOptions, opt]
            setSelectedOptions(newSelectedOptions)

            if (areArraysEqual(correctAnswers, newSelectedOptions)) {
                setIsCorrectBannerOpen(true)
            } else {
                setIsWrongBannerOpen(true)
            }
            return
        }

        setSelectedOptions((prev) =>
            isSelected
                ? prev.filter((selected) => selected !== opt)
                : [...prev, opt]
        )
    }

    const handleNextQuestion = (isBannerCorrect: boolean) => {
        setSelectedOptions([])
        incrementQuestionIndex()
        if (isBannerCorrect) {
            setIsCorrectBannerOpen(false)
        } else {
            setIsWrongBannerOpen(false)
        }
    }

    return (
        <>
            <div
                className={cn(
                    "flex flex-col relative h-fit items-center justify-center"
                )}
            >
                <div
                    className={cn("", {
                        "flex flex-col w-full  items-center justify-center":
                            props.question.layout == "horizontal",
                    })}
                >
                    <p
                        className={cn(
                            "w-[100vw] max-w-[1000px] mt-1 mb-1 flex text-3xl font-extrabold top-0 text-neutral-700 text-left left-0",
                            {
                                "max-w-[1250px] mt-5":
                                    props.question.layout === "horizontal",
                            }
                        )}
                    >
                        {props?.question.question} :
                    </p>
                    <div
                        className={cn(
                            "relative w-full mt-6 flex-col flex",

                            {
                                " flex-row mt-6 max-w-[1300px]":
                                    props.question.layout === "horizontal",
                            }
                        )}
                    >
                        {!!props.question.image && (
                            <img
                                className={cn(
                                    "h-[330px]  mx-auto w-[800px]! object-cover",
                                    {
                                        "max-w-[600px] rounded-xl mr-10 h-[500px] ":
                                            props.question.layout ===
                                            "horizontal",
                                    }
                                )}
                                src={props.question.image}
                                alt=""
                            />
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={questionIndex}
                                variants={questionAnimations}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className={cn(
                                    "max-w-[1000px] mx-auto mt-10 gap-5 w-full grid grid-cols-2",
                                    {
                                        "flex max-w-[600px] mr-0 flex-col ml-auto":
                                            props.question.layout ===
                                            "horizontal",
                                    }
                                )}
                            >
                                {props.question.content.options.map(
                                    (opt, i) => {
                                        const isCorrect =
                                            props.question.content.correct.includes(
                                                opt
                                            )
                                        const isSelected =
                                            selectedOptions.includes(opt)
                                        return (
                                            <Button
                                                key={i}
                                                onClick={() =>
                                                    handleOptionClick(
                                                        opt,
                                                        isSelected
                                                    )
                                                }
                                                className={cn(
                                                    "min-h-[85px] text-lg hover:bg-sky-100 hover:shadow-sky-300/50 hover:border-sky-300/45 text-neutral-700 font-bold max-h-24",
                                                    {
                                                        "hover:bg-red-200/50 bg-red-200/50 text-red-500 font-extrabold hover:shadow-red-300 shadow-red-300 hover:border-red-300 border-red-300":
                                                            !isCorrect! &&
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
                                                {opt}
                                            </Button>
                                        )
                                    }
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <CorrectAnswerBanner
                onNextClick={() => handleNextQuestion(true)}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={() => handleNextQuestion(false)}
                isOpen={isWrongBannerOpen}
            />
        </>
    )
}

const questionAnimations = {
    initial: { opacity: 0, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
}
