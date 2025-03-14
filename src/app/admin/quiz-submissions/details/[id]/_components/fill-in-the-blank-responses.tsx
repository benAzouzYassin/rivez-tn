import { cn } from "@/lib/ui-utils"
import {
    FillInTheBlankContent,
    FillInTheBlankContentSchema,
} from "@/schemas/questions-content"
import { ReactNode } from "react"
import { z } from "zod"
import FillInTheBlankItem from "./fill-in-the-blank-item"

export default function FillInTheBlankResponses(props: Props) {
    const BLANK_SEPARATOR = "___"

    // Validate input data
    const contentResult = FillInTheBlankContentSchema.safeParse(props.content)
    const responsesResult = ResponsesSchema.safeParse(props.responses)
    const correctAnswersResult = ResponsesSchema.safeParse(props.correctAnswers)

    if (!contentResult.success || !responsesResult.success) {
        return null
    }

    const content = contentResult.data
    const responses = responsesResult.data
    const correctAnswers = correctAnswersResult.success
        ? correctAnswersResult.data
        : responses

    // Process content and responses
    const paragraphs = content.parts.join(BLANK_SEPARATOR).split("\n")
    const allResponses = [...responses.correct, ...responses.wrong]

    // recheck the correct answers using server side data.
    const responsesWithIsCorrect = allResponses.map((item) => ({
        ...item,
        isCorrect: correctAnswers.correct.some(
            (correctAnswer) =>
                correctAnswer.index === item.index &&
                correctAnswer.option === item.option
        ),
    }))

    const segments = paragraphs.map((paragraph, paragraphIndex) => ({
        paragraphIndex,
        segments: paragraph.split(BLANK_SEPARATOR),
    }))
    const geDropZoneIndex = (paragraphIndex: number, segmentIndex: number) => {
        let result = 0
        segments.forEach((item) => {
            if (item.paragraphIndex < paragraphIndex) {
                result += item.segments.length
            }
            if (item.paragraphIndex === paragraphIndex) {
                result += segmentIndex
            }
        })
        return result
    }
    return (
        <div>
            {paragraphs.map((paragraph, paragraphIndex) => {
                const segments = paragraph.split(BLANK_SEPARATOR)

                return (
                    <div
                        key={`paragraph-${paragraphIndex}`}
                        className="max-w-[900px]"
                    >
                        {segments.map((segment, segmentIndex) => {
                            const dropZoneIndex = geDropZoneIndex(
                                paragraphIndex,
                                segmentIndex
                            )
                            const response = responsesWithIsCorrect.find(
                                (response) => response.index === dropZoneIndex
                            )

                            const responseText =
                                responses.correct.find(
                                    (item) => item.index === dropZoneIndex
                                )?.option ||
                                responses.wrong.find(
                                    (item) => item.index === dropZoneIndex
                                )?.option ||
                                ""

                            return (
                                <span
                                    className="text-xl font-bold text-neutral-600"
                                    key={`segment-${paragraphIndex}-${segmentIndex}`}
                                >
                                    <span className="h-5 !w-0 inline-flex opacity-0">
                                        .
                                    </span>
                                    {segment}
                                    {segmentIndex < segments.length - 1 && (
                                        <BlankField index={dropZoneIndex}>
                                            <FillInTheBlankItem
                                                isCorrect={response?.isCorrect}
                                                isInCorrect={
                                                    !response?.isCorrect
                                                }
                                                text={responseText}
                                            />
                                        </BlankField>
                                    )}
                                </span>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
const ResponseSchema = z.object({
    index: z.number(),
    option: z.string().nullable().optional(),
})

const ResponsesSchema = z.object({
    wrong: z.array(ResponseSchema),
    correct: z.array(ResponseSchema),
})

interface Props {
    correctAnswers: unknown
    responses: unknown
    content: unknown
}

function BlankField({
    index,
    children,
}: {
    index: number
    children: ReactNode
}) {
    return (
        <span
            className={cn(
                "h-14 border-b-4 mx-2 border-neutral-300 rounded-md mt-auto min-w-24 inline-flex",
                {
                    "border-white -translate-y-2": !!children,
                }
            )}
        >
            {children}
        </span>
    )
}
