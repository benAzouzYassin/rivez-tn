import { supabase } from "@/lib/supabase-client-side"

export async function deleteMindmapById(id: number) {
    const response = await supabase
        .from("mindmaps")
        .delete()
        .eq(`id`, id)
        .throwOnError()
    return response
}
