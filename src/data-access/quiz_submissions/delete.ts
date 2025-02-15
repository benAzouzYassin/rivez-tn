import { supabase } from "@/lib/supabase-client-side"

export async function deleteQuizSubmissionById(id: number) {
    const response = await supabase
        .from("quiz_submissions")
        .delete()
        .eq(`id`, id)
        .throwOnError()
    return response
}
