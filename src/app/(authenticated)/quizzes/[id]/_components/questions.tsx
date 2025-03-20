"use client"

import { QuestionType, useQuestionsStore } from "../store"

import { ErrorDisplay } from "@/components/shared/error-display"
import {
    FillInTheBlankContent,
    FillInTheBlankContentSchema,
    MatchingPairsContent,
    MatchingPairsContentSchema,
    MultipleChoiceContent,
    MultipleChoiceContentSchema,
} from "@/schemas/questions-content"
import MatchingPairsQuestion from "./matching-pairs-question"
import MultipleAnswerQuestion from "./multiple-answer-question"
import FillInTheBlankQuestion from "./fill-in-the-blank/fill-in-the-blank-question"

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
        case "FILL_IN_THE_BLANK":
            return isFillInTheBlank(currentQuestion) ? (
                <FillInTheBlankQuestion
                    questionsCount={questions.length}
                    question={currentQuestion}
                />
            ) : (
                <ErrorDisplay />
            )
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
function isFillInTheBlank(
    currentQuestion: QuestionType
): currentQuestion is QuestionType & { content: FillInTheBlankContent } {
    const { success } = FillInTheBlankContentSchema.safeParse(
        currentQuestion.content
    )
    return success
}
