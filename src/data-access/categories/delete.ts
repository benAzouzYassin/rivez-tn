import { supabase } from "@/lib/supabase-client-side"

export async function softDeleteCategoryById(id: number) {
    const response = await supabase
        .from("quizzes_categories")
        .update({
            publishing_status: "ARCHIVED",
        })
        .eq(`id`, id)
        .throwOnError()
    return response
}
