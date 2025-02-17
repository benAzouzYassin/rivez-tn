import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function readSubmissionsWithAllData(config?: {
    filters?: {
        userSearch?: string | null
        quizSearch?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const baseQuery = supabase
        .from("quiz_submissions")
        .select(`*, quiz_submission_answers(*), quiz(*), user(*)`, {
            count: "exact",
        })
        .order("created_at", { ascending: false })

    const userSearch = config?.filters?.userSearch || ""
    const quizSearch = config?.filters?.quizSearch || ""
    const isPaginated = !!config?.pagination
    const isFiltered = !!userSearch || !!quizSearch

    if (isPaginated && !isFiltered) {
        const { currentPage, itemsPerPage } = config.pagination!
        const start = (currentPage - 1) * itemsPerPage
        const end = currentPage * itemsPerPage - 1

        const response = await baseQuery.range(start, end).throwOnError()
        return {
            data: response.data as SubmissionType[],
            count: response.count,
        }
    }

    let userFilterResult = [] as SubmissionType[]
    let quizFilterResult = [] as SubmissionType[]
    if (!!quizSearch) {
        const response = await supabase
            .from("quiz_submissions")
            .select(
                `*, quiz_submission_answers(*), quiz!inner(*), user!inner(*)`
            )
            .order("created_at", { ascending: false })
            .ilike("quiz.name", `%${quizSearch}%`)
            .throwOnError()
        quizFilterResult = response.data || []
    }

    if (!!userSearch) {
        const response = await supabase
            .from("quiz_submissions")
            .select(
                `*, quiz_submission_answers(*), quiz!inner(*), user!inner(*)`
            )
            .order("created_at", { ascending: false })
            .or(`username.ilike.%${userSearch}%,email.ilike.%${userSearch}%`, {
                referencedTable: "user",
            })
            .throwOnError()
        userFilterResult = response.data || []
    }

    const filterResult = [...userFilterResult, ...quizFilterResult]
    const uniqueFilterResult = Array.from(
        new Set(filterResult.map((item) => item.id))
    ).map((id) => filterResult.find((item) => item.id === id))
    return {
        data: uniqueFilterResult,
        count: uniqueFilterResult.length,
    }
}
export async function readSubmissionWithDataById(params: { id: number }) {
    const response = await supabase
        .from("quiz_submissions")
        .select(`*, quiz_submission_answers(*,question(*)), quiz(*), user(*)`, {
            count: "exact",
        })
        .eq("id", params.id)
        .single()
        .throwOnError()
    return response.data as SubmissionTypeWithQuestions
}

type SubmissionType =
    Database["public"]["Tables"]["quiz_submissions"]["Row"] & {
        user: Database["public"]["Tables"]["user_profiles"]["Row"] | null
        quiz: Database["public"]["Tables"]["quizzes"]["Row"] | null
        quiz_submission_answers:
            | Database["public"]["Tables"]["quiz_submission_answers"]["Row"][]
            | null
    }
type SubmissionTypeWithQuestions =
    Database["public"]["Tables"]["quiz_submissions"]["Row"] & {
        user: Database["public"]["Tables"]["user_profiles"]["Row"] | null
        quiz: Database["public"]["Tables"]["quizzes"]["Row"] | null
        quiz_submission_answers:
            | (Database["public"]["Tables"]["quiz_submission_answers"]["Row"] & {
                  question?:
                      | Database["public"]["Tables"]["quizzes_questions"]["Row"]
                      | null
              })[]
            | null
    }
