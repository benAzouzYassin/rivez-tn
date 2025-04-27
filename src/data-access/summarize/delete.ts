import { supabase } from "@/lib/supabase-client-side"

export async function deleteSummarizationById(id: number) {
    const response = await supabase
        .from("summarizations")
        .delete()
        .eq(`id`, id)
        .throwOnError()
    return response
}
