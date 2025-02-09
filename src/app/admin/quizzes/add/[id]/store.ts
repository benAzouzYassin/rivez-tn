import { create } from "zustand"
import { PossibleQuestionTypes } from "@/schemas/questions-content"

interface State {
    allQuestions: QuizQuestionType[]
    selectedQuestionLocalId: string | null
}

interface Actions {
    setSelectedQuestion: (localId: string | null) => void
    setAllQuestions: (questions: QuizQuestionType[]) => void
    getQuestion: (localId: string) => QuizQuestionType | undefined
    removeQuestion: (localId: string) => void
    addQuestion: (question: QuizQuestionType) => void
    updateQuestion: (
        question: Partial<QuizQuestionType>,
        localId: string
    ) => void
    updateMultipleChoiceQuestionOption: (
        question: Partial<
            Omit<MultipleChoiceOptions["options"][number], "localId">
        >,
        questionLocalId: string,
        optionLocalId: string
    ) => void

    reset: () => void
}

type Store = State & Actions

const initialState: State = {
    allQuestions: [],
    selectedQuestionLocalId: null,
}

const useQuizStore = create<Store>((set, get) => ({
    ...initialState,

    setAllQuestions: (allQuestions) => set({ allQuestions }),

    getQuestion: (localId: string) =>
        get().allQuestions.find((q) => q.localId === localId),

    removeQuestion: (localId: string) => {
        set((state) => {
            const isSelected = state.selectedQuestionLocalId === localId
            // makes sure there to select the first question if the removed item is the selected one
            const updated = state.allQuestions.filter(
                (q) => q.localId !== localId
            )
            return {
                allQuestions: updated,
                selectedQuestionLocalId: isSelected
                    ? updated[updated.length - 1]?.localId || null
                    : state.selectedQuestionLocalId,
            }
        })
    },

    addQuestion: (question: QuizQuestionType) =>
        set((state) => {
            return {
                allQuestions: [...state.allQuestions, question],
                selectedQuestionLocalId: !state.selectedQuestionLocalId
                    ? question.localId
                    : state.selectedQuestionLocalId,
            }
        }),

    updateQuestion: (updatedData, id) => {
        set((state) => ({
            allQuestions: state.allQuestions.map((q) =>
                q.localId === id ? { ...q, ...updatedData } : q
            ),
        }))
    },
    updateMultipleChoiceQuestionOption: (
        updatedOption,
        questionLocalId,
        optionLocalId
    ) => {
        set((state) => ({
            allQuestions: state.allQuestions.map((question) => {
                if (question.localId !== questionLocalId) return question

                if (question.type !== "MULTIPLE_CHOICE") return question

                const updatedOptions = question.content.options.map((option) =>
                    option.localId === optionLocalId
                        ? { ...option, ...updatedOption }
                        : option
                )

                return {
                    ...question,
                    content: {
                        ...question.content,
                        options: updatedOptions,
                    },
                }
            }),
        }))
    },

    setSelectedQuestion: (selectedQuestionLocalId: string | null) =>
        set({ selectedQuestionLocalId }),

    reset: () => set(initialState),
}))

export default useQuizStore

export interface QuizQuestionType {
    content: MultipleChoiceOptions
    localId: string
    questionText: string
    imageUrl: string | null
    type: PossibleQuestionTypes
}

interface MultipleChoiceOptions {
    options: { text: string; localId: string; isCorrect: boolean | null }[]
}
