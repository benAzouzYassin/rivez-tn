import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function readSubmissionsWithAllData(config?: {
    filters?: {
        username?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const isFiltering = !!config?.filters?.username

    if (config) {
        if (config?.pagination && !isFiltering) {
            const response = await supabase
                .from("quiz_submissions")
                .select(`*, quiz(*), user(email)`, {
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
                .throwOnError()
            return { data: response.data, count: response.count }
        }
    }

    const response = await supabase
        .from("quiz_submissions")
        .select(`*`)
        // .ilike("name", `%${config?.filters?.name || ""}%`)
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return { data: response.data, count: response.count }
}
