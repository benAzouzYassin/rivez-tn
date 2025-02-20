import { supabase } from "@/lib/supabase-client-side"

export async function deleteQuizById(id: number) {
    const response = await supabase
        .from("quizzes")
        .delete()
        .eq(`id`, id)
        .throwOnError()
    return response
}

export async function softDeleteQuizById(id: number) {
    const response = await supabase
        .from("quizzes")
        .update({
            publishing_status: "ARCHIVED",
        })
        .eq(`id`, id)
        .throwOnError()
    return response
}

export async function deleteQuizQuestions(params: { questionIds: number[] }) {
    const response = await supabase
        .from("quizzes_questions")
        .delete()
        .in("id", params.questionIds)
        .throwOnError()
    return response
}
