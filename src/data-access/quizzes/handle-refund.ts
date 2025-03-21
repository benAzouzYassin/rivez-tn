import axios from "axios"
import { readCurrentSession } from "../users/read"

export async function handleQuizRefund(data: {
    cause: string
    quizId: number
}) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    await axios.post(`/api/quiz/handle-refund`, data, {
        headers: {
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
    })
}
export async function handleQuestionRefund() {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    await axios.post(
        `/api/quiz/handle-question-refund`,
        {},
        {
            headers: {
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
}
export async function handleHintRefund() {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    await axios.post(
        `/api/quiz/handle-hint-refund`,
        {},
        {
            headers: {
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
}
