"use client"

import { Card } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { readQuizQuestionsDetails } from "@/data-access/quizzes/read"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
    correct: {
        label: "Correct",
        color: "#22c55e",
    },
    wrong: {
        label: "Wrong",
        color: "#ef4444",
    },
    skipped: {
        label: "Skipped",
        color: "#A1A1A1",
    },
} satisfies ChartConfig

export function QuestionsBarChart() {
    const params = useParams()
    const quizId = Number(params["id"])
    const { data, isLoading } = useQuery({
        queryKey: [
            "quizzes_questions",
            "quiz",
            "quiz_submission_answers",
            quizId,
        ],
        queryFn: () => readQuizQuestionsDetails({ quizId }),
    })
    const chartData = data?.map((q) => {
        return {
            question: q.question,
            correct: q.correct || 0.03, //if the value is 0 we make 0.03 so the chart does not feel empty
            wrong: q.wrong || 0.03,
            skipped: q.skipped || 0.03,
        }
    })
    const isDataNotEnough = chartData?.every(
        (item) => item.correct < 1 && item.wrong < 1 && item.skipped < 1
    )
    return (
        <Card className=" mt-10 pb-2 pt-5  w-full">
            <h2 className="text-2xl px-5 font-extrabold  text-black/80">
                Questions data :
            </h2>

            {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                    <Loader2 className="text-neutral-400 duration-300 w-10 h-10 animate-spin" />
                </div>
            ) : (
                <ChartContainer
                    className="h-full max-h-80 mt-5  w-full"
                    config={chartConfig}
                >
                    <BarChart
                        barGap={10}
                        data={
                            isDataNotEnough
                                ? chartData?.map((item) => ({
                                      ...item,
                                      correct: 0,
                                      skipped: 0,
                                      wrong: 0,
                                  }))
                                : chartData
                        }
                        accessibilityLayer
                        className="h-full w-full"
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="question"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            barSize={50}
                            dataKey="correct"
                            fill="var(--color-correct)"
                            radius={4}
                        />
                        <Bar
                            barSize={50}
                            dataKey="wrong"
                            fill="var(--color-wrong)"
                            radius={4}
                        />
                        <Bar
                            barSize={50}
                            dataKey="skipped"
                            fill="var(--color-skipped)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            )}
        </Card>
    )
}
