import {
    GeneratedQuizResponse,
    GenerateQuizBodyType as GenerateFromSubjectBody,
} from "@/app/api/quiz/generate-quiz/from-topic/route"
import { partialParseJson, cleanJsonStream } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { z } from "zod"
import { readCurrentSession } from "../users/read"
import { CodeSnippetsResponse } from "@/app/api/quiz/generate-code-snippets/route"

export const generateQuiz = async (
    method: "subject" | "pdf",
    data: GenerateFromSubjectBody,
    onChange: (newValue: GeneratedQuizResponse | null) => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    let endpoint = ""
    if (method === "subject") {
        endpoint = "/api/quiz/generate-quiz/from-topic"
    }
    if (method === "pdf") {
        endpoint = "/api/quiz/generate-quiz/from-pdf"
    }
    const response = await fetch(endpoint, {
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
            rawResult = cleanJsonStream(rawResult)

            try {
                const partialData = partialParseJson(rawResult)
                const questions = quizQuestionSchema.parse(partialData)
                onChange(questions)
            } catch {}
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

export const generateCodeSnippets = async (
    data: {
        language: string
        concepts: string
        framework?: string | undefined
        notes?: string | undefined
        fileCount: number
    },
    onChange: (newValue: CodeSnippetsResponse | null) => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const response = await fetch("/api/quiz/generate-code-snippets", {
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
                const partialData = partialParseJson(rawResult)
                const data = codeSnippetsResponse.parse(partialData)
                onChange(data as any)
            } catch {}
        })
    } else {
        throw new Error("no stream to read data")
    }
}
const codeSnippetsResponse = z.array(
    z.object({
        filename: z.string(),
        programmingLanguage: z.string(),
        code: z.string(),
    })
)
