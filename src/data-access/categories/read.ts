import { supabase } from "@/lib/supabase-client-side"

export async function readCategoriesWithQuizzes() {
    const response = await supabase
        .from("quizzes_categories")
        .select(`*, quizzes(* ,quizzes_questions(count))`)
        .neq("quizzes.publishing_status", "ARCHIVED")
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
