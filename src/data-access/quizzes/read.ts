import { supabase } from "@/lib/supbase-client"

export async function readQuizzesWithQuestions() {
    const quizzes = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .throwOnError()

    return quizzes.data
}

export async function readQuizWithQuestionsById(id: number) {
    const quizzes = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .eq(`id`, id)
        .single()
        .throwOnError()

    return quizzes.data
}
