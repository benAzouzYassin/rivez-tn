import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createQuizSubmissionAnswers(params: InsertType[]) {
    const { data } = await supabase
        .from("quiz_submission_answers")
        .insert(params)
        .throwOnError()

    return data
}

type InsertType =
    Database["public"]["Tables"]["quiz_submission_answers"]["Insert"]
