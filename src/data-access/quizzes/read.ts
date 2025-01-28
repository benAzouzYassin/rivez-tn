import { supabase } from "@/lib/supbase-client"

export async function readQuizzesWithQuestionsAndOptions() {
    const quizzes = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*,  quizzes_questions_options(*))`)
        .throwOnError()

    return quizzes.data
}
export async function readQuizzesWithQuestions() {
    const quizzes = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*)`)
        .throwOnError()

    return quizzes.data
}

export async function readQuizWithQuestionsAndOptionsById(id: number) {
    const quizzes = await supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*,  quizzes_questions_options(*))`)
        .eq(`id`, id)
        .single()
        .throwOnError()

    return quizzes.data
}
