import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function addQuestionsToQuiz(
    quizId: number,
    questions: {
        content:
            | AddQuestionToQuizContentTypes["MatchingPairs"]
            | AddQuestionToQuizContentTypes["MultipleChoice"]
        image: string
        question: string
        type: "MULTIPLE_CHOICE" | "MATCHING_PAIRS"
    }[]
) {
    const formattedData = questions.map((q) => {
        if (q.type === "MULTIPLE_CHOICE") {
            const content = q.content as
                | AddQuestionToQuizContentTypes["MultipleChoice"]
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
                } satisfies DbMultipleChoiceContent,
            }
        }
        if (q.type === "MATCHING_PAIRS") {
            const content = q.content as
                | AddQuestionToQuizContentTypes["MatchingPairs"]
                | undefined
            const correct =
                content?.rightOptions
                    .map((opt) => {
                        return [
                            opt.text,
                            content.leftOptions.find(
                                (leftOpt) =>
                                    leftOpt.localId === opt.leftOptionLocalId
                            )?.text,
                        ]
                    })
                    .filter((item) =>
                        item.every(
                            (item) => item !== null && item !== undefined
                        )
                    ) || []

            return {
                image: q.image,
                type: q.type,
                quiz: quizId,
                question: q.question,
                content: {
                    correct,
                    leftSideOptions:
                        content?.leftOptions.map((opt) => opt.text) || [],
                    rightSideOptions:
                        content?.rightOptions.map((opt) => opt.text) || [],
                } satisfies DbMatchingPairsContent,
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

//types
type PublishingQuizStatus = Exclude<
    Database["public"]["Tables"]["quizzes"]["Update"]["publishing_status"],
    undefined
>

type AddQuestionToQuizContentTypes = {
    MultipleChoice: {
        options: {
            text: string
            localId: string
            isCorrect: boolean | null
        }[]
    }
    MatchingPairs: {
        leftOptions: {
            text: string
            localId: string
        }[]
        rightOptions: {
            text: string
            localId: string
            leftOptionLocalId: string | null
        }[]
    }
}
interface DbMultipleChoiceContent {
    correct: string[]
    options: string[]
}
interface DbMatchingPairsContent {
    rightSideOptions: string[]
    leftSideOptions: string[]
    correct: string[][]
}
