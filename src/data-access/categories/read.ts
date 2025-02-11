import { supabase } from "@/lib/supabase-client-side"

export async function readCategoriesWithQuizzes() {
    const response = await supabase
        .from("quizzes_categories")
        .select(`*, quizzes(* ,quizzes_questions(count))`)
        .in("quizzes.publishing_status", ["PUBLISHED"])
        .throwOnError()
    return response.data
}
export async function readCategories() {
    const response = await supabase
        .from("quizzes_categories")
        .select(`*`)
        .throwOnError()
    return response.data
}
