import { supabase } from "@/lib/supabase-client-side"

export async function readQuizWithQuestionsById(id: number) {
    const response = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .eq(`id`, id)
        .single()
        .throwOnError()
    return response.data
}

export async function readQuizById(id: number) {
    const response = await supabase
        .from("quizzes")
        .select(`*`)
        .eq(`id`, id)
        .single()
        .throwOnError()
    return response.data
}

export async function readQuizzesWithDetails(config?: {
    isAdmin: boolean | null
    userId: string | null
    filters?: {
        name?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    // when is Featured == false and isAdmin == false we should only return the quizzes with author_id == currentUser.id
    const isFiltering = !!config?.filters?.name
    if (config?.pagination && !isFiltering) {
        if (config.isAdmin) {
            const response = await supabase
                .from("quizzes")
                .select(
                    `*, category(*),quizzes_questions(count),quiz_submissions(count)`,
                    {
                        count: "exact",
                    }
                )
                .range(
                    (config.pagination.currentPage - 1) *
                        config.pagination.itemsPerPage,
                    config.pagination.currentPage *
                        config.pagination.itemsPerPage -
                        1
                )
                .order("created_at", {
                    ascending: false,
                })
                .neq("publishing_status", "ARCHIVED")
                .throwOnError()
            return { data: response.data, count: response.count }
        }
        const response = await supabase
            .from("quizzes")
            .select(
                `*, category(*),quizzes_questions(count),quiz_submissions(count)`,
                {
                    count: "exact",
                }
            )
            .range(
                (config.pagination.currentPage - 1) *
                    config.pagination.itemsPerPage,
                config.pagination.currentPage * config.pagination.itemsPerPage -
                    1
            )
            .order("created_at", {
                ascending: false,
            })
            .neq("publishing_status", "ARCHIVED")
            .eq("author_id", config.userId!)
            .throwOnError()
        return { data: response.data, count: response.count }
    }
    const response = await supabase
        .from("quizzes")
        .select(
            `*, category(*),quizzes_questions(count),quiz_submissions(count)`
        )
        .ilike("name", `%${config?.filters?.name || ""}%`)
        .neq("publishing_status", "ARCHIVED")
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return { data: response.data }
}

export type QuizWithCategory = Awaited<
    ReturnType<typeof readQuizzesWithDetails>
>["data"][number]

export async function readQuizzesWithEmptyCategory() {
    const response = await supabase
        .from("quizzes")
        .select(`*, category(*),quizzes_questions(count)`)
        .neq("publishing_status", "ARCHIVED")
        .is("category", null)
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return response
}
export async function readQuizzesFilteredByCategories(categories: number[]) {
    const response = await supabase
        .from("quizzes")
        .select(`*, category(*),quizzes_questions(count)`)
        .neq("publishing_status", "ARCHIVED")
        .in("category", categories)
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return response
}

export async function readQuizWithCategory(params: { id: number }) {
    const quizData = (
        await supabase
            .from("quizzes")
            .select(`*, category(*)`, {
                count: "exact",
            })
            .eq("id", params.id)
            .neq("publishing_status", "ARCHIVED")
            .single()
            .throwOnError()
    ).data

    const submissionData = await supabase
        .from("quiz_submissions")
        .select(
            "seconds_spent,quiz_submission_answers(seconds_spent,is_skipped, is_answered_correctly)"
        )
        .eq("quiz", quizData.id)
        .throwOnError()

    let avgSkipped = 0
    let avgCorrect = 0
    let avgFailed = 0
    let avgTimeSpent = 0

    // Process the data to calculate averages
    if (submissionData && submissionData.data) {
        const submissions = submissionData.data
        let totalTimeSpent = 0
        let totalSkipped = 0
        let totalCorrect = 0
        let totalFailed = 0
        let totalAnswers = 0

        submissions.forEach((submission) => {
            if (submission.quiz_submission_answers) {
                totalTimeSpent += submission.seconds_spent || 0
                submission.quiz_submission_answers.forEach((answer) => {
                    totalAnswers++
                    if (answer.is_skipped) {
                        totalSkipped++
                    } else if (answer.is_answered_correctly) {
                        totalCorrect++
                    } else {
                        totalFailed++
                    }
                })
            }
        })

        avgSkipped = totalAnswers > 0 ? totalSkipped / totalAnswers : 0
        avgCorrect = totalAnswers > 0 ? totalCorrect / totalAnswers : 0
        avgFailed = totalAnswers > 0 ? totalFailed / totalAnswers : 0
        avgTimeSpent = totalAnswers > 0 ? totalTimeSpent / totalAnswers : 0
    }
    // TODO make the aggregation in the database
    return { quizData, avgSkipped, avgCorrect, avgFailed, avgTimeSpent }
}

export async function readQuizSubmissions(params: {
    quizId: number
    pagination: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const response = await supabase
        .from("quiz_submissions")
        .select(`*,user(*),quiz_submission_answers(*)`, { count: "exact" })
        .eq("quiz", params.quizId)
        .range(
            (params.pagination.currentPage - 1) *
                params.pagination.itemsPerPage,
            params.pagination.currentPage * params?.pagination?.itemsPerPage - 1
        )
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return { items: response.data, count: response.count }
}

export async function readQuizQuestionsDetails(params: { quizId: number }) {
    const response = await supabase
        .from("quizzes_questions")
        .select(`*,quiz_submission_answers(is_skipped, is_answered_correctly)`)
        .eq("quiz", params.quizId)
        .order("created_at", {
            ascending: false,
        })
        .limit(100, {
            referencedTable: "quiz_submission_answers",
        })
        .throwOnError()
    const formattedData = response.data.map((question) => {
        return {
            ...question,
            correct: question.quiz_submission_answers.filter(
                (answer) => answer.is_answered_correctly === true
            ).length,

            wrong: question.quiz_submission_answers.filter(
                (answer) => !answer.is_answered_correctly && !answer.is_skipped
            ).length,
            skipped: question.quiz_submission_answers.filter(
                (answer) => answer.is_skipped
            ).length,
        }
    })
    return formattedData
}
export async function readQuizQuestionsWithHints(params: { quizId: number }) {
    const response = await supabase
        .from("quizzes_questions")
        .select(`*,questions_hints(*)`)
        .eq("quiz", params.quizId)
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return response.data
}

export async function readQuizQuestionHint(params: { questionId: number }) {
    const response = await supabase
        .from("questions_hints")
        .select(`*`)
        .eq("question_id", params.questionId)
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return response.data[0]
}

export async function readSharedQuizzesWithDetails(config?: {
    isAdmin: boolean | null
    userId: string | null
    filters?: {
        name?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    // when is Featured == false and isAdmin == false we should only return the quizzes with author_id == currentUser.id
    const isFiltering = !!config?.filters?.name
    if (config?.pagination && !isFiltering) {
        if (config.isAdmin) {
            const response = await supabase
                .from("quizzes_shares")
                .select(
                    `*,quizzes(*,quizzes_questions(count),quiz_submissions(count))`,
                    {
                        count: "exact",
                    }
                )
                .range(
                    (config.pagination.currentPage - 1) *
                        config.pagination.itemsPerPage,
                    config.pagination.currentPage *
                        config.pagination.itemsPerPage -
                        1
                )
                .order("created_at", {
                    ascending: false,
                    referencedTable: "quizzes",
                })
                .neq("quizzes.publishing_status", "ARCHIVED")
                .throwOnError()
            return { data: response.data, count: response.count }
        }
        const response = await supabase
            .from("quizzes_shares")
            .select(
                `*,quizzes(*,quizzes_questions(count),quiz_submissions(count))`,
                {
                    count: "exact",
                }
            )
            .range(
                (config.pagination.currentPage - 1) *
                    config.pagination.itemsPerPage,
                config.pagination.currentPage * config.pagination.itemsPerPage -
                    1
            )
            .order("created_at", {
                ascending: false,
                referencedTable: "quizzes",
            })
            .neq("quizzes.publishing_status", "ARCHIVED")
            .throwOnError()
        return { data: response.data, count: response.count }
    }
    const response = await supabase
        .from("quizzes_shares")
        .select(`*,quizzes(*,quizzes_questions(count),quiz_submissions(count))`)
        .ilike("name", `%${config?.filters?.name || ""}%`)
        .neq("quizzes.publishing_status", "ARCHIVED")
        .order("created_at", {
            ascending: false,
            referencedTable: "quizzes",
        })
        .throwOnError()
    return { data: response.data }
}

export async function readLastNQuizzes(number: number, userId: string) {
    const response = await supabase
        .from("quizzes")
        .select(`*`)
        .limit(number)
        .order("created_at", {
            ascending: false,
        })
        .neq("publishing_status", "ARCHIVED")
        .eq("author_id", userId)
        .throwOnError()
    return response.data
}
