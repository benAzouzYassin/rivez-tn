import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function updateMindmap(
    mindmapId: number,
    { author_id, ...data }: Database["public"]["Tables"]["mindmaps"]["Update"]
) {
    const result = await supabase
        .from("mindmaps")
        .update({ ...data })
        .eq(`id`, mindmapId)
        .select("id")
        .throwOnError()

    return result
}
