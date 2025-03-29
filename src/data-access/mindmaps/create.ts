import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createMindMap(
    paramas: Database["public"]["Tables"]["mindmaps"]["Insert"]
) {
    const { data } = await supabase
        .from("mindmaps")
        .insert(paramas)
        .throwOnError()

    return data
}

export async function createNodeExplanation(
    paramas: Database["public"]["Tables"]["mindmap_node_explanation"]["Insert"]
) {
    const { data } = await supabase
        .from("mindmap_node_explanation")
        .insert(paramas)
        .throwOnError()

    return data
}
