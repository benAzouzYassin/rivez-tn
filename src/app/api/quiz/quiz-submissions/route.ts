import { SaveSubmissionType } from "@/data-access/quiz_submissions/create"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { negativeToZero } from "@/utils/numbers"

export async function POST(req: NextRequest) {
    const wrongAnswerXp = Number(process.env.NEXT_PUBLIC_WRONG_ANSWER_XP || 0)
    const correctAnswerXp = Number(
        process.env.NEXT_PUBLIC_CORRECT_ANSWER_XP || 0
    )
    const skippedAnswerXp = Number(
        process.env.NEXT_PUBLIC_SKIPPED_ANSWER_XP || 0
    )

    const userPerQuizSubmissionLimit = Number(
        process.env.USER_SUBMISSION_PER_QUIZ_LIMIT
    )
    try {
        const supabase = await supabaseAdminServerSide()
        const accessToken = req.headers.get("access-token") || ""
        const userId = String(
            verify(accessToken, process.env.SUPABASE_JWT_SECRET!).sub
        )
        if (!userId) {
            return NextResponse.json({ success: false }, { status: 400 })
        }

        const { submissionData } = (await req.json()) as BodyType
        if (!userId) {
            return NextResponse.json({ success: false }, { status: 403 })
        }

        const quizId = Number(submissionData.submissionData.quiz)
        const quizOwner = (
            await supabase
                .from("quizzes")
                .select("author_id(*)")
                .eq("id", quizId)
                .single()
                .throwOnError()
        ).data.author_id

        const getUserToSubmitName = async () => {
            const userName = (
                await supabase
                    .from("user_profiles")
                    .select("username")
                    .eq("user_id", userId)
                    .single()
                    .throwOnError()
            ).data.username
            return userName
        }
        const userToSubmitName =
            quizOwner?.user_id === userId
                ? quizOwner.username
                : await getUserToSubmitName()
        const { count: oldSubmissionCount, data: oldSubmissionsData } =
            await supabase
                .from("quiz_submissions")
                .select(
                    "id,xp_gained,quiz_submission_answers(is_answered_correctly,is_skipped)",
                    { count: "exact" }
                )
                .eq("quiz", quizId)
                .eq("user", String(userId))
                .throwOnError()

        if ((oldSubmissionCount || 0) >= userPerQuizSubmissionLimit) {
            return NextResponse.json({ success: false }, { status: 429 })
        }

        const insertedSubmission = await supabase
            .from("quiz_submissions")
            .insert({
                ...submissionData.submissionData,
                user_submit_name: userToSubmitName,
                quiz_owner_id: quizOwner?.user_id,
            })
            .select("id")
            .throwOnError()
        const insertedSubmissionId = Number(insertedSubmission.data[0].id)

        await supabase
            .from("quiz_submission_answers")
            .insert(
                submissionData.answersData.map((item) => ({
                    ...item,
                    quiz_submission: insertedSubmissionId,
                    quiz_owner_id: quizOwner?.user_id,
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
        const submissionXp = negativeToZero(
            submissionData.answersData.reduce((acc, curr) => {
                if (curr.is_skipped) {
                    return acc + skippedAnswerXp
                }
                if (curr.is_answered_correctly) {
                    return acc + correctAnswerXp
                }
                if (!curr.is_answered_correctly && !curr.is_skipped) {
                    return acc + wrongAnswerXp
                }
                return acc
            }, 0)
        )
        if ((oldSubmissionCount || 0) > 0) {
            const oldSubmissionXp = Number(
                oldSubmissionsData.reduce(
                    (total, curr) =>
                        total + negativeToZero(curr.xp_gained || 0),
                    0
                )
            )
            const xpGained =
                submissionXp - oldSubmissionXp > 0
                    ? submissionXp - oldSubmissionXp
                    : 0
            const newXp = Number(xp_points || 0) + xpGained
            await supabase
                .from("user_profiles")
                .update({
                    xp_points: newXp,
                })
                .eq("user_id", userId)
                .throwOnError()

            await supabase
                .from("quiz_submissions")
                .update({
                    xp_gained: xpGained,
                })
                .eq("id", insertedSubmissionId)
                .throwOnError()
            return NextResponse.json(
                { success: true, xpGained },
                { status: 200 }
            )
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
        await supabase
            .from("quiz_submissions")
            .update({
                xp_gained: submissionXp,
            })
            .eq("id", insertedSubmissionId)
            .throwOnError()
        return NextResponse.json(
            { success: true, xpGained: submissionXp },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error creating submission:", error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}

type BodyType = {
    submissionData: SaveSubmissionType
}
