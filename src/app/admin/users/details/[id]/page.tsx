"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import AnimatedLoader from "@/components/ui/animated-loader"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { readUserProfileWithData } from "@/data-access/users/read"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { Check, ClipboardCheck, SkipForward, X } from "lucide-react"
import { useParams } from "next/navigation"
import { columns } from "./table-columns"
import { SubmissionsChart } from "./_components/submissions-chart"
import TooltipWrapper from "@/components/ui/tooltip"
import XpIcon from "@/components/icons/xp"
import { Badge } from "@/components/ui/badge"

export default function Page() {
    const params = useParams()
    const id = decodeURIComponent(params["id"] as string)
    const { isLoading, isError, data } = useQuery({
        queryKey: [
            "user_profiles",
            "quiz_submissions",
            "quizzes",
            "quiz_submission_answers",
            id,
        ],
        queryFn: () => readUserProfileWithData({ user_id: id }),
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

    const allAnswers = data?.quiz_submissions.flatMap(
        (item) => item.quiz_submission_answers
    )
    const successQuestions = allAnswers?.filter(
        (answer) => answer.is_answered_correctly
    ).length
    const failedQuestions = allAnswers?.filter(
        (answer) => !answer.is_answered_correctly && !answer.is_skipped
    ).length

    const skippedQuestions = allAnswers?.filter(
        (answer) => answer.is_skipped
    ).length

    const tableData = data?.quiz_submissions?.map((submission) => {
        return {
            submissionId: submission.id,
            duration: submission.seconds_spent,
            quiz: submission.quiz?.name,
            quizImage: submission.quiz?.image,
            correct: submission.quiz_submission_answers.filter(
                (answer) => answer.is_answered_correctly === true
            ).length,
            wrong: submission.quiz_submission_answers.filter(
                (answer) => !answer.is_answered_correctly && !answer.is_skipped
            ).length,
            skipped: submission.quiz_submission_answers.filter(
                (answer) => answer.is_skipped
            ).length,
            date: submission.created_at,
        }
    })
    const chartData =
        data?.quiz_submissions.map((submission) => {
            return {
                quizName: submission.quiz?.name || "",
                correct: submission.quiz_submission_answers.filter(
                    (answer) => answer.is_answered_correctly === true
                ).length,
                wrong: submission.quiz_submission_answers.filter(
                    (answer) =>
                        !answer.is_answered_correctly && !answer.is_skipped
                ).length,
                skipped: submission.quiz_submission_answers.filter(
                    (answer) => answer.is_skipped
                ).length,
            }
        }) || []
    return (
        <main className="p-10">
            <div className="flex w-full items-center gap-4">
                <div
                    className={cn(
                        "min-h-14 h-14 ml-4 relative w-14 min-w-14 rounded-xl",
                        {
                            "bg-zinc-200/70": !data?.avatar_url,
                        }
                    )}
                >
                    {!!data?.avatar_url && (
                        <div className="overflow-hidden rounded-xl h-full w-full">
                            <img
                                alt=""
                                src={data.avatar_url}
                                className="object-cover object-center"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-left text-2xl font-bold">
                        {data?.username || data?.email}
                    </h1>
                    <p className="font-semibold">{data?.email}</p>
                    <p className="font-semibold">{data?.phone}</p>
                </div>
                <div className="ml-auto scale-125 mr-4">
                    <TooltipWrapper content="XP Points">
                        <Badge
                            variant={"orange"}
                            className=" bg-amber-100/30  h-8 min-w-7 gap-1 text-center flex items-center justify-center border text-amber-500 rounded-full "
                        >
                            {data?.xp_points} <XpIcon className="h-4  w-4" />
                        </Badge>
                    </TooltipWrapper>
                </div>
            </div>
            <section className="grid gap-5 mt-10 grid-cols-4">
                <Card className="p-6 h-40 shadow-black/60 border-black/60">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            Total submissions
                        </span>
                        <ClipboardCheck className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 text-black/70 font-extrabold">
                            {data?.quiz_submissions.length || 0}
                        </div>
                        <div className="text-sm first-letter:uppercase font-bold text-neutral-400">
                            {data?.username} finished{" "}
                            {data?.quiz_submissions.length || 0} quizzes.
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-green-400 border-green-400">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold  text-neutral-400">
                            Questions success Rate
                        </span>
                        <Check className="w-6 h-6 stroke-3  text-neutral-400 " />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 text-green-500/90  font-extrabold">
                            {(
                                ((successQuestions || 0) /
                                    (allAnswers?.length || 1)) *
                                100
                            ).toFixed(1)}{" "}
                            %
                        </div>
                        <div className="text-sm font-bold  text-neutral-400">
                            {data?.username} answered {successQuestions}{" "}
                            questions correctly
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-red-300 border-red-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            Failed Questions
                        </span>
                        <X className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl mt-3 text-red-500/90 font-extrabold">
                            {(
                                ((failedQuestions || 0) /
                                    (allAnswers?.length || 1)) *
                                100
                            ).toFixed(1)}{" "}
                            %
                        </div>
                        <div className="text-sm font-bold  text-neutral-400">
                            {data?.username} answered {failedQuestions}{" "}
                            questions wrongly
                        </div>
                    </div>
                </Card>

                <Card className="p-6 shadow-neutral-300 border-neutral-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-neutral-400 font-bold">
                            Skipped Questions
                        </span>
                        <SkipForward className="w-6 h-6 stroke-3 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl  mt-3 font-extrabold text-neutral-500">
                            {(
                                ((skippedQuestions || 0) /
                                    (allAnswers?.length || 1)) *
                                100
                            ).toFixed(1)}{" "}
                            %
                        </div>
                        <div className="text-sm font-bold  text-neutral-400">
                            {data?.username} skipped {skippedQuestions}{" "}
                            questions
                        </div>
                    </div>
                </Card>
            </section>
            <div className="mt-10 ">
                <SubmissionsChart data={chartData} isLoading={isLoading} />
            </div>
            <div className="mt-10 pb-20">
                <h2 className="text-2xl mb-4 font-extrabold">
                    Quiz submissions table :{" "}
                </h2>
                <DataTable columns={columns} data={tableData || []} />
            </div>
        </main>
    )
}

export type TableItem = {
    submissionId: number
    duration: number | null
    quiz: string | undefined
    quizImage: string | null | undefined
    correct: number
    wrong: number
    skipped: number
    date: string
}
