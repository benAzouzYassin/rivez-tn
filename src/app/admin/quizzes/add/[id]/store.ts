import { generateQuiz } from "@/data-access/quizzes/generate"
import { PossibleQuestionTypes } from "@/schemas/questions-content"
import { create } from "zustand"
import { getRightOptionPairLocalId } from "./utils"
import { wait } from "@/utils/wait"
import { shuffleArray } from "@/utils/array"

interface State {
    allQuestions: QuizQuestionType[]
    selectedQuestionLocalId: string | null
    isGeneratingWithAi: boolean
    isGenerationError: boolean
    shadowQuestionsCount: number
}

interface Actions {
    generateQuizWithAi: (
        data: {
            category: string | null
            name: string
            mainTopic: string
            language: string | null
            maxQuestions: number | null
            minQuestions: number | null
            rules: string | null
            pdfPages?: string[]
        },
        method: "subject" | "pdf"
    ) => void
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
    shadowQuestionsCount: 0,
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
    generateQuizWithAi: async (data, method) => {
        try {
            set({
                ...initialState,
                allQuestions: [],
                isGeneratingWithAi: true,
                selectedQuestionLocalId: null,
            })
            generateQuiz(method, data, (result) => {
                const questionsCount = result?.questionsCount

                const generatedQuestions = result?.questions || []

                const formattedGenerated = generatedQuestions.map((q) => {
                    const leftOptions = shuffleArray(
                        q.type === "MATCHING_PAIRS"
                            ? q.content.leftSideOptions.map((opt) => ({
                                  text: opt,
                                  localId: crypto.randomUUID(),
                              }))
                            : []
                    )

                    const rightOptions = shuffleArray(
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
                    )
                    const options = shuffleArray(
                        q.type === "MULTIPLE_CHOICE"
                            ? q.content.options.map((opt) => ({
                                  text: opt,
                                  localId: crypto.randomUUID(),
                                  isCorrect: q.content.correct.includes(opt),
                              }))
                            : []
                    )
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
                        localId:
                            get().allQuestions.find(
                                (item) => item.questionText === q.questionText
                            )?.localId || crypto.randomUUID(),
                        questionText: q.questionText,
                        imageUrl: null,
                        type: q.type,
                        layout: "horizontal",
                    }
                })

                if (generatedQuestions.length > 0 && questionsCount) {
                    set((state) => {
                        // here we are incrementally adding the questions
                        // each questions is not displayed in the ui unless it is fully generated
                        // also we track the user updates and keep them while we are adding the new questions (that is why the logic bellow is kind of complicated)

                        const isGenerating =
                            generatedQuestions.length < questionsCount

                        const oldQuestions = [
                            ...state.allQuestions.slice(
                                0,
                                state.allQuestions.length - 1
                            ),
                        ]

                        const existingQuestionsTexts = oldQuestions.map(
                            (item) => item.questionText
                        )

                        const newQuestions = formattedGenerated.filter(
                            (item) =>
                                !existingQuestionsTexts.includes(
                                    item.questionText
                                )
                        )

                        // making sure that the last item is generated correctly
                        const questionsToAdd = isGenerating
                            ? newQuestions
                            : [
                                  ...newQuestions.slice(0, -1),
                                  formattedGenerated[
                                      formattedGenerated.length - 1
                                  ],
                              ]
                        const questionsForState = [
                            ...oldQuestions,
                            ...questionsToAdd,
                        ]

                        return {
                            shadowQuestionsCount:
                                Number(questionsCount || 0) -
                                questionsForState.length,
                            selectedQuestionLocalId:
                                state.selectedQuestionLocalId ||
                                questionsForState.at(0)?.localId,
                            isGeneratingWithAi: !(
                                generatedQuestions.length > 1
                            ),
                            allQuestions: questionsForState as any,
                        }
                    })
                }
            })

            await wait(20_000)
            const didGenerate = get().allQuestions.length > 1

            if (!didGenerate) {
                throw new Error("Error while generating the questions.")
            }
        } catch (error) {
            console.error(error)
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
