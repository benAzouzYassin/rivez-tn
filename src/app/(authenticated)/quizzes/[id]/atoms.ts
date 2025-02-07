import { Database } from "@/types/database.types"
import {
    CodeCompletionContent,
    DebugCodeContent,
    MatchingPairsContent,
    MultipleChoiceContent,
} from "@/schemas/questions-content"
import { atom } from "jotai"

export const currentQuestionIndexAtom = atom(0)

export const failedQuestionsIdsAtom = atom<number[]>([])

export const questionsAtom = atom<QuestionType[]>([])

//types
export type QuestionType = {
    content:
        | MultipleChoiceContent
        | MatchingPairsContent
        | DebugCodeContent
        | CodeCompletionContent
} & Omit<Database["public"]["Tables"]["quizzes_questions"]["Row"], "content">
