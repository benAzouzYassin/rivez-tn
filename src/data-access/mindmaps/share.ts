import { supabase } from "@/lib/supabase-client-side"

export async function attachSharedMindmapToUser(params: {
    userId: string
    mindmapId: number
}) {
    const { data } = await supabase
        .from("mindmap_shares")
        .select("*")
        .eq("mindmap_id", params.mindmapId)
        .eq("shared_with", params.userId)
    if (!data?.length) {
        await supabase
            .from("mindmap_shares")
            .insert({
                mindmap_id: params.mindmapId,
                shared_with: params.userId,
            })
            .throwOnError()
    }
}
