import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

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

    const selectedFields = isAdmin ? "*,author_id(*)" : "*"
    let query = supabase
        .from("mindmaps")
        .select(selectedFields, { count: "exact" })

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

    const response = (await query.throwOnError()) as any
    const data =
        response.data as (Database["public"]["Tables"]["mindmaps"]["Row"] & {
            author_id:
                | Database["public"]["Tables"]["user_profiles"]["Row"]
                | number
        })[]
    return { data: data, count: response.count as number }
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

export async function readLastNMindmaps(number: number, userId: string) {
    const response = await supabase
        .from("mindmaps")
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

export async function readSharedMindmaps(config: {
    isAdmin: boolean
    userId: string
    filters?: { name?: string | null }
    pagination?: { currentPage: number; itemsPerPage: number }
}) {
    if (!config) throw new Error("Invalid configuration provided.")

    const { userId, filters, pagination } = config
    const isFiltering = !!filters?.name
    const start = pagination
        ? (pagination.currentPage - 1) * pagination.itemsPerPage
        : undefined
    const end = pagination
        ? (start || 0) + pagination.itemsPerPage - 1
        : undefined
    const selectedFields = config.isAdmin
        ? "*,mindmaps(*,author_id(*))"
        : "*,mindmaps(*)"

    let query = supabase
        .from("mindmap_shares")
        .select(selectedFields, { count: "exact" })
        .neq("mindmaps.publishing_status", "ARCHIVED")
        .eq("shared_with", userId)

    if (isFiltering) {
        query = query.ilike("mindmaps.name", `%${filters.name}%`)
    }

    if (
        pagination &&
        !isFiltering &&
        start !== undefined &&
        end !== undefined
    ) {
        query = query.range(start, end, { referencedTable: "mindmaps" })
    }

    query = query.order("created_at", {
        ascending: false,
        referencedTable: "mindmaps",
    })

    const response = (await query.throwOnError()) as any
    const data = response.data
        .flatMap((item: any) => item.mindmaps)
        .filter(
            (item: any) => item !== null
        ) as (Database["public"]["Tables"]["mindmaps"]["Row"] & {
        author_id: Database["public"]["Tables"]["user_profiles"]["Row"] | number
    })[]
    return {
        data,
        count: response.count,
    }
}
