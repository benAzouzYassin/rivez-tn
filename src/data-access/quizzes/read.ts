import { supabase } from "@/lib/supbase-client"

export async function readQuizzesWithQuestions() {
    const response = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .throwOnError()
    return response.data
}

export async function readQuizWithQuestionsById(id: number) {
    const response = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .eq(`id`, id)
        .single()
        .throwOnError()
    return response.data
}
