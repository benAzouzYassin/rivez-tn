import { supabase } from "@/lib/supabase-client-side"
import {
    FillInTheBlankContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import { Database } from "@/types/database.types"

export async function addQuestionsToQuiz(
    quizId: number,
    questions: {
        displayOrder: number
        content:
            | AddQuestionToQuizContentTypes["MatchingPairs"]
            | AddQuestionToQuizContentTypes["MultipleChoice"]
            | FillInTheBlankContent
        image: string
        question: string
        type: PossibleQuestionTypes
        layout: "vertical" | "horizontal"
        imageType: Database["public"]["Tables"]["quizzes_questions"]["Insert"]["image_type"]
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
            const codeSnippets = content?.codeSnippets

            return {
                image: q.image,
                type: q.type,
                quiz: quizId,
                question: q.question,
                layout: q.layout,
                image_type: q.imageType,
                display_order: q.displayOrder,
                content: {
                    correct,
                    options,
                    codeSnippets,
                } satisfies DbMultipleChoiceContent,
            }
        }
        if (q.type === "FILL_IN_THE_BLANK") {
            const content = q.content as FillInTheBlankContent | undefined

            return {
                image: q.image,
                type: q.type,
                quiz: quizId,
                question: q.question,
                layout: q.layout,
                image_type: q.imageType,
                display_order: q.displayOrder,
                content: content,
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
                layout: q.layout,
                image_type: q.imageType,
                display_order: q.displayOrder,
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
        console.log(formattedData)
        throw new Error("Some questions content is not valid")
    }
    const result = await supabase
        .from("quizzes_questions")
        .insert(formattedData.filter((q) => q !== null)) //we filter to make typescript happy we checked for the null questions in the previous lines
        .select("id")
        .throwOnError()
    return result
}

export async function updateQuiz(quizId: number, data: QuizUpdateType) {
    const result = await supabase
        .from("quizzes")
        .update(data)
        .eq(`id`, quizId)
        .select("id")
        .throwOnError()

    return result
}
export async function updateManyQuizzes(
    quizzesIds: number[],
    data: QuizUpdateType
) {
    const result = await supabase
        .from("quizzes")
        .update(data)
        .in(`id`, quizzesIds)
        .select("id")
        .throwOnError()

    return result
}

//types
type QuizUpdateType = Database["public"]["Tables"]["quizzes"]["Update"]

type AddQuestionToQuizContentTypes = {
    MultipleChoice: {
        options: {
            text: string
            localId: string
            isCorrect: boolean | null
        }[]
        codeSnippets: MultipleChoiceContent["codeSnippets"]
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
    codeSnippets: MultipleChoiceContent["codeSnippets"]
}
interface DbMatchingPairsContent {
    rightSideOptions: string[]
    leftSideOptions: string[]
    correct: string[][]
}

export async function updateQuizQuestions(
    questions: {
        displayOrder: number
        id: number
        quizId: number
        content:
            | AddQuestionToQuizContentTypes["MatchingPairs"]
            | AddQuestionToQuizContentTypes["MultipleChoice"]
            | FillInTheBlankContent

        image: string
        question: string
        type: PossibleQuestionTypes
        layout: "vertical" | "horizontal"
        imageType: Database["public"]["Tables"]["quizzes_questions"]["Insert"]["image_type"]
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
            const codeSnippets = content?.codeSnippets

            return {
                quiz: q.quizId,
                id: q.id,
                image: q.image,
                type: q.type,
                question: q.question,
                layout: q.layout,
                image_type: q.imageType,
                display_order: q.displayOrder,
                content: {
                    correct,
                    options,
                    codeSnippets,
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
                image_type: q.imageType,
                quiz: q.quizId,
                id: q.id,
                image: q.image,
                type: q.type,
                question: q.question,
                layout: q.layout,
                display_order: q.displayOrder,
                content: {
                    correct,
                    leftSideOptions:
                        content?.leftOptions.map((opt) => opt.text) || [],
                    rightSideOptions:
                        content?.rightOptions.map((opt) => opt.text) || [],
                } satisfies DbMatchingPairsContent,
            }
        }
        if (q.type === "FILL_IN_THE_BLANK") {
            const content = q.content as FillInTheBlankContent | undefined
            return {
                id: q.id,
                image: q.image,
                type: "FILL_IN_THE_BLANK",
                quiz: q.quizId,
                question: q.question,
                layout: q.layout,
                image_type: q.imageType,
                display_order: q.displayOrder,
                content: content,
            }
        }
        return null
    })
    if (formattedData.some((q) => !q)) {
        throw new Error("Some questions content is not valid")
    }
    const response = await supabase
        .from("quizzes_questions")
        .upsert(formattedData as any, {
            onConflict: "id",
            ignoreDuplicates: false,
        })
        .throwOnError()
    return response
}
