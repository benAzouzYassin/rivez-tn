"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import AnimatedLoader from "@/components/ui/animated-loader"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { readSubmissionWithDataById } from "@/data-access/quiz_submissions/read"
import { cn } from "@/lib/ui-utils"
import {
    MatchingPairsContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import { formatDate } from "@/utils/date"
import { useQuery } from "@tanstack/react-query"
import { Check, Clock, SkipForward, X } from "lucide-react"
import { useParams } from "next/navigation"
import { columns } from "./table-columns"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"
export default function Page() {
    const translation = useMemo(() => {
        return {
            en: {
                "Time Spent": "Time Spent",
                Average: "Average",
                "s per question": "s per question",
                "Success Rate": "Success Rate",
                Questions: "Questions",
                "success rate": "success rate",
                "Failed Questions": "Failed Questions",
                "failure rate": "failure rate",
                Skipped: "Skipped",
                "skip rate": "skip rate",
                "Questions Answers :": "Questions Answers :",
            },
            fr: {
                "Time Spent": "Temps passé",
                Average: "Moyenne",
                "s per question": "s par question",
                "Success Rate": "Taux de réussite",
                Questions: "Questions",
                "success rate": "taux de réussite",
                "Failed Questions": "Questions échouées",
                "failure rate": "taux d'échec",
                Skipped: "Passé",
                "skip rate": "taux de passage",
                "Questions Answers :": "Réponses aux questions :",
            },
            ar: {
                "Time Spent": "الوقت المستغرق",
                Average: "المتوسط",
                "s per question": "ثانية لكل سؤال",
                "Success Rate": "معدل النجاح",
                Questions: "أسئلة",
                "success rate": "معدل النجاح",
                "Failed Questions": "الأسئلة الفاشلة",
                "failure rate": "معدل الفشل",
                Skipped: "تم التخطي",
                "skip rate": "معدل التخطي",
                "Questions Answers :": "إجابات الأسئلة :",
            },
        }
    }, [])
    const lang = getLanguage()
    const t = translation[lang] || translation.en
    const params = useParams()
    const id = Number(params["id"])
    const { isLoading, isError, data } = useQuery({
        queryKey: [
            "quiz_submissions",
            "quiz_submission_answers",
            "quizzes",
            "user_profiles",
            id,
        ],
        queryFn: () => readSubmissionWithDataById({ id }),
    })

    if (isLoading) {
        return (
            <div className="h-[100vh] dark:bg-neutral-900 flex items-center absolute top-0 left-0 bg-white w-full z-50 justify-center">
                <AnimatedLoader />
            </div>
        )
    }
    if (isError) {
        return <ErrorDisplay />
    }

    const successQuestions = data?.quiz_submission_answers?.filter(
        (answer) => answer.is_answered_correctly
    ).length
    const failedQuestions = data?.quiz_submission_answers?.filter(
        (answer) => !answer.is_answered_correctly && !answer.is_skipped
    ).length
    const skippedQuestions = data?.quiz_submission_answers?.filter(
        (answer) => answer.is_skipped
    ).length
    const tableData = data?.quiz_submission_answers?.map((answer) => {
        const status = (
            answer.is_answered_correctly
                ? "succeeded"
                : answer.is_skipped
                ? "skipped"
                : "failed"
        ) as "skipped" | "failed" | "succeeded"
        const responseContent =
            answer.question?.type === "MATCHING_PAIRS"
                ? (answer.responses as string[][])
                : (answer.responses as string[])
        const questionContent = answer.question?.content as unknown as
            | MatchingPairsContent
            | MultipleChoiceContent
        return {
            questionContent: answer.question?.content,
            question: answer.question?.question,
            questionType: answer.question?.type,
            timeSpent: answer.seconds_spent,
            failedAttempts: answer.failed_attempts,
            status: status, // failed / succeeded / skipped
            responseContent: responseContent,
            correctAnswers: questionContent["correct"],
            questionImage: answer.question?.image || undefined,
        }
    })
    return (
        <main className="md:p-10 p-3">
            <div className="flex md:flex-row md:rtl:flex-row-reverse flex-col w-full items-center gap-4">
                <div
                    className={cn(
                        "min-h-14 h-14  ltr:ml-4  md:mt-0 mt-4 relative w-14 min-w-14 rounded-xl",
                        {
                            "bg-zinc-200/70": !data?.user?.avatar_url,
                        }
                    )}
                >
                    {!!data?.user?.avatar_url && (
                        <div className="overflow-hidden rounded-xl h-full w-full">
                            <img
                                alt=""
                                src={data.user.avatar_url}
                                className="object-cover object-center"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="md:text-left text-center text-2xl font-bold">
                        {data?.user?.username ||
                            data?.user?.email ||
                            data?.user_submit_name}
                    </h1>
                    <p className="font-semibold md:text-left text-center">
                        {formatDate(data?.created_at)}
                    </p>
                </div>
                <div className="text-2xl md:text-left text-center font-extrabold text-blue-600 md:ml-auto">
                    {data?.quiz?.name}
                </div>
            </div>
            <section className="grid gap-5 mt-10 md:grid-cols-2 grid-cols-1 lg:grid-cols-4">
                <Card className="p-6 h-40 shadow-black/60 border-black/60">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            {t["Time Spent"]}
                        </span>
                        <Clock className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 dark:text-white text-black/70 font-extrabold">
                            {data?.seconds_spent?.toFixed(1)}s
                        </div>
                        <div className="text-sm font-bold text-neutral-400">
                            {t["Average"]}{" "}
                            {data?.seconds_spent &&
                            data?.quiz_submission_answers?.length
                                ? (
                                      data.seconds_spent /
                                      data.quiz_submission_answers.length
                                  ).toFixed(2)
                                : 0}
                            {t["s per question"]}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-green-400 border-green-400">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-neutral-400">
                            {t["Success Rate"]}
                        </span>
                        <Check className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 text-green-500/90 font-extrabold">
                            {successQuestions}{" "}
                            <span className="text-xl -translate-y-1 inline-flex">
                                {t["Questions"]}
                            </span>
                        </div>
                        <div className="text-sm font-bold text-neutral-400">
                            {(
                                ((successQuestions || 0) /
                                    (data?.quiz_submission_answers?.length ||
                                        1)) *
                                100
                            ).toFixed(1)}
                            %{t["success rate"]}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-red-300 border-red-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            {t["Failed Questions"]}
                        </span>
                        <X className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 text-red-500/90 font-extrabold">
                            {failedQuestions}{" "}
                            <span className="text-xl -translate-y-1 inline-flex">
                                {t["Questions"]}
                            </span>
                        </div>
                        <div className="text-sm font-bold text-neutral-400">
                            {(
                                ((failedQuestions || 0) /
                                    (data?.quiz_submission_answers?.length ||
                                        1)) *
                                100
                            ).toFixed(1)}
                            %{t["failure rate"]}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-neutral-300 border-neutral-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            {t["Skipped"]}
                        </span>
                        <SkipForward className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 font-extrabold dark:text-neutral-200 text-neutral-500">
                            {skippedQuestions}{" "}
                            <span className="text-xl -translate-y-1 inline-flex">
                                {t["Questions"]}
                            </span>
                        </div>
                        <div className="text-sm font-bold text-neutral-400">
                            {(
                                ((skippedQuestions || 0) /
                                    (data?.quiz_submission_answers?.length ||
                                        1)) *
                                100
                            ).toFixed(1)}
                            %{t["skip rate"]}
                        </div>
                    </div>
                </Card>
            </section>

            <div className="mt-10 pb-20">
                <h2 className="text-2xl mb-4 font-extrabold">
                    {t["Questions Answers :"]}
                </h2>
                <DataTable columns={columns} data={tableData || []} />
            </div>
        </main>
    )
}

export type AnswerTableItem = {
    question: string | undefined
    questionType: PossibleQuestionTypes | null | undefined
    timeSpent: number | null
    failedAttempts: number | null
    status: "skipped" | "failed" | "succeeded"
    responseContent: string[] | string[][]
    correctAnswers: string[] | string[][]
    questionImage?: string
    questionContent: any
}
