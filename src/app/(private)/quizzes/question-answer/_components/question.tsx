"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useAtom } from "jotai"
import { useState } from "react"
import { currentStepAtom, questionsAtom, wrongAnswersIdsAtom } from "../atoms"
import CorrectAnswerBanner from "./correct-answer-banner"
import WrongAnswerBanner from "./wrong-answer-banner"

export default function Question() {
    const [, setWrongAnswers] = useAtom(wrongAnswersIdsAtom)
    const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
    const [questions] = useAtom(questionsAtom)
    const currentQuestion = questions[currentStep]

    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string | null>("")

    return (
        <>
            <div className=" flex flex-col relative  h-fit items-center justify-center">
                <p className="max-w-[1000px]  mb-1 text-3xl font-extrabold top-0 text-neutral-700  text-left    w-full left-0">
                    {currentQuestion.question.questionText} :
                </p>
                <div className="relative w-fit">
                    <img
                        className="h-[310px] "
                        src="/placeholders/code.png"
                        alt=""
                    />
                </div>
            </div>
            <div className=" w-full">
                <div className="max-w-[1000px] mx-auto mt-10 gap-5 w-full grid grid-cols-2">
                    {currentQuestion.question.options.map((option) => (
                        <Button
                            onClick={() => {
                                if (selectedOption) {
                                    return
                                }
                                setSelectedOption(option.id)
                                if (option.isCorrect) {
                                    setIsCorrectBannerOpen(true)
                                } else {
                                    setIsWrongBannerOpen(true)
                                }
                            }}
                            key={option.id}
                            className={cn(
                                "min-h-20 text-lg hover:bg-sky-100 hover:shadow-sky-300/50 hover:border-sky-300/45 text-neutral-700 font-bold max-h-24",
                                {
                                    "hover:bg-red-200/50 bg-red-200/50 text-red-500 font-extrabold  hover:shadow-red-300 shadow-red-300 hover:border-red-300 border-red-300":
                                        isWrongBannerOpen &&
                                        selectedOption === option.id,
                                },
                                {
                                    "hover:bg-[#D2FFCC] bg-[#D2FFCC] text-[#58A700] font-extrabold  hover:shadow-[#58CC02]/50 shadow-[#58CC02]/50 hover:border-[#58CC02]/40 border-[#58CC02]/40":
                                        isCorrectBannerOpen &&
                                        selectedOption === option.id,
                                }
                            )}
                            variant={"secondary"}
                        >
                            {option.content}
                        </Button>
                    ))}
                </div>
                <CorrectAnswerBanner
                    onNextClick={() => {
                        setSelectedOption(null)
                        setCurrentStep((prev) => prev + 1)
                        setIsCorrectBannerOpen(false)
                    }}
                    isOpen={isCorrectBannerOpen}
                />
                <WrongAnswerBanner
                    onNextClick={() => {
                        setWrongAnswers((prev) => [...prev, currentQuestion.id])
                        setSelectedOption(null)
                        setCurrentStep((prev) => prev + 1)
                        setIsWrongBannerOpen(false)
                    }}
                    isOpen={isWrongBannerOpen}
                />
            </div>
        </>
    )
}
