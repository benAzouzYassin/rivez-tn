"use client"
import BackButton from "@/components/shared/back-button"
import { ErrorDisplay } from "@/components/shared/error-display"
import ProgressBar from "@/components/shared/progress-bar"
import AnimatedLoader from "@/components/ui/animated-loader"
import { readQuizWithQuestionsById } from "@/data-access/quizzes/read"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import Questions from "./_components/questions"
import Result from "./_components/result"
import ResultLoadingPage from "./_components/result-loading-page"
import { useQuestionsStore } from "./store"
import { attachSharedQuizToUser } from "@/data-access/quizzes/share"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function Page() {
    const { data: currentUser } = useCurrentUser()
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const id = Number(params.id)
    const [share] = useQueryState("share")
    const isSharing = share === "true"
    useEffect(() => {
        if (isSharing && currentUser?.id) {
            setIsLoading(true)
            attachSharedQuizToUser({ userId: currentUser.id, quizId: id })
                .catch((err) => {
                    console.error(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }
    }, [currentUser?.id, id, isSharing])

    const {
        data,
        isLoading: isLoadingQuestions,
        isError: isQuestionsError,
    } = useQuery({
        queryFn: () => readQuizWithQuestionsById(id),
        queryKey: ["quizzes", "quizzes_questions", id],
    })
    const currentQuestionIndex = useQuestionsStore(
        (s) => s.currentQuestionIndex
    )
    const questions = useQuestionsStore((s) => s.questions)
    const setQuestions = useQuestionsStore((s) => s.setQuestions)
    const reset = useQuestionsStore((s) => s.reset)
    const setStartDate = useQuestionsStore((s) => s.setStartDate)
    const isSavingResults = useQuestionsStore((s) => s.isSavingResults)
    const isSavingError = useQuestionsStore((s) => s.isSavingError)
    const isSavingSuccess = useQuestionsStore((s) => s.isSavingSuccess)

    const percentage = (currentQuestionIndex * 100) / questions.length + 5
    const isFinished = isSavingSuccess || isSavingError

    useEffect(() => {
        reset()
        setQuestions(
            data?.quizzes_questions.sort(
                (a, b) => (a.display_order || 0) - (b.display_order || 0)
            ) || []
        )
        setStartDate(new Date())
    }, [data?.quizzes_questions, reset, setQuestions, setStartDate])

    if (isQuestionsError) {
        return <ErrorDisplay />
    }

    return (
        <>
            {!isFinished && questions.length > 0 && (
                <header className="w-full fixed top-0 z-50  flex items-center border-b h-24 px-20  bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60">
                    <BackButton className="ml-auto mr-2 opacity-50" />
                    <ProgressBar className="w-[65%]" percentage={percentage} />
                    <div className="mr-auto"></div>
                </header>
            )}
            <main
                className={cn("relative mt-32 min-h-[100vh]", {
                    "overflow-x-hidden mt-0": isFinished,
                })}
            >
                {isLoadingQuestions ||
                    (isLoading && (
                        <div className=" h-[100vh] flex items-center justify-center">
                            <AnimatedLoader />
                        </div>
                    ))}
                {isSavingResults && <ResultLoadingPage />}
                {isSavingError && <ErrorDisplay />}

                {isFinished &&
                    !isSavingError &&
                    !isLoadingQuestions &&
                    isSavingSuccess && <Result />}

                {!isSavingResults &&
                    !isFinished &&
                    !isSavingError &&
                    !isLoadingQuestions &&
                    !isSavingSuccess && <Questions />}
            </main>
        </>
    )
}
