import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function readSummaries(config: {
    isAdmin: boolean
    userId: string
    filters?: { name?: string | null }
    pagination?: { currentPage: number; itemsPerPage: number }
}) {
    if (!config) throw new Error("Invalid configuration provided.")

    const { isAdmin, userId, filters, pagination } = config
    const isFiltering = !!filters?.name
    const start = pagination
        ? (pagination.currentPage - 1) * pagination.itemsPerPage
        : undefined
    const end = pagination
        ? (start || 0) + pagination.itemsPerPage - 1
        : undefined

    const selectedFields = isAdmin ? "*,user_id(*)" : "*"
    let query = supabase
        .from("summarizations")
        .select(selectedFields, { count: "exact" })

    if (isFiltering) {
        query = query.ilike("name", `%${filters.name}%`)
    }

    if (!isAdmin) {
        query = query.eq("user_id", userId)
    }

    if (
        pagination &&
        !isFiltering &&
        start !== undefined &&
        end !== undefined
    ) {
        query = query.range(start, end)
    }

    query = query.order("created_at", { ascending: false })

    const response = (await query.throwOnError()) as any
    const data =
        response.data as (Database["public"]["Tables"]["summarizations"]["Row"] & {
            user_id:
                | Database["public"]["Tables"]["user_profiles"]["Row"]
                | number
        })[]
    return { data: data, count: response.count as number }
}
export async function readSummaryById(params: { id: number }) {
    const response = await supabase
        .from("summarizations")
        .select(`*`)
        .eq("id", params.id)
        .single()
        .throwOnError()
    return response.data
}
