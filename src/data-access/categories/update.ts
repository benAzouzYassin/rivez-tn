import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function updateCategory(
    categoryId: number,
    data: CategoryUpdateType
) {
    const result = await supabase
        .from("quizzes_categories")
        .update(data)
        .eq(`id`, categoryId)
        .select("id")
        .throwOnError()

    return result
}
//types
type CategoryUpdateType =
    Database["public"]["Tables"]["quizzes_categories"]["Update"]
