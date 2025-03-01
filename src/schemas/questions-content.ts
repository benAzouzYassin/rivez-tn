import { z } from "zod"

export const possibleQuestionTypes = [
    "MULTIPLE_CHOICE",
    "MATCHING_PAIRS",
    "DEBUG_CODE",
    "CODE_COMPLETION",
] as const
const PossibleQuestionTypesEnum = z.enum(possibleQuestionTypes)

const MultipleChoiceContentSchema = z.object({
    codeSnippets: z
        .array(
            z.object({
                name: z.string(),
                code: z.string(),
                localId: z.string(),
                type: z.string(),
            })
        )
        .optional()
        .nullable(),
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
    MultipleChoiceContentSchema,
    MatchingPairsContentSchema,
    DebugCodeContentSchema,
    CodeCompletionContentSchema,
    QuestionContentSchema,
}

export type PossibleQuestionTypes = (typeof possibleQuestionTypes)[number]
export type MultipleChoiceContent = z.infer<typeof MultipleChoiceContentSchema>
export type MatchingPairsContent = z.infer<typeof MatchingPairsContentSchema>
export type DebugCodeContent = z.infer<typeof DebugCodeContentSchema>
export type CodeCompletionContent = z.infer<typeof CodeCompletionContentSchema>
export type QuestionContent = z.infer<typeof QuestionContentSchema>
