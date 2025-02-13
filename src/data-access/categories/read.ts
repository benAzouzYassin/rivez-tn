import { supabase } from "@/lib/supabase-client-side"

export async function readPublishedCategoriesWithQuizzes() {
    const response = await supabase
        .from("quizzes_categories")
        .select(`*, quizzes(* ,quizzes_questions(count))`)
        .in("quizzes.publishing_status", ["PUBLISHED"])
        .in("publishing_status", ["PUBLISHED"])
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return response.data
}

export async function readCategories(config?: {
    filters?: {
        name?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const isFiltering = !!config?.filters?.name

    if (config) {
        if (config?.pagination && !isFiltering) {
            const response = await supabase
                .from("quizzes_categories")
                .select(`*, quizzes(count)`, {
                    count: "exact",
                })
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
    }

    const response = await supabase
        .from("quizzes_categories")
        .select(`*, quizzes(count)`)
        .ilike("name", `%${config?.filters?.name || ""}%`)
        .neq("publishing_status", "ARCHIVED")
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return { data: response.data, count: response.count }
}
