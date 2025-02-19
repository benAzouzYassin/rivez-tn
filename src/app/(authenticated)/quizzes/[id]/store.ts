import { saveSubmission } from "@/data-access/quiz_submissions/create"
import {
    CodeCompletionContent,
    DebugCodeContent,
    MatchingPairsContent,
    MultipleChoiceContent,
} from "@/schemas/questions-content"
import { Database } from "@/types/database.types"
import { create } from "zustand"

interface State {
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
        //matrix when the questionType === "MATCHING_PAIRS" and string when teh questionType === "MULTIPLE_CHOICE"
        responses: string[] | string[][]
    }[]
}

interface Actions {
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
    handleQuizFinish: async (params: { quizId: string; userId: string }) => {
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
        // let quizSubmissionId: null | number = null
        try {
            await saveSubmission({
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
            // quizSubmissionId = (
            //     await createQuizSubmission({
            //         quiz: Number(quizData.quizId),
            //         seconds_spent: quizData.secondsSpent || 0,
            //         user: quizData.userId,
            //     })
            // )[0].id
            // await createQuizSubmissionAnswers(
            //     quizData.answers.map((item) => ({
            //         failed_attempts: item.failedAttempts,
            //         is_answered_correctly: item.isAnsweredCorrectly,
            //         is_skipped: item.isSkipped,
            //         question: item.questionId,
            //         quiz_submission: quizSubmissionId,
            //         responses: item.responses,
            //         seconds_spent: item.secondsSpent || 0,
            //     }))
            // )
            return true
        } catch (error) {
            // if (quizSubmissionId) {
            //     await deleteQuizSubmissionById(quizSubmissionId)
            // }
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
