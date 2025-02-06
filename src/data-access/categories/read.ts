import { supabase } from "@/lib/supabase-client-side"

export async function readCategoriesWithQuizzes() {
    const response = await supabase
        .from("categories")
        .select(`*, quizzes(* ,quizzes_questions(count))`)
        .throwOnError()
    return response.data
}
export async function readCategories() {
    const response = await supabase
        .from("categories")
        .select(`*`)
        .throwOnError()
    return response.data
}
