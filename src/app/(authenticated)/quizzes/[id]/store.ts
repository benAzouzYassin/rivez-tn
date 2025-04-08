import { saveSubmission } from "@/data-access/quiz_submissions/create"
import { deleteQuizById } from "@/data-access/quizzes/delete"
import { generateQuiz } from "@/data-access/quizzes/generate"
import { handleQuizRefund } from "@/data-access/quizzes/handle-refund"
import { addQuestionsToQuiz } from "@/data-access/quizzes/update"
import {
    CodeCompletionContent,
    DebugCodeContent,
    FillInTheBlankContent,
    MatchingPairsContent,
    MultipleChoiceContent,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import { Database } from "@/types/database.types"
import { shuffleArray } from "@/utils/array"
import { create } from "zustand"

interface State {
    isAiError: boolean
    temporaryAiData: Parameters<Parameters<typeof generateQuiz>["2"]>["0"]
    isGeneratingWithAi: boolean
    savedResult: {
        correctAnswers: number
        xpGained: number
        secondsSpent: number
    } | null
    isSavingResults: boolean
    isSavingError: boolean
    isSavingSuccess: boolean
    startDate: Date | null
    currentQuestionIndex: number
    failedQuestionsIds: number[]
    questions: QuestionType[]
    skippedQuestionsIds: number[]

    answers: {
        secondsSpent: number
        questionId: number
        questionType: QuestionType["type"]
        failedAttempts: number | null // only in the "MATCHING_PAIRS"
        responses: AnswerResponses
    }[]
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
            notes: string | null
            pdfPages?: string[]
            allowedQuestions?: string[] | null
            quizId: number
            imagesBase64?: string[]
        },
        method: "subject" | "pdf" | "images",
        onSuccess: () => void
    ) => void
    setCurrentQuestionIndex: (index: number) => void
    addFailedQuestionIds: (id: number[]) => void
    addSkippedQuestionIds: (id: number[]) => void
    setQuestions: (questions: QuestionType[]) => void
    incrementQuestionIndex: () => void
    setStartDate: (date: Date) => void
    handleQuizFinish: (param: {
        quizId: string
        userId: string
    }) => Promise<boolean>
    addAnswer: (answer: State["answers"][number]) => void
    reset: () => void
}

type Store = Actions & State
const initialState: State = {
    isAiError: false,
    temporaryAiData: null,
    isGeneratingWithAi: false,
    savedResult: null,
    isSavingResults: false,
    isSavingError: false,
    isSavingSuccess: false,

    currentQuestionIndex: 0,
    failedQuestionsIds: [],
    questions: [],
    startDate: null,
    skippedQuestionsIds: [],
    answers: [],
}

