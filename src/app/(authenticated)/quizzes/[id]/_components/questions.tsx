"use client"

import { QuestionType, useQuestionsStore } from "../store"

import { ErrorDisplay } from "@/components/shared/error-display"
import {
    MatchingPairsContent,
    MatchingPairsContentSchema,
    MultipleChoiceContent,
    MultipleChoiceContentSchema,
} from "@/schemas/questions-content"
import MatchingPairsQuestion from "./matching-pairs-question"
import MultipleAnswerQuestion from "./multiple-answer-question"

export default function Questions() {
    const questionIndex = useQuestionsStore((s) => s.currentQuestionIndex)
    const questions = useQuestionsStore((s) => s.questions)

    const currentQuestion = questions[questionIndex]
    if (!currentQuestion) {
        return <ErrorDisplay />
    }

    switch (currentQuestion?.type) {
        case "MULTIPLE_CHOICE":
            return isMultipleChoice(currentQuestion) ? (
                <MultipleAnswerQuestion
                    questionsCount={questions.length}
                    question={currentQuestion}
                />
            ) : (
                <ErrorDisplay />
            )
        case "MATCHING_PAIRS":
            return isMatchingPairs(currentQuestion) ? (
                <MatchingPairsQuestion
                    questionsCount={questions.length}
                    question={currentQuestion}
                />
            ) : (
                <ErrorDisplay />
            )
        // case "CODE_COMPLETION":
        //     return isCodeCompletion(currentQuestion) ? (
        //         <CodeCompletionQuestion question={currentQuestion} />
        //     ) : (
        //         <ErrorDisplay />
        //     )
        // case "DEBUG_CODE":
        //     return isCodeDebug(currentQuestion) ? (
        //         <DebugCodeQuestion question={currentQuestion} />
        //     ) : (
        //         <ErrorDisplay />
        //     )
        default:
            return <ErrorDisplay />
    }
}

// assertion functions
function isMultipleChoice(
    currentQuestion: QuestionType
): currentQuestion is QuestionType & { content: MultipleChoiceContent } {
    const { success } = MultipleChoiceContentSchema.safeParse(
        currentQuestion.content
    )
    return success
}
function isMatchingPairs(
    currentQuestion: QuestionType
): currentQuestion is QuestionType & { content: MatchingPairsContent } {
    const { success } = MatchingPairsContentSchema.safeParse(
        currentQuestion.content
    )
    return success
}
// function isCodeCompletion(
//     currentQuestion: QuestionType
// ): currentQuestion is QuestionType & { content: CodeCompletionContent } {
//     const { success } = CodeCompletionContentSchema.safeParse(
//         currentQuestion.content
//     )
//     return success
// }
// function isCodeDebug(
//     currentQuestion: QuestionType
// ): currentQuestion is QuestionType & { content: DebugCodeContent } {
//     const { success } = DebugCodeContentSchema.safeParse(
//         currentQuestion.content
//     )
//     return success
// }
