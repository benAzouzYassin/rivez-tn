import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createQuiz(paramas: InsetQuizType) {
    const { data } = await supabase
        .from("quizzes")
        .insert(paramas)
        .select("id")
        .throwOnError()

    return data
}

type InsetQuizType = Database["public"]["Tables"]["quizzes"]["Insert"]
