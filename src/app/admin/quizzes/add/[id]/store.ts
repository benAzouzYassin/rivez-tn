import { create } from "zustand"
import {
    CodeCompletionContent,
    DebugCodeContent,
    MatchingPairsContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"

export type QuestionContentType =
    | (Omit<MultipleChoiceContent, "correct"> & {
          correctOptionsIndexes: number[]
      })
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

type State = {
    selectedQuestionId: string | null
    allQuestions: QuizQuestionType[]
    selectedQuestion: QuizQuestionType | null
}

type Actions = {
    setSelectedQuestionId: (id: string | null) => void
    setAllQuestions: (questions: QuizQuestionType[]) => void
    reset: () => void
}

type Store = State & Actions

const initialState: State = {
    selectedQuestionId: null,
    allQuestions: [],
    selectedQuestion: null,
}

const useQuizStore = create<Store>((set, get) => ({
    ...initialState,

    setSelectedQuestionId: (id) =>
        set((state) => ({
            selectedQuestionId: id,
            selectedQuestion:
                state.allQuestions.find((q) => q.localId === id) || null,
        })),

    setAllQuestions: (questions) =>
        set((state) => ({
            allQuestions: questions,
            selectedQuestion:
                questions.find((q) => q.localId === state.selectedQuestionId) ||
                null,
        })),

    reset: () => set(initialState),
}))

export default useQuizStore
