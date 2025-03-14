"use client"

import { Card } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Loader2 } from "lucide-react"
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

type QuizData = {
    quizName: string
    correct: number
    wrong: number
    skipped: number
}

type Props = {
    data: QuizData[]
    isLoading?: boolean
}

export function SubmissionsChart({ data, isLoading = false }: Props) {
    const chartData = data?.map((q) => ({
        ...q,
        correct: q.correct || 0.03,
        wrong: q.wrong || 0.03,
        skipped: q.skipped || 0.03,
    }))

    const isDataNotEnough = chartData?.every(
        (item) => item.correct < 1 && item.wrong < 1 && item.skipped < 1
    )

    return (
        <Card className=" pb-2 pt-5 w-full">
            <h2 className="pl-10 text-2xl mb-4 font-extrabold">
                Table Quiz submissions data :{" "}
            </h2>
            {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                    <Loader2 className="text-neutral-400 duration-300 w-10 h-10 animate-spin" />
                </div>
            ) : (
                <ChartContainer
                    className="h-full max-h-80 mt-5 w-full"
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
                            dataKey="quizName"
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
                            dataKey="correct"
                            fill="var(--color-correct)"
                            radius={4}
                        />
                        <Bar
                            dataKey="wrong"
                            fill="var(--color-wrong)"
                            radius={4}
                        />
                        <Bar
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
