"use client"
import YellowStar from "@/components/icons/yellow-star"
import BackButton from "@/components/shared/back-button"
import ProgressBar from "@/components/shared/quizzes/progress-bar"
import AnimatedLoader from "@/components/ui/animated-loader"
import { readQuizWithQuestionsById } from "@/data-access/quizzes/read"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { useAtom, useSetAtom } from "jotai"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import Questions from "./_components/questions"
import Result from "./_components/result"
import {
    currentQuestionIndexAtom,
    failedQuestionsIdsAtom,
    questionsAtom,
} from "./atoms"
import { ErrorDisplay } from "@/components/shared/error-display"

export default function Page() {
    const params = useParams()
    const id = Number(params.id)

    const { data, isLoading } = useQuery({
        queryFn: () => readQuizWithQuestionsById(id),
        queryKey: ["quizzes", "quizzes_questions", id],
    })

    const [currentStep, setCurrentStep] = useAtom(currentQuestionIndexAtom)
    const [questions, setQuestions] = useAtom(questionsAtom)
    const setWrongAnswersIdsAtom = useSetAtom(failedQuestionsIdsAtom)
    const percentage = (currentStep * 100) / questions.length + 5
    const isFinished = currentStep >= questions.length
    const isEmpty = questions.length === 0
    useEffect(() => {
        setWrongAnswersIdsAtom([])
        setCurrentStep(0)
        setQuestions(data?.quizzes_questions || [])
    }, [data, setCurrentStep, setQuestions, setWrongAnswersIdsAtom])

    if (isEmpty && !isLoading) {
        return <ErrorDisplay />
    }

    return (
        <>
            {!isFinished && (
                <header className="w-full fixed top-0 z-50  flex items-center border-b h-24 px-20  bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60">
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
                {isLoading && (
                    <div className=" h-[100vh] flex items-center justify-center">
                        <AnimatedLoader />
                    </div>
                )}
                {isFinished && !isLoading ? <Result /> : <Questions />}
            </main>
        </>
    )
}
