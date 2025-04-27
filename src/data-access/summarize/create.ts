import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createSummarization(paramas: InsetType) {
    const { data } = await supabase
        .from("summarizations")
        .insert(paramas)
        .select("id")
        .throwOnError()

    return data
}

type InsetType = Database["public"]["Tables"]["summarizations"]["Insert"]
