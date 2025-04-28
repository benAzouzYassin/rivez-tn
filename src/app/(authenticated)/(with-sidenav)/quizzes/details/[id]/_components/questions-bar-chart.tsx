"use client"

import { Card } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { readQuizQuestionsDetails } from "@/data-access/quizzes/read"
import { getLanguage } from "@/utils/get-language"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

export function QuestionsBarChart() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const chartConfig = useMemo(
        () => ({
            correct: {
                label: "Correct",
                color: isDark ? "#2fb564" : "#22c55e",
            },
            wrong: {
                label: "Wrong",
                color: isDark ? "#ce3b40" : "#ef4444",
            },
            skipped: {
                label: "Skipped",
                color: isDark ? "#777777" : "#A1A1A1",
            },
        }),
        [isDark]
    ) satisfies ChartConfig

    const gridColor = isDark ? "#777777" : "#e5e7eb"
    const axisColor = isDark ? "#d4d4d8" : "#a3a3a3"

    const translation = useMemo(
        () => ({
            en: {
                "the last 100 submission data :":
                    "the last 100 submission data :",
            },
            fr: {
                "the last 100 submission data :":
                    "les 100 dernières données de soumission :",
            },
            ar: {
                "the last 100 submission data :":
                    "آخر 100 من البيانات التي تم إرسالها :",
            },
        }),
        []
    )
    const lang = useMemo(getLanguage, [])
    const t = translation[lang]
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
            correct: q.correct || 0.03,
            wrong: q.wrong || 0.03,
            skipped: q.skipped || 0.03,
        }
    })
    const isDataNotEnough = chartData?.every(
        (item) => item.correct < 1 && item.wrong < 1 && item.skipped < 1
    )

    return (
        <Card
            className={`mt-10 pb-2 pt-5 w-full ${
                isDark
                    ? "bg-neutral-900 border-neutral-700"
                    : "bg-white border-neutral-200"
            } transition-colors`}
        >
            <h2
                className={`text-2xl px-5 font-extrabold ${
                    isDark ? "text-white/90" : "text-black/80"
                }`}
            >
                {t["the last 100 submission data :"]}
            </h2>

            {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                    <Loader2
                        className={`duration-300 w-10 h-10 animate-spin ${
                            isDark ? "text-neutral-500" : "text-neutral-400"
                        }`}
                    />
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
                        <CartesianGrid
                            vertical={false}
                            stroke={gridColor}
                            strokeDasharray="3 3"
                        />
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
                            stroke={axisColor}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            barSize={50}
                            dataKey="correct"
                            fill={chartConfig.correct.color}
                            radius={4}
                        />
                        <Bar
                            barSize={50}
                            dataKey="wrong"
                            fill={chartConfig.wrong.color}
                            radius={4}
                        />
                        <Bar
                            barSize={50}
                            dataKey="skipped"
                            fill={chartConfig.skipped.color}
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            )}
        </Card>
    )
}
