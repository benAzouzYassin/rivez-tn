import { ErrorDisplay } from "@/components/shared/error-display"
import { cn } from "@/lib/ui-utils"
import { areArraysEqual } from "@/utils/array"
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

    return (
        <div className="space-y-6">
            {props.responses.map((pair, index) => {
                const isCorrect = props.correctAnswers.find((item) =>
                    areArraysEqual(item as string[], pair)
                )
                return (
                    <div key={index} className="flex items-center gap-4">
                        <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200  transition-all duration-200">
                            <span className="text-blue-500 font-bold">
                                {pair[0]}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div
                            className={cn(
                                "flex-1 p-4 bg-gradient-to-r  from-green-50 to-green-100/80 rounded-xl border border-green-200 transition-all duration-200",
                                {
                                    "from-red-50 to-red-100/80 rounded-xl border border-red-200 ":
                                        !isCorrect,
                                }
                            )}
                        >
                            <span
                                className={cn("text-green-600 font-bold", {
                                    "text-red-600": !isCorrect,
                                })}
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
