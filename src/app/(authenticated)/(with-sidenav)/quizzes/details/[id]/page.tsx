"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import AnimatedLoader from "@/components/ui/animated-loader"
import { Card } from "@/components/ui/card"
import { readQuizWithCategory } from "@/data-access/quizzes/read"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { Check, Clock, SkipForward, X } from "lucide-react"
import { useParams } from "next/navigation"
import Submissions from "./_components/submissions"
import { QuestionsBarChart } from "./_components/questions-bar-chart"

export default function Page() {
    const params = useParams()
    const id = Number(params["id"])
    const { isLoading, isError, data } = useQuery({
        queryKey: ["quizzes", "quizzes_categories", id],
        queryFn: () => readQuizWithCategory({ id }),
    })

    if (isLoading) {
        return (
            <div className="h-[100vh] flex items-center absolute top-0 left-0 bg-white w-full z-50 justify-center">
                <AnimatedLoader />
            </div>
        )
    }
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <main className="p-4 md:p-10">
            <div className="flex flex-col sm:flex-row w-full items-center gap-4">
                <div
                    className={cn(
                        "min-h-16 h-16 sm:min-h-20 sm:h-20 relative w-24 sm:w-32 sm:min-w-32 rounded-xl",
                        {
                            "bg-zinc-200/70": !data?.quizData?.image,
                        }
                    )}
                >
                    {!!data?.quizData?.image && (
                        <div className="overflow-hidden border rounded-xl h-full w-full">
                            <img
                                alt=""
                                src={data?.quizData.image}
                                className="object-cover w-full h-full object-center"
                            />
                        </div>
                    )}
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl first-letter:uppercase text-neutral-700 font-extrabold">
                        {data?.quizData?.name}
                    </h1>
                    <p className="text-sm sm:text-base font-bold text-neutral-500">
                        {data?.quizData.category?.name}
                    </p>
                </div>
            </div>
            <section className="grid gap-4 mt-6 md:mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4 md:p-6 h-auto md:h-44 shadow-black/60 border-black/60">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            Average Time
                        </span>
                        <Clock className="w-5 h-5 md:w-6 md:h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl md:text-3xl mt-2 md:mt-3 text-black/70 font-extrabold">
                            {data?.avgTimeSpent.toFixed(2)}
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                            The average seconds per submission
                        </div>
                    </div>
                </Card>

                <Card className="p-4 md:p-6 shadow-green-400 border-green-400">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-neutral-400">
                            Success Rate
                        </span>
                        <Check className="w-5 h-5 md:w-6 md:h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl md:text-3xl mt-2 md:mt-3 text-green-600/70 font-extrabold">
                            {((data?.avgCorrect || 0) * 100).toFixed(1)}
                            <span className="text-lg md:text-xl -translate-y-1 inline-flex">
                                %
                            </span>
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                            {((data?.avgCorrect || 0) * 100).toFixed(1)}% of
                            questions are answered correctly
                        </div>
                    </div>
                </Card>

                <Card className="p-4 md:p-6 shadow-red-300 border-red-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            Failure Rate
                        </span>
                        <X className="w-5 h-5 md:w-6 md:h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl md:text-3xl mt-2 md:mt-3 text-red-500/80 font-extrabold">
                            {((data?.avgFailed || 0) * 100).toFixed(1)}
                            <span className="text-lg md:text-xl -translate-y-1 inline-flex">
                                %
                            </span>
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                            {((data?.avgFailed || 0) * 100).toFixed(1)}%
                            questions are answered wrongly
                        </div>
                    </div>
                </Card>

                <Card className="p-4 md:p-6 shadow-neutral-300 border-neutral-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            Skip Rate
                        </span>
                        <SkipForward className="w-5 h-5 md:w-6 md:h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl md:text-3xl mt-2 md:mt-3 font-extrabold text-neutral-500">
                            {((data?.avgSkipped || 0) * 100).toFixed(0)}{" "}
                            <span className="text-lg md:text-xl -translate-y-1 inline-flex">
                                %
                            </span>
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                            {((data?.avgSkipped || 0) * 100).toFixed(0)}%
                            questions are skipped
                        </div>
                    </div>
                </Card>
            </section>

            <div className="mt-6 md:mt-10">
                <h2 className="text-xl md:text-2xl mb-3 md:mb-4 text-black/80 font-extrabold">
                    Quiz submissions :{" "}
                </h2>
                <Submissions />
            </div>
            <div className="mt-6 md:mt-10 pb-10 md:pb-20 min-h-40 md:min-h-56 w-full">
                <QuestionsBarChart />
            </div>
        </main>
    )
}

export type AnswerTableItem = {
    question: string | undefined
    questionType:
        | "MULTIPLE_CHOICE"
        | "MATCHING_PAIRS"
        | "DEBUG_CODE"
        | "CODE_COMPLETION"
        | null
        | undefined
    timeSpent: number | null
    failedAttempts: number | null
    status: "skipped" | "failed" | "succeeded"
    responseContent: string[] | string[][]
    correctAnswers: string[] | string[][]
}
