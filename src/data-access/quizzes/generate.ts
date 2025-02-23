import axios from "axios"
import { z } from "zod"
import { readCurrentSession } from "../users/read"
import { GeneratedQuizResponse } from "@/app/api/quiz/generate-quiz/route"

export async function generateQuiz(data: z.infer<typeof bodySchema>) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const response = await axios.post(`/api/quiz/generate-quiz`, data, {
        headers: {
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
    })

    return response.data as GeneratedQuizResponse
}

const bodySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Input exceeds maximum length"),
    mainTopic: z
        .string()
        .min(1, "Main topic is required")
        .max(100, "Input exceeds maximum length"),
    language: z.string().nullable().optional(),
    rules: z.string().nullable().optional(),
    maxQuestions: z.coerce.number().max(999).nullable().optional(),
    minQuestions: z.coerce.number().max(20).nullable().optional(),
    pdfName: z.string().nullable().optional(),
    pdfUrl: z.string().nullable().optional(),
})
