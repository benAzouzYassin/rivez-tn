import { z } from "zod"

const PossibleQuestionTypesEnum = z.enum([
    "SINGLE_CHOICE",
    "MULTIPLE_CHOICE",
    "MATCHING_PAIRS",
    "DEBUG_CODE",
    "CODE_COMPLETION",
])

const SingleChoiceContentSchema = z.object({
    correct: z.string(),
    options: z.array(z.string()),
})

const MultipleChoiceContentSchema = z.object({
    correct: z.array(z.string()),
    options: z.array(z.string()),
})

const MatchingPairsContentSchema = z.object({
    rightSideOptions: z.array(z.string()),
    leftSideOptions: z.array(z.string()),
    correct: z.array(z.array(z.string())),
})

const DebugCodeContentSchema = z.unknown()

const CodeCompletionContentSchema = z.unknown()

const QuestionContentSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("SINGLE_CHOICE"),
        content: SingleChoiceContentSchema,
    }),
    z.object({
        type: z.literal("MULTIPLE_CHOICE"),
        content: MultipleChoiceContentSchema,
    }),
    z.object({
        type: z.literal("MATCHING_PAIRS"),
        content: MatchingPairsContentSchema,
    }),
    z.object({
        type: z.literal("DEBUG_CODE"),
        content: DebugCodeContentSchema,
    }),
    z.object({
        type: z.literal("CODE_COMPLETION"),
        content: CodeCompletionContentSchema,
    }),
])

export {
    PossibleQuestionTypesEnum,
    SingleChoiceContentSchema,
    MultipleChoiceContentSchema,
    MatchingPairsContentSchema,
    DebugCodeContentSchema,
    CodeCompletionContentSchema,
    QuestionContentSchema,
}

export type PossibleQuestionTypes = z.infer<typeof PossibleQuestionTypesEnum>
export type SingleChoiceContent = z.infer<typeof SingleChoiceContentSchema>
export type MultipleChoiceContent = z.infer<typeof MultipleChoiceContentSchema>
export type MatchingPairsContent = z.infer<typeof MatchingPairsContentSchema>
export type DebugCodeContent = z.infer<typeof DebugCodeContentSchema>
export type CodeCompletionContent = z.infer<typeof CodeCompletionContentSchema>
export type QuestionContent = z.infer<typeof QuestionContentSchema>
