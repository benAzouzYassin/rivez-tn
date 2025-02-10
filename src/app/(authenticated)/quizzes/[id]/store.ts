import { create } from "zustand"
import { Database } from "@/types/database.types"
import {
    CodeCompletionContent,
    DebugCodeContent,
    MatchingPairsContent,
    MultipleChoiceContent,
} from "@/schemas/questions-content"

interface State {
    currentQuestionIndex: number
    failedQuestionsIds: number[]
    questions: QuestionType[]
}

interface Actions {
    setCurrentQuestionIndex: (index: number) => void
    addFailedQuestionIds: (id: number[]) => void
    setQuestions: (questions: QuestionType[]) => void
    incrementQuestionIndex: () => void
    reset: () => void
}

type Store = Actions & State
const initialState = {
    currentQuestionIndex: 0,
    failedQuestionsIds: [],
    questions: [],
}

export const useQuestionsStore = create<Store>((set) => ({
    ...initialState,
    setCurrentQuestionIndex: (index) =>
        set(() => ({ currentQuestionIndex: index })),

    addFailedQuestionIds: (ids) =>
        set((state) => ({
            failedQuestionsIds: [...state.failedQuestionsIds, ...ids],
        })),
    setQuestions: (questions) => set(() => ({ questions })),
    incrementQuestionIndex: () =>
        set((state) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
        })),
    reset: () => set(initialState),
}))

export type QuestionType = {
    content:
        | MultipleChoiceContent
        | MatchingPairsContent
        | DebugCodeContent
        | CodeCompletionContent
} & Omit<Database["public"]["Tables"]["quizzes_questions"]["Row"], "content">
