import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useAtom } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useState } from "react"
import {
    currentQuestionIndexAtom,
    failedQuestionsIdsAtom,
    QuestionType,
} from "../atoms"
import CorrectAnswerBanner from "./correct-answer-banner"
import WrongAnswerBanner from "./wrong-answer-banner"
import { SingleChoiceContent } from "../schemas"

type Props = {
    question: { content: SingleChoiceContent } & QuestionType
}
export default function SingleAnswerQuestion(props: Props) {
    const [, setFailedQuestionsAnswers] = useAtom(failedQuestionsIdsAtom)
    const [questionIndex, setQuestionIndex] = useAtom(currentQuestionIndexAtom)
    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const questionAnimations = {
        initial: { opacity: 0, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    }

    return (
        <>
            <div className="flex  flex-col  relative h-fit items-center justify-center">
                <div>
                    <p className="w-[100vw] max-w-[1000px] mb-1 flex text-3xl font-extrabold top-0 text-neutral-700 text-left  left-0">
                        {props?.question.question} :
                    </p>
                    <div className="relative w-full flex-col flex">
                        <div>
                            {!!props.question.image && (
                                <img
                                    className=" h-[330px] mx-auto !w-[800px] object-cover"
                                    src={props.question.image}
                                    alt=""
                                />
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={questionIndex}
                                variants={questionAnimations}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="max-w-[1000px] mx-auto mt-10 gap-5 w-full grid grid-cols-2"
                            >
                                {props.question.content.options.map(
                                    (opt, i) => {
                                        const isCorrect =
                                            opt ===
                                            props.question.content.correct
                                        return (
                                            <Button
                                                key={i}
                                                onClick={() => {
                                                    console.log(
                                                        opt,
                                                        props.question.content
                                                    )

                                                    if (isCorrect) {
                                                        setIsCorrectBannerOpen(
                                                            true
                                                        )
                                                    } else {
                                                        setIsWrongBannerOpen(
                                                            true
                                                        )
                                                    }
                                                }}
                                                className={cn(
                                                    "min-h-[85px] text-lg hover:bg-sky-100 hover:shadow-sky-300/50  hover:border-sky-300/45 text-neutral-700 font-bold max-h-24",
                                                    {
                                                        "hover:bg-red-200/50 bg-red-200/50 text-red-500 font-extrabold  hover:shadow-red-300 shadow-red-300 hover:border-red-300 border-red-300":
                                                            !isCorrect &&
                                                            (isCorrectBannerOpen ||
                                                                isWrongBannerOpen),
                                                    },
                                                    {
                                                        "hover:bg-[#D2FFCC] bg-[#D2FFCC] text-[#58A700] font-extrabold  hover:shadow-[#58CC02]/50 shadow-[#58CC02]/50 hover:border-[#58CC02]/40 border-[#58CC02]/40":
                                                            isCorrect &&
                                                            (isCorrectBannerOpen ||
                                                                isWrongBannerOpen),
                                                    }
                                                )}
                                                variant={"secondary"}
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
                onNextClick={() => {
                    setSelectedOption(null)
                    setQuestionIndex((prev) => prev + 1)
                    setIsCorrectBannerOpen(false)
                }}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={() => {
                    // setFailedQuestionsAnswers((prev) => [
                    //     ...prev,
                    //     ,
                    // ])
                    setSelectedOption(null)
                    setQuestionIndex((prev) => prev + 1)
                    setIsWrongBannerOpen(false)
                }}
                isOpen={isWrongBannerOpen}
            />
        </>
    )
}
