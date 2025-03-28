import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createMindMap(paramas: InsetQuizType) {
    const { data } = await supabase
        .from("mindmaps")
        .insert(paramas)
        .throwOnError()

    return data
}

type InsetQuizType = Database["public"]["Tables"]["mindmaps"]["Insert"]
