import {
    GeneratedQuizResponse,
    GenerateQuizBodyType,
} from "@/app/api/quiz/generate-quiz/route"
import { partialParseJson } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { z } from "zod"
import { readCurrentSession } from "../users/read"

export const generateQuiz = async (
    data: GenerateQuizBodyType,
    onChange: (newValue: GeneratedQuizResponse | null) => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const response = await fetch(`/api/quiz/generate-quiz`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
        body: JSON.stringify(data),
    })

    const reader = response?.body?.getReader()
    let rawResult = ""
    if (reader) {
        readStream(reader, (chunk) => {
            rawResult += chunk
            try {
                const questions = quizQuestionSchema.parse(
                    partialParseJson(rawResult)
                )
                onChange(questions)
            } catch (error) {
                console.error(error)
            }
        })
    } else {
        throw new Error("no stream to read data")
    }
}

const quizQuestionSchema = z.object({
    questionsCount: z.number(),
    questions: z.array(
        z.union([
            z.object({
                questionText: z.string(),
                type: z.literal("MATCHING_PAIRS"),
                content: z.object({
                    correct: z.array(z.array(z.string())),
                    leftSideOptions: z.array(z.string()),
                    rightSideOptions: z.array(z.string()),
                }),
            }),
            z.object({
                questionText: z.string(),
                type: z.literal("MULTIPLE_CHOICE"),
                content: z.object({
                    correct: z.array(z.string()),
                    options: z.array(z.string()),
                }),
            }),
        ])
    ),
})
