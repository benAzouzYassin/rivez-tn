import { supabase } from "@/lib/supabase-client-side"

export async function readMindmaps(config: {
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

    let query = supabase.from("mindmaps").select("*", { count: "exact" })

    if (isFiltering) {
        query = query.ilike("name", `%${filters.name}%`)
    }

    query = query.neq("publishing_status", "ARCHIVED")

    if (!isAdmin) {
        query = query.eq("author_id", userId)
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

    const response = await query.throwOnError()
    return { data: response.data, count: response.count }
}

export async function readMindMapById(params: { id: number }) {
    const response = await supabase
        .from("mindmaps")
        .select(`*`)
        .eq("id", params.id)
        .single()
        .throwOnError()
    return response.data
}
export async function readNodeExplanation(params: { nodeId: string }) {
    const response = await supabase
        .from("mindmap_node_explanation")
        .select(`*`)
        .eq("node_id", params.nodeId)
        .single()
        .throwOnError()
    return response.data
}
