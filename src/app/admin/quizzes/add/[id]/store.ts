import { generateQuiz } from "@/data-access/quizzes/generate"
import { PossibleQuestionTypes } from "@/schemas/questions-content"
import { create } from "zustand"
import { getRightOptionPairLocalId } from "./utils"

interface State {
    allQuestions: QuizQuestionType[]
    selectedQuestionLocalId: string | null
    isGeneratingWithAi: boolean
    isGenerationError: boolean
}

interface Actions {
    generateQuizWithAi: (data: {
        category: string | null
        name: string
        mainTopic: string
        language: string | null
        maxQuestions: number | null
        minQuestions: number | null
        rules: string | null
        pdfName: string | null
        pdfUrl: string | null
    }) => void
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
            Omit<MultipleChoiceOptions["options"][number], "localId">
        >,
        questionLocalId: string,
        optionLocalId: string
    ) => void
    addMatchingPairsOption: (side: "left" | "right") => void
    reset: () => void
}

type Store = State & Actions

const initialState: State = {
    isGeneratingWithAi: false,
    isGenerationError: false,
    allQuestions: [
        {
            content: {
                options: [
                    {
                        isCorrect: true,
                        localId: crypto.randomUUID(),
                        text: "",
                    },
                ],
            },
            imageUrl: null,
            localId: "1",
            questionText: "",
            type: "MULTIPLE_CHOICE",
            layout: "horizontal",
        },
    ],
    selectedQuestionLocalId: "1",
}

const useQuizStore = create<Store>((set, get) => ({
    ...initialState,
    generateQuizWithAi: async (data) => {
        try {
            set({ ...initialState, isGeneratingWithAi: true })
            const { questions } = await generateQuiz(data)
            const questionsForState = questions.map((q) => {
                const leftOptions =
                    q.type === "MATCHING_PAIRS"
                        ? q.content.leftSideOptions.map((opt) => ({
                              text: opt,
                              localId: crypto.randomUUID(),
                          }))
                        : []

                const rightOptions =
                    q.type === "MATCHING_PAIRS"
                        ? q.content.rightSideOptions.map((opt) => ({
                              text: opt,
                              localId: crypto.randomUUID(),
                              leftOptionLocalId: getRightOptionPairLocalId(
                                  q.content.correct,
                                  leftOptions,
                                  opt
                              ),
                          }))
                        : []
                const options =
                    q.type === "MULTIPLE_CHOICE"
                        ? q.content.options.map((opt) => ({
                              text: opt,
                              localId: crypto.randomUUID(),
                              isCorrect: q.content.correct.includes(opt),
                          }))
                        : []
                return {
                    content:
                        q.type === "MULTIPLE_CHOICE"
                            ? {
                                  options,
                              }
                            : {
                                  leftOptions,
                                  rightOptions,
                              },
                    localId: crypto.randomUUID(),
                    questionText: q.questionText,
                    imageUrl: null,
                    type: q.type,
                    layout: "horizontal",
                }
            })
            set({
                selectedQuestionLocalId: questionsForState[0].localId,
                isGeneratingWithAi: false,
                allQuestions: questionsForState as any,
            })
        } catch (error) {
            set({ isGeneratingWithAi: false, isGenerationError: true })
        }
    },
    setAllQuestions: (allQuestions) => set({ allQuestions }),

    getQuestion: (localId: string) =>
        get().allQuestions.find((q) => q.localId === localId),

    removeQuestion: (localId: string) => {
        set((state) => {
            const isSelected = state.selectedQuestionLocalId === localId
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
                                | MatchingPairsOptions
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
                                | MatchingPairsOptions
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
                            | MatchingPairsOptions
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
                        | MatchingPairsOptions
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
                const content = question.content as MultipleChoiceOptions
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

    reset: () => set(initialState),
}))

export default useQuizStore

export interface QuizQuestionType {
    content: MultipleChoiceOptions | MatchingPairsOptions
    localId: string
    questionText: string
    imageUrl: string | null
    type: PossibleQuestionTypes
    layout: "horizontal" | "vertical"
}

export interface MultipleChoiceOptions {
    options: { text: string; localId: string; isCorrect: boolean | null }[]
}
export interface MatchingPairsOptions {
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
