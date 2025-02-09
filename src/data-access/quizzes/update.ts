import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function addQuestionsToQuiz(
    quizId: number,
    questions: {
        content: any
        image: string
        question: string
        type: "MULTIPLE_CHOICE" | "MATCHING_PAIRS"
    }[]
) {
    const formattedData = questions.map((q) => {
        if (q.type === "MULTIPLE_CHOICE") {
            const content = q.content as
                | {
                      options: {
                          text: string
                          localId: string
                          isCorrect: boolean | null
                      }[]
                  }
                | undefined

            const correct =
                content?.options
                    .filter((opt) => opt.isCorrect === true)
                    .map((opt) => opt.text) || []
            const options = content?.options.map((opt) => opt.text) || []

            return {
                image: q.image,
                type: q.type,
                quiz: quizId,
                question: q.question,
                content: {
                    correct,
                    options,
                } satisfies MultipleChoiceContent,
            }
        }
        return null
    })
    if (formattedData.some((q) => !q)) {
        throw new Error("Some questions content is not valid")
    }
    const result = await supabase
        .from("quizzes_questions")
        .insert(formattedData.filter((q) => q !== null)) //we filter to make typescript happy we checked for the null questions in the previous lines
        .select("id")
        .throwOnError()
    return result
}
interface MultipleChoiceContent {
    correct: string[]
    options: string[]
}

// interface MatchingPairsContent {
//     options: any //TODO change this after implementing the matching pair
// }

export async function updateQuizPublishingStatus(
    quizId: number,
    status: PublishingQuizStatus
) {
    const result = await supabase
        .from("quizzes")
        .update({
            publishing_status: status,
        })
        .eq(`id`, quizId)
        .select("id")
        .throwOnError()

    return result
}

type PublishingQuizStatus = Exclude<
    Database["public"]["Tables"]["quizzes"]["Update"]["publishing_status"],
    undefined
>
