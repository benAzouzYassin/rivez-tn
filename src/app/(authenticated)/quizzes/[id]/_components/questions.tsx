"use client"

import { useAtom } from "jotai"
import { currentQuestionIndexAtom, questionsAtom, QuestionType } from "../atoms"
import CodeCompletionQuestion from "./code-completion-question"
import MultipleAnswerQuestion from "./multiple-answer-question"
import MatchingPairsQuestion from "./matching-pairs-question"
import DebugCodeQuestion from "./debug-code-question"
import { ErrorDisplay } from "@/components/shared/error-display"
import {
    CodeCompletionContent,
    CodeCompletionContentSchema,
    DebugCodeContent,
    DebugCodeContentSchema,
    MatchingPairsContent,
    MatchingPairsContentSchema,
    MultipleChoiceContent,
    MultipleChoiceContentSchema,
} from "@/schemas/questions-content"

export default function Questions() {
    const [questionIndex] = useAtom(currentQuestionIndexAtom)
    const [questions] = useAtom(questionsAtom)

    const currentQuestion = questions[questionIndex]
    if (!currentQuestion) {
        return <ErrorDisplay />
    }

    switch (currentQuestion?.type) {
        case "MULTIPLE_CHOICE":
            console.log(currentQuestion)
            return isMultipleChoice(currentQuestion) ? (
                <MultipleAnswerQuestion question={currentQuestion} />
            ) : (
                <ErrorDisplay />
            )
        case "MATCHING_PAIRS":
            return isMatchingPairs(currentQuestion) ? (
                <MatchingPairsQuestion question={currentQuestion} />
            ) : (
                <ErrorDisplay />
            )
        case "CODE_COMPLETION":
            return isCodeCompletion(currentQuestion) ? (
                <CodeCompletionQuestion question={currentQuestion} />
            ) : (
                <ErrorDisplay />
            )
        case "DEBUG_CODE":
            return isCodeDebug(currentQuestion) ? (
                <DebugCodeQuestion question={currentQuestion} />
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
function isCodeCompletion(
    currentQuestion: QuestionType
): currentQuestion is QuestionType & { content: CodeCompletionContent } {
    const { success } = CodeCompletionContentSchema.safeParse(
        currentQuestion.content
    )
    return success
}
function isCodeDebug(
    currentQuestion: QuestionType
): currentQuestion is QuestionType & { content: DebugCodeContent } {
    const { success } = DebugCodeContentSchema.safeParse(
        currentQuestion.content
    )
    return success
}
