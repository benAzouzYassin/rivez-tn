import { supabase } from "@/lib/supbase-client"

export async function readCategoriesWithQuizzes() {
    const response = await supabase
        .from("categories")
        .select(`*, quizzes(* ,quizzes_questions(count))`)
        .throwOnError()
    return response.data
}
