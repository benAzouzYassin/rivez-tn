import { supabase } from "@/lib/supbase-client"
import { QueryData } from "@supabase/supabase-js"

export async function readQuizzes() {
    const quizzes = supabase
        .from("quizzes")
        .select(`*, quizzes_questions(*,  quizzes_questions_options(*))`)

    type QuizzesType = QueryData<typeof quizzes>

    const { data, error } = await quizzes

    return {
        data: data as QuizzesType | null,
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
