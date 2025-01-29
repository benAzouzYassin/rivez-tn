"use client"
import YellowStar from "@/components/icons/yellow-star"
import BackButton from "@/components/shared/back-button"
import ProgressBar from "@/components/shared/quizzes/progress-bar"
import { cn } from "@/lib/ui-utils"
import { useAtom, useSetAtom } from "jotai"
import { useParams } from "next/navigation"
import Question from "./_components/question"
import Result from "./_components/result"
import { currentStepAtom, questionsAtom, wrongAnswersIdsAtom } from "./atoms"
import { useQuery } from "@tanstack/react-query"
import { readQuizWithQuestionsById } from "@/data-access/quizzes/read"
import { useEffect } from "react"
import AnimatedLoader from "@/components/ui/animated-loader"

export default function Page() {
    const params = useParams()
    const id = Number(params.id)

    const { data, isLoading } = useQuery({
        queryFn: () => readQuizWithQuestionsById(id),
        queryKey: ["quizzes", "quizzes_questions", id],
    })

    const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
    const [questions, setQuestions] = useAtom(questionsAtom)
    const setWrongAnswersIdsAtom = useSetAtom(wrongAnswersIdsAtom)
    const percentage = (currentStep * 100) / questions.length + 5
    const isFinished = currentStep >= questions.length
    const isEmpty = questions.length === 0
    useEffect(() => {
        setWrongAnswersIdsAtom([])
        setCurrentStep(0)
        setQuestions(data?.quizzes_questions || [])
    }, [data, setCurrentStep, setQuestions, setWrongAnswersIdsAtom])

    if (isEmpty && !isLoading) {
        return <div>error...</div>
    }

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
                {isLoading && (
                    <div className=" h-[100vh] flex items-center justify-center">
                        <AnimatedLoader />
                    </div>
                )}
                {isFinished && !isLoading ? <Result /> : <Question />}
            </main>
        </>
    )
}
