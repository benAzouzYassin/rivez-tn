import { Database } from "@/types/database.types"
import {
    CodeCompletionContent,
    DebugCodeContent,
    MatchingPairsContent,
    MultipleChoiceContent,
    SingleChoiceContent,
} from "./schemas"
import { atom } from "jotai"

export const currentQuestionIndexAtom = atom(0)

export const failedQuestionsIdsAtom = atom<number[]>([])

export const questionsAtom = atom<QuestionType[]>([])

//types
export type QuestionType = {
    content:
        | SingleChoiceContent
        | MultipleChoiceContent
        | MatchingPairsContent
        | DebugCodeContent
        | CodeCompletionContent
} & Omit<Database["public"]["Tables"]["quizzes_questions"]["Row"], "content">
