import { Database } from "@/types/database.types"
import axios from "axios"
import { readCurrentSession } from "../users/read"

export async function saveSubmission(data?: SaveSubmissionType) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const response = await axios.post(
        `/api/quiz-submissions`,
        { submissionData: data },
        {
            headers: {
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
    const xpGained = Number(response.data.xpGained || 0)
    return xpGained
}
export type SaveSubmissionType = {
    submissionData: Database["public"]["Tables"]["quiz_submissions"]["Insert"]
    answersData: Omit<
        Database["public"]["Tables"]["quiz_submission_answers"]["Insert"],
        "quiz_submission"
    >[]
}
