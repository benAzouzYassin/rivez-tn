import { supabase } from "@/lib/supabase-client-side"

export async function readCurrentUser() {
    const userResponse = await supabase.auth.getUser()
    if (userResponse.error) {
        return {
            data: {},
            success: false,
            error: userResponse.error,
        }
    }

    const userRoleResponse = await supabase
        .from("user_roles")
        .select("user_role")
        .eq("user_id", userResponse.data.user.id)
        .single()

    const userProfileResponse = await supabase
        .from("user_profiles")
        .select("username")
        .eq("user_id", userResponse.data.user.id)
        .single()

    if (userRoleResponse.error) {
        return {
            data: {},
            success: false,
            error: userResponse.error,
        }
    }
    return {
        data: {
            user_role: userRoleResponse.data.user_role,
            id: userResponse.data.user?.id,
            email: userResponse.data.user?.email,
            emailConfirmedAt: userResponse.data.user?.email_confirmed_at,
            isEmailConfirmed: !!userResponse.data.user?.email_confirmed_at,
            phone: userResponse.data.user?.phone,
            phoneConfirmedAt: userResponse.data.user?.phone_confirmed_at,
            isPhoneConfirmed: !!userResponse.data.user?.phone_confirmed_at,
            identities: userResponse.data.user?.identities?.map((identity) => ({
                avatar: identity?.identity_data?.avatar_url,
                displayName:
                    identity?.identity_data?.displayName ||
                    identity?.identity_data?.username ||
                    identity?.identity_data?.name,
            })),
            userName: userProfileResponse.data?.username,
            createdAt: userResponse.data.user?.created_at,
        },
        success: true,
        error: {
            message: null,
            stack: null,
        },
    }
}
export async function readCurrentSession() {
    const { data, error } = await supabase.auth.getSession()
    return {
        data: data,
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
export async function readUsersProfilesWithDetails(config?: {
    filters?: {
        userSearch?: string
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const isFiltering = !!config?.filters?.userSearch
    let query = supabase
        .from("user_profiles")
        .select(
            `*,quiz_submissions(*,quiz_submission_answers(is_answered_correctly,is_skipped))`,
            {
                count: "exact",
            }
        )
        .order("created_at", { ascending: false })

    if (isFiltering) {
        query = query.or(
            `username.ilike.%${config?.filters?.userSearch}%,email.ilike.%${config?.filters?.userSearch}%,phone.ilike.%${config?.filters?.userSearch}%`
        )
    }

    if (config?.pagination && !isFiltering) {
        const { currentPage, itemsPerPage } = config.pagination
        query = query.range(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage - 1
        )
    }

    const response = await query.throwOnError()

    const formatUserData = (user: any) => ({
        ...user,
        quiz_submissions: user.quiz_submissions.reduce(
            (acc: any, curr: any) => {
                const answersCount = {
                    skipped: curr.quiz_submission_answers.filter(
                        (answer: any) => answer.is_skipped === true
                    ).length,
                    wrong: curr.quiz_submission_answers.filter(
                        (answer: any) =>
                            !answer.is_answered_correctly && !answer.is_skipped
                    ).length,
                    correct: curr.quiz_submission_answers.filter(
                        (answer: any) => answer.is_answered_correctly === true
                    ).length,
                }

                return {
                    correctAnswers: answersCount.correct + acc.correctAnswers,
                    skippedAnswers: answersCount.skipped + acc.skippedAnswers,
                    wrongAnswers: answersCount.wrong + acc.wrongAnswers,
                    submissionsCount: acc.submissionsCount + 1,
                }
            },
            {
                submissionsCount: 0,
                correctAnswers: 0,
                skippedAnswers: 0,
                wrongAnswers: 0,
            }
        ),
    })

    const formattedData = response.data.map(formatUserData)
    return { data: formattedData, count: response.count }
}

export async function readUserProfileWithData(params: { user_id: string }) {
    const response = await supabase
        .from("user_profiles")
        .select(
            `*,quiz_submissions(*,quiz(name,image),quiz_submission_answers(is_answered_correctly,is_skipped))`
        )
        .eq("user_id", params.user_id)
        .single()
        .throwOnError()
    return response.data
}
