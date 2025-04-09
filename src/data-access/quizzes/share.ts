import { supabase } from "@/lib/supabase-client-side"

export async function shareQuiz(params: { userId: string; quizId: number }) {
    const { data } = await supabase
        .from("quizzes_shares")
        .select("*")
        .eq("quiz_id", params.quizId)
        .eq("user_id", params.userId)
    if (!data?.length) {
        await supabase
            .from("quizzes_shares")
            .insert({
                quiz_id: params.quizId,
                user_id: params.userId,
            })
            .throwOnError()
    }
}
