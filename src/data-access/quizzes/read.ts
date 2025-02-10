import { supabase } from "@/lib/supabase-client-side"

export async function readQuizWithQuestionsById(id: number) {
    const response = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .eq(`id`, id)
        .single()
        .throwOnError()
    return response.data
}

export async function readQuizzesWithCategory() {
    const response = await supabase
        .from("quizzes")
        .select(`*, category(*),quizzes_questions(count)`)
        .throwOnError()
    return response.data
}
export type QuizWithCategory = Awaited<
    ReturnType<typeof readQuizzesWithCategory>
>[number]
