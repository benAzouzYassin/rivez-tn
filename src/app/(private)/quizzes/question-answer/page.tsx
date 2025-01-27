"use client"
import YellowStar from "@/components/icons/yellow-star"
import BackButton from "@/components/shared/back-button"
import ProgressBar from "@/components/shared/quizzes/progress-bar"
import { cn } from "@/lib/ui-utils"
import { useAtom } from "jotai"
import Question from "./_components/question"
import Result from "./_components/result"
import { currentStepAtom, questionsAtom } from "./atoms"

export default function Page() {
    const [currentStep] = useAtom(currentStepAtom)
    const [questions] = useAtom(questionsAtom)
    const percentage = (currentStep * 100) / questions.length + 5
    const isFinished = currentStep >= questions.length

    return (
        <>
            {!isFinished && (
                <header className="w-full fixed top-0 bg-white z-50  flex items-center border-b h-24 px-20  bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                    <BackButton className="ml-auto mr-2 opacity-50" />
                    <ProgressBar className="w-[65%]" percentage={percentage} />
                    <div className="mr-auto">
                        <YellowStar className="w-6 opacity-80 ml-2 -mt-2 h-6" />
                    </div>
                </header>
            )}
            <main
                className={cn("relative mt-32 min-h-[100vh]", {
                    "overflow-x-hidden mt-0": isFinished,
                })}
            >
                {isFinished ? <Result /> : <Question />}
            </main>
        </>
    )
}
