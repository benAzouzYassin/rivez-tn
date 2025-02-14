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

export async function readQuizzesWithCategory(config?: {
    filters?: {
        name?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const isFiltering = !!config?.filters?.name
    if (config?.pagination && !isFiltering) {
        const response = await supabase
            .from("quizzes")
            .select(`*, category(*),quizzes_questions(count)`, {
                count: "exact",
            })
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
            .throwOnError()
        return { data: response.data, count: response.count }
    }
    const response = await supabase
        .from("quizzes")
        .select(`*, category(*),quizzes_questions(count)`)
        .ilike("name", `%${config?.filters?.name || ""}%`)
        .neq("publishing_status", "ARCHIVED")
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return { data: response.data }
}

export type QuizWithCategory = Awaited<
    ReturnType<typeof readQuizzesWithCategory>
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
