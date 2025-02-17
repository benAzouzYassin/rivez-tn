import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function createCategoryWithQuizzes(params: {
    category: InsetCategoryType
    quizzes: number[]
}) {
    try {
        const { data } = await supabase
            .from("quizzes_categories")
            .insert(params.category)
            .select("id")
            .throwOnError()
        const categoryId = data[0].id
        //adding quizzes
        const { error: quizzesError } = await supabase
            .from("quizzes")
            .update({ category: categoryId })
            .in(`id`, params.quizzes)

        if (quizzesError) {
            await supabase
                .from("quizzes_categories")
                .delete()
                .eq("id", categoryId)
            throw new Error("Error while update the quizzes.")
        }

        return categoryId
    } catch (error) {
        console.error(error)
        return null
    }
}

type InsetCategoryType =
    Database["public"]["Tables"]["quizzes_categories"]["Insert"]
