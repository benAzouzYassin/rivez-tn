import { SaveSubmissionType } from "@/data-access/quiz_submissions/create"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
export async function POST(req: NextRequest) {
    const userPerQuizSubmissionLimit = Number(
        process.env.USER_SUBMISSION_PER_QUIZ_LIMIT
    )
    try {
        const supabase = await supabaseAdminServerSide()
        const accessToken = req.headers.get("access-token") || ""
        const userId = verify(accessToken, process.env.SUPABASE_JWT_SECRET!).sub
        if (!userId) {
            return NextResponse.json({ success: false }, { status: 400 })
        }

        const { submissionData } = (await req.json()) as BodyType
        if (userId !== submissionData.submissionData.user) {
            return NextResponse.json({ success: false }, { status: 403 })
        }
        const quizId = Number(submissionData.submissionData.quiz)
        const { count: oldSubmissionCount, data: oldSubmissionsData } =
            await supabase
                .from("quiz_submissions")
                .select(
                    "id,quiz_submission_answers(is_answered_correctly,is_skipped)",
                    { count: "exact" }
                )
                .eq("quiz", quizId)
                .eq("user", String(userId))
                .order("created_at", {
                    ascending: false,
                })
                .throwOnError()

        if ((oldSubmissionCount || 0) >= userPerQuizSubmissionLimit) {
            return NextResponse.json({ success: false }, { status: 429 })
        }

        const insertedSubmission = await supabase
            .from("quiz_submissions")
            .insert(submissionData.submissionData)
            .select("id")
            .throwOnError()
        const insertedSubmissionId = Number(insertedSubmission.data[0].id)

        await supabase
            .from("quiz_submission_answers")
            .insert(
                submissionData.answersData.map((item) => ({
                    ...item,
                    quiz_submission: insertedSubmissionId,
                }))
            )
            .throwOnError()
        const {
            data: { xp_points },
        } = await supabase
            .from("user_profiles")
            .select("xp_points")
            .eq("user_id", userId)
            .single()
            .throwOnError()
        const submissionXp = submissionData.answersData.reduce((acc, curr) => {
            if (curr.is_skipped) {
                return acc - 2
            }
            if (curr.is_answered_correctly) {
                return acc + 2
            }
            if (!curr.is_answered_correctly && !curr.is_skipped) {
                return acc - 1
            }
            return acc
        }, 0)
        if ((oldSubmissionCount || 0) > 0) {
            const oldXp = oldSubmissionsData[0].quiz_submission_answers.reduce(
                (acc, curr) => {
                    if (curr.is_skipped) {
                        return acc - 2
                    }
                    if (curr.is_answered_correctly) {
                        return acc + 2
                    }
                    if (!curr.is_answered_correctly && !curr.is_skipped) {
                        return acc - 1
                    }
                    return acc
                },
                0
            )
            const xpGained = submissionXp - oldXp > 0 ? submissionXp - oldXp : 0
            const newXp = Number(xp_points || 0) + xpGained
            await supabase
                .from("user_profiles")
                .update({
                    xp_points: newXp,
                })
                .eq("user_id", userId)
                .throwOnError()
            return NextResponse.json({ success: true, newXp }, { status: 200 })
        }

        const newXp =
            submissionXp > 0
                ? Number(xp_points || 0) + submissionXp
                : Number(xp_points || 0)
        await supabase
            .from("user_profiles")
            .update({
                xp_points: newXp,
            })
            .eq("user_id", userId)
            .throwOnError()
        return NextResponse.json({ success: true, newXp }, { status: 200 })
    } catch (error) {
        console.error("Error creating submission:", error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}

type BodyType = {
    submissionData: SaveSubmissionType
}
