import { GenerateHintEndpointBody } from "@/app/api/quiz/generate-hint/route"
import { readStream } from "@/utils/stream"
import { readCurrentSession } from "../users/read"
import { supabase } from "@/lib/supabase-client-side"

export const generateQuestionHint = async (
    data: GenerateHintEndpointBody,
    onChange: (newValue: string) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/quiz/generate-hint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
        body: JSON.stringify(data),
    })
    if (response.status !== 200) {
        throw new Error("error while generating the hint ")
    }
    const reader = response?.body?.getReader()

    if (reader) {
        readStream(reader, onChange, onFinish)
    } else {
        throw new Error("no stream to read data")
    }
}

export async function insertHint(data: { userId: string; questionId: number }) {
    const insertedHint = await supabase
        .from("questions_hints")
        .insert({
            author_id: data.userId,
            content: "",
            question_id: data.questionId,
        })
        .select("*")
        .throwOnError()
    return insertedHint.data
}
