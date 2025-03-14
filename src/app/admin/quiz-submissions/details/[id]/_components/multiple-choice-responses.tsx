import { ErrorDisplay } from "@/components/shared/error-display"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"

interface Props {
    responses: any[]
    correctAnswers: any[]
}
export default function MultipleChoiceResponses(props: Props) {
    const isValidResponses = z
        .array(z.string())
        .safeParse(props.responses).success
    const isValidCorrectAnswers = z
        .array(z.string())
        .safeParse(props.correctAnswers).success

    if (!isValidCorrectAnswers || !isValidResponses) {
        return <ErrorDisplay />
    }
    return (
        <div className="space-y-4">
            {(props.responses as string[]).map((response, index) => {
                const isCorrect = props.correctAnswers.includes(response)
                return (
                    <div
                        key={index}
                        className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-neutral-700 text-lg font-bold group-hover:text-neutral-900">
                                {response}{" "}
                            </span>
                            <Badge
                                className="rounded-full ml-auto"
                                variant={isCorrect ? "green" : "red"}
                            >
                                {" "}
                                {isCorrect ? "Correct" : "Not correct"}
                            </Badge>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
