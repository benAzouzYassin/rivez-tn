import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createQuizSubmission(params: InsertType) {
    const { data } = await supabase
        .from("quiz_submissions")
        .insert(params)
        .select("id")
        .throwOnError()

    return data
}

type InsertType = Database["public"]["Tables"]["quiz_submissions"]["Insert"]
