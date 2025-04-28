import { ErrorDisplay } from "@/components/shared/error-display"
import { cn } from "@/lib/ui-utils"
import { areArraysEqual } from "@/utils/array"
import { containsArabic } from "@/utils/is-arabic"
import { ArrowRight } from "lucide-react"
import { z } from "zod"

interface Props {
    responses: any[]
    correctAnswers: any[]
}

export default function MatchingPairsResponses(props: Props) {
    const isValidResponses = z
        .array(z.array(z.string()))
        .safeParse(props.responses).success
    const isValidCorrectAnswers = z
        .array(z.array(z.string()))
        .safeParse(props.correctAnswers).success

    if (!isValidCorrectAnswers || !isValidResponses) {
        return <ErrorDisplay />
    }
    const isRtl = containsArabic(props.correctAnswers.join(" "))

    return (
        <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
            {props.responses.map((pair, index) => {
                const isCorrect = props.correctAnswers.find((item) =>
                    areArraysEqual(item as string[], pair)
                )
                return (
                    <div key={index} className="flex items-center gap-4">
                        <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 transition-all duration-200">
                            <span className="text-blue-500 dark:text-blue-300 font-bold">
                                {pair[0]}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <div
                            className={cn(
                                "flex-1 p-4 bg-gradient-to-r from-green-50 to-green-100/80 dark:from-green-900/40 dark:to-green-900/10 rounded-xl border border-green-200 dark:border-green-800 transition-all duration-200",
                                {
                                    "from-red-50 to-red-100/80 dark:from-red-900/40 dark:to-red-900/10 border border-red-200 dark:border-red-800":
                                        !isCorrect,
                                }
                            )}
                        >
                            <span
                                className={cn(
                                    "text-green-600 dark:text-green-300 font-bold",
                                    {
                                        "text-red-600 dark:text-red-300":
                                            !isCorrect,
                                    }
                                )}
                            >
                                {pair[1]}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
