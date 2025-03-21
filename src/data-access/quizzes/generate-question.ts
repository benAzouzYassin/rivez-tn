import { GenerateSingleQuestionBodyType } from "@/app/api/quiz/generate-quiz/generate-single-question/route"
import axios from "axios"
import { readCurrentSession } from "../users/read"
import { singleQuestionSchema } from "./generate"

export const generateQuizQuestion = async (
    data: GenerateSingleQuestionBodyType
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const response = await axios.post(
        "/api/quiz/generate-quiz/generate-single-question",
        data,
        {
            headers: {
                "Content-Type": "application/json",
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
    if (response.status !== 200) {
        throw new Error("error while generating the quiz ")
    }
    const result = JSON.parse(response?.data?.result)?.question
    return singleQuestionSchema.parse(result)
}