export const useQuestionsStore = create<Store>((set, get) => ({
    ...initialState,
    addAnswer: (answer) =>
        set((state) => ({ answers: [...state.answers, answer] })),
    generateQuizWithAi: async (data, method, onSuccess) => {
        try {
            set({
                ...initialState,
                questions: [],
                isGeneratingWithAi: true,
                currentQuestionIndex: 0,
                temporaryAiData: null,
            })
            generateQuiz(
                method,
                data,
                (result) => {
                    set({
                        temporaryAiData: result,
                    })
                },
                async () => {
                    const generatedData = get().temporaryAiData?.questions
                    if (!generatedData?.length) {
                        throw new Error("No questions was generated.")
                    }
                    try {
                        // adding the questions into the database
                        await addQuestionsToQuiz(
                            data.quizId,
                            generatedData
                                .map((q, index) => {
                                    if (
                                        q.type ===
                                            "MULTIPLE_CHOICE_WITHOUT_IMAGE" ||
                                        q.type === "MULTIPLE_CHOICE_WITH_IMAGE"
                                    ) {
                                        return {
                                            displayOrder: index,
                                            content: {
                                                options: shuffleArray(
                                                    q.content.options.map(
                                                        (opt) => {
                                                            return {
                                                                isCorrect:
                                                                    q.content.correct.includes(
                                                                        opt
                                                                    ),
                                                                text: opt,
                                                                localId:
                                                                    crypto.randomUUID(),
                                                            }
                                                        }
                                                    )
                                                ),
                                                codeSnippets: null,
                                            },
                                            type: "MULTIPLE_CHOICE" as PossibleQuestionTypes,
                                            image: "",
                                            question: q.questionText,
                                            layout: "vertical" as any,
                                            imageType: (q.type ===
                                            "MULTIPLE_CHOICE_WITHOUT_IMAGE"
                                                ? "none"
                                                : "normal-image") as any,
                                        }
                                    }

                                    if (q.type === "FILL_IN_THE_BLANK") {
                                        return {
                                            displayOrder: index,
                                            content: {
                                                options: [
                                                    ...q.content.options,
                                                    ...q.content.correct.map(
                                                        (item) => item.option
                                                    ),
                                                ],
                                                correct: q.content.correct,
                                                parts: q.content.parts,
                                            },
                                            type: "FILL_IN_THE_BLANK" as PossibleQuestionTypes,
                                            image: "",
                                            question: q.questionText,
                                            layout: "vertical" as any,
                                            imageType: "none" as any,
                                        }
                                    }
                                    if (q.type === "MATCHING_PAIRS") {
                                        const formattedLeft =
                                            q.content.leftSideOptions.map(
                                                (opt) => ({
                                                    text: opt,
                                                    localId:
                                                        crypto.randomUUID(),
                                                })
                                            )

                                        const formattedRight =
                                            q.content.rightSideOptions.map(
                                                (opt) => {
                                                    const pairedLeftOption =
                                                        q.content.correct
                                                            .find((pair) =>
                                                                pair.includes(
                                                                    opt
                                                                )
                                                            )
                                                            ?.filter(
                                                                (item) =>
                                                                    item !== opt
                                                            )[0]
                                                    const pairedLeftOptionLocalId =
                                                        formattedLeft.find(
                                                            (item) =>
                                                                item.text ===
                                                                pairedLeftOption
                                                        )?.localId
                                                    return {
                                                        text: opt,
                                                        localId:
                                                            crypto.randomUUID(),
                                                        leftOptionLocalId:
                                                            pairedLeftOptionLocalId ||
                                                            null,
                                                    }
                                                }
                                            )

                                        return {
                                            displayOrder: index,
                                            content: {
                                                leftOptions: formattedLeft,
                                                rightOptions:
                                                    shuffleArray(
                                                        formattedRight
                                                    ),
                                            },
                                            type: "MATCHING_PAIRS" as PossibleQuestionTypes,
                                            image: "",
                                            question: q.questionText,
                                            layout: "horizontal" as any,
                                            imageType: "none" as any,
                                        }
                                    }
                                    return null
                                })
                                .filter((q) => !!q)
                        )
                        onSuccess()
                    } catch (err) {
                        console.error(err)
                        await handleQuizRefund({
                            cause: JSON.stringify(err),
                            quizId: data.quizId,
                        })
                        await deleteQuizById(data.quizId).catch(console.error)
                        set({
                            isGeneratingWithAi: false,
                            isAiError: true,
                        })
                    }
                }
            )
        } catch (err) {
            console.error(err)
            await handleQuizRefund({
                cause: JSON.stringify(err),
                quizId: data.quizId,
            })

            deleteQuizById(data.quizId).catch(console.error)
            set({
                isGeneratingWithAi: false,
                isAiError: true,
            })
        }
    },
    handleQuizFinish: async (params: { quizId: string; userId: string }) => {
        set({ isSavingResults: true, isSavingError: false })
        const startDate = get().startDate?.getTime()
        const secondsSpent = startDate
            ? (new Date().getTime() - startDate) / 1000
            : 0
        const failedQuestionsIds = get().failedQuestionsIds
        const skippedQuestionsIds = get().skippedQuestionsIds
        const correctQuestionsIds = get()
            .questions.map((question) => question.id)
            .filter(
                (questionId) =>
                    !skippedQuestionsIds.includes(questionId) &&
                    !failedQuestionsIds.includes(questionId)
            )
        const answers = get().answers

        const quizData = {
            quizId: params.quizId,
            userId: params.userId,
            secondsSpent,
            answers: answers.map((answer) => {
                return {
                    questionId: answer.questionId,
                    isAnsweredCorrectly: correctQuestionsIds.includes(
                        answer.questionId
                    ),
                    failedAttempts: answer.failedAttempts || 0,
                    isSkipped: skippedQuestionsIds.includes(answer.questionId),
                    responses: answer.responses,
                    secondsSpent: answer.secondsSpent,
                }
            }),
        }
        const correctAnswersCount = quizData.answers.filter(
            (item) => item.isAnsweredCorrectly
        ).length
        try {
            const xpGained = await saveSubmission({
                answersData: quizData.answers.map((item) => ({
                    failed_attempts: item.failedAttempts,
                    is_answered_correctly: item.isAnsweredCorrectly,
                    is_skipped: item.isSkipped,
                    question: item.questionId,
                    responses: item.responses,
                    seconds_spent: item.secondsSpent || 0,
                })),
                submissionData: {
                    quiz: Number(quizData.quizId),
                    seconds_spent: quizData.secondsSpent || 0,
                    user: quizData.userId,
                },
            })
            set({
                isSavingResults: false,
                isSavingSuccess: true,
                isSavingError: false,
                savedResult: {
                    correctAnswers: correctAnswersCount,
                    secondsSpent,
                    xpGained,
                },
            })
            return true
        } catch (error) {
            set({
                isSavingError: true,
                savedResult: null,
                isSavingResults: false,
                isSavingSuccess: false,
            })
            console.error(error)
            return false
        }
    },
    addSkippedQuestionIds: (ids) =>
        set((state) => ({
            skippedQuestionsIds: [...state.skippedQuestionsIds, ...ids],
        })),
    setStartDate: (startDate) => set({ startDate }),
    setCurrentQuestionIndex: (index) =>
        set(() => ({ currentQuestionIndex: index })),

    addFailedQuestionIds: (ids) =>
        set((state) => ({
            failedQuestionsIds: [...state.failedQuestionsIds, ...ids],
        })),
    setQuestions: (questions) =>
        set(() => ({
            isAiError: false,
            temporaryAiData: null,
            isGeneratingWithAi: false,
            questions,
        })),
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
        | FillInTheBlankContent
} & Omit<Database["public"]["Tables"]["quizzes_questions"]["Row"], "content">

//matrix when the questionType === "MATCHING_PAIRS" or string when the questionType === "MULTIPLE_CHOICE" or {wrong  : [] , correct : []} when questionType === "FILL_IN_THE_BLANK"
type AnswerResponses =
    | string[]
    | string[][]
    | {
          wrong: { index: number; option: string | null }[]
          correct: { index: number; option: string | null }[]
      }
    | null
