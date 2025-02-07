import {
    CodeCompletionContent,
    DebugCodeContent,
    MatchingPairsContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import { atom } from "jotai"

export const selectedQuestionIdAtom = atom<string | null>(null)

export const allQuestionsAtom = atom<QuizQuestionType[]>([])

export const selectedQuestionAtom = atom((get) => {
    const allQuestions = get(allQuestionsAtom)
    const selectedId = get(selectedQuestionIdAtom)

    return allQuestions.find((q) => q.localId === selectedId) || null
})
//types
export type QuestionContentType =
    | MultipleChoiceContent
    | MatchingPairsContent
    | DebugCodeContent
    | CodeCompletionContent

export type QuizQuestionType = {
    content: QuestionContentType
    localId: string
    questionText: string
    imageUrl: string | null
    type: PossibleQuestionTypes
}
