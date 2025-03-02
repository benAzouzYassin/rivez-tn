import { readQuizQuestions } from "@/data-access/quizzes/read"
import {
    MatchingPairsContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import { Database } from "@/types/database.types"
import { create } from "zustand"

interface State {
    allQuestions: QuizQuestionType[]
    selectedQuestionLocalId: string | null
    isLoadingData: boolean
    isLoadingError: boolean
    deletedQuestionsIds: number[]
}

interface Actions {
    loadQuizData: (quizId: number) => void
    setSelectedQuestion: (localId: string | null) => void
    setAllQuestions: (questions: QuizQuestionType[]) => void
    getQuestion: (localId: string) => QuizQuestionType | undefined
    removeQuestion: (localId: string) => void
    addQuestion: (question: QuizQuestionType) => void
    updateQuestion: (
        question: Partial<QuizQuestionType>,
        localId: string
    ) => void
    deleteMatchingPairsOption: (
        side: "right" | "left",
        optionId: string
    ) => void
    updateMatchingPairsOption: (params: {
        side: "right" | "left"
        value?: string
        optionId: string
        leftOptionLocalId?: string | null
    }) => void

    updateMultipleChoiceQuestionOption: (
        question: Partial<
            Omit<StateMultipleChoiceOptions["options"][number], "localId">
        >,
        questionLocalId: string,
        optionLocalId: string
    ) => void
    addMatchingPairsOption: (side: "left" | "right") => void
    reset: () => void
}

type Store = State & Actions

const initialState: State = {
    deletedQuestionsIds: [],
    isLoadingData: true,
    isLoadingError: false,
    allQuestions: [],
    selectedQuestionLocalId: null,
}

const useUpdateQuizStore = create<Store>((set, get) => ({
    ...initialState,

    setAllQuestions: (allQuestions) => set({ allQuestions }),

    getQuestion: (localId: string) =>
        get().allQuestions.find((q) => q.localId === localId),

    removeQuestion: (localId: string) => {
        set((state) => {
            const isSelected = state.selectedQuestionLocalId === localId
            const questionId = state.allQuestions.find(
                (q) => q.localId === localId
            )?.questionId
            const updated = state.allQuestions.filter(
                (q) => q.localId !== localId
            )
            return {
                allQuestions: updated,
                selectedQuestionLocalId: isSelected
                    ? updated[updated.length - 1]?.localId || null
                    : state.selectedQuestionLocalId,
                deletedQuestionsIds: questionId
                    ? [...state.deletedQuestionsIds, questionId]
                    : state.deletedQuestionsIds,
            }
        })
    },

    addQuestion: (question: QuizQuestionType) =>
        set((state) => {
            return {
                allQuestions: [...state.allQuestions, question],
                selectedQuestionLocalId: question.localId,
            }
        }),

    updateQuestion: (updatedData, id) => {
        set((state) => ({
            allQuestions: state.allQuestions.map((q) =>
                q.localId === id ? { ...q, ...updatedData } : q
            ),
        }))
    },

    addMatchingPairsOption: (side: "right" | "left") => {
        if (side === "left") {
            set((state) => {
                return {
                    allQuestions: state.allQuestions.map((q) => {
                        if (
                            q.localId === state.selectedQuestionLocalId &&
                            q.type == "MATCHING_PAIRS"
                        ) {
                            const content = q.content as
                                | StateMatchingPairsOptions
                                | undefined
                            return {
                                ...q,
                                content: {
                                    rightOptions: content?.rightOptions || [],
                                    leftOptions: [
                                        ...(content?.leftOptions || []),
                                        {
                                            localId: crypto.randomUUID(),
                                            rightSideOptionLocalId: null,
                                            text: "",
                                        },
                                    ],
                                },
                            }
                        }
                        return q
                    }),
                }
            })
        }
        if (side === "right") {
            set((state) => {
                return {
                    allQuestions: state.allQuestions.map((q) => {
                        if (
                            q.localId === state.selectedQuestionLocalId &&
                            q.type == "MATCHING_PAIRS"
                        ) {
                            const content = q.content as
                                | StateMatchingPairsOptions
                                | undefined
                            return {
                                ...q,
                                content: {
                                    leftOptions: content?.leftOptions || [],
                                    rightOptions: [
                                        ...(content?.rightOptions || []),
                                        {
                                            localId: crypto.randomUUID(),
                                            text: "",
                                            leftOptionLocalId: null,
                                        },
                                    ],
                                },
                            }
                        }
                        return q
                    }),
                }
            })
        }
    },
    updateMatchingPairsOption: ({ optionId, side, value, leftOptionLocalId }) =>
        set((state) => {
            return {
                allQuestions: state.allQuestions.map((q) => {
                    if (q.localId === state.selectedQuestionLocalId) {
                        const content = q.content as
                            | StateMatchingPairsOptions
                            | undefined

                        if (side === "left") {
                            return {
                                ...q,
                                content: {
                                    leftOptions:
                                        content?.leftOptions.map((opt) => {
                                            if (opt.localId === optionId) {
                                                return {
                                                    ...opt,
                                                    text:
                                                        value === undefined
                                                            ? opt.text
                                                            : value,
                                                }
                                            }
                                            return opt
                                        }) || [],
                                    rightOptions: content?.rightOptions || [],
                                },
                            }
                        } else {
                            return {
                                ...q,
                                content: {
                                    leftOptions: content?.leftOptions || [],
                                    rightOptions:
                                        content?.rightOptions.map((opt) => {
                                            if (opt.localId === optionId) {
                                                return {
                                                    ...opt,

                                                    text:
                                                        value === undefined
                                                            ? opt.text
                                                            : value,
                                                    leftOptionLocalId:
                                                        leftOptionLocalId ===
                                                        undefined
                                                            ? opt.leftOptionLocalId
                                                            : leftOptionLocalId,
                                                }
                                            }
                                            return opt
                                        }) || [],
                                },
                            }
                        }
                    }
                    return q
                }),
            }
        }),
    deleteMatchingPairsOption: (side, optionId) =>
        set((state) => ({
            allQuestions: state.allQuestions.map((q) => {
                if (q.localId === state.selectedQuestionLocalId) {
                    const content = q.content as
                        | StateMatchingPairsOptions
                        | undefined
                    if (side === "right") {
                        return {
                            ...q,
                            content: {
                                leftOptions: content?.leftOptions || [],
                                rightOptions:
                                    content?.rightOptions.filter(
                                        (opt) => opt.localId !== optionId
                                    ) || [],
                            },
                        }
                    } else {
                        return {
                            ...q,
                            content: {
                                leftOptions:
                                    content?.leftOptions.filter(
                                        (opt) => opt.localId !== optionId
                                    ) || [],
                                rightOptions: content?.rightOptions || [],
                            },
                        }
                    }
                }
                return q
            }),
        })),
    updateMultipleChoiceQuestionOption: (
        updatedOption,
        questionLocalId,
        optionLocalId
    ) => {
        set((state) => ({
            allQuestions: state.allQuestions.map((question) => {
                if (question.localId !== questionLocalId) return question
                if (question.type !== "MULTIPLE_CHOICE") return question
                const content = question.content as StateMultipleChoiceOptions
                const updatedOptions = content.options.map((option) =>
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

    loadQuizData: async (quizId: number) => {
        set(initialState)
        try {
            const data = await readQuizQuestions({
                quizId,
            })
            const formattedQuestions = data
                .map((q) => {
                    let contentForState = null as
                        | StateMatchingPairsOptions
                        | StateMultipleChoiceOptions
                        | null

                    if (q.type === "MATCHING_PAIRS") {
                        const content = q.content as MatchingPairsContent
                        const leftOptions = content.leftSideOptions.map(
                            (opt) => ({
                                localId: crypto.randomUUID(),
                                text: opt,
                            })
                        )
                        const rightOptions = content.rightSideOptions.map(
                            (opt) => {
                                const pairedLeftOption = content.correct
                                    .find((pair) => pair.includes(opt))
                                    ?.filter((item) => item !== opt)[0]
                                const pairedLeftOptionLocalId =
                                    leftOptions.find(
                                        (item) => item.text === pairedLeftOption
                                    )?.localId
                                return {
                                    localId: crypto.randomUUID(),
                                    text: opt,
                                    leftOptionLocalId:
                                        pairedLeftOptionLocalId || null,
                                }
                            }
                        )
                        contentForState = {
                            leftOptions,
                            rightOptions,
                        } satisfies StateMatchingPairsOptions
                    }
                    let codeSnippets: QuizQuestionType["codeSnippets"]
                    if (q.type === "MULTIPLE_CHOICE") {
                        const content = q.content as MultipleChoiceContent
                        codeSnippets = content.codeSnippets
                        contentForState = {
                            options: content.options.map((opt) => ({
                                isCorrect: content.correct.includes(opt),
                                localId: crypto.randomUUID(),
                                text: opt,
                            })),
                        } satisfies StateMultipleChoiceOptions
                    }
                    if (!contentForState) return null
                    return {
                        content: contentForState,
                        imageUrl: q.image,
                        layout: (q.layout as any) || "horizontal",
                        localId: String(q.id),
                        questionId: q.id,
                        questionText: q.question,
                        type: q.type as any,
                        codeSnippets,
                        imageType: q.image_type,
                    } satisfies QuizQuestionType
                })
                .filter((q) => q !== null)
            set({
                isLoadingData: false,
                isLoadingError: false,
                allQuestions: formattedQuestions,
                selectedQuestionLocalId: formattedQuestions?.[0]?.localId,
            })
        } catch (error) {
            console.error(error)
            set({ isLoadingData: false, isLoadingError: true })
        }
    },

    reset: () => set(initialState),
}))

export default useUpdateQuizStore

export interface QuizQuestionType {
    questionId: number | null
    content: StateMultipleChoiceOptions | StateMatchingPairsOptions
    localId: string
    questionText: string
    imageUrl: string | null
    type: PossibleQuestionTypes
    layout: "horizontal" | "vertical"
    imageType: Database["public"]["Tables"]["quizzes_questions"]["Insert"]["image_type"]
    codeSnippets: MultipleChoiceContent["codeSnippets"] | null
}

export interface StateMultipleChoiceOptions {
    options: { text: string; localId: string; isCorrect: boolean | null }[]
}
export interface StateMatchingPairsOptions {
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
