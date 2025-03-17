import { POSSIBLE_QUESTIONS } from "../constants"

export function generateSingleQuestionPrompt(params: PromptParams): string {
    const { mainTopic, language, notes, questionType } = params

    const prompt = `Our USER wants you to generate a single educational question with the following specifications:

QUESTION METADATA:
- Main Topic: ${mainTopic}
- Language: ${language}
- Question Type: ${questionType}

QUALITY REQUIREMENTS:
1. The question should:
   - Be clear and unambiguous
   - Use proper terminology relevant to ${mainTopic}
   - Depend on modern and last available data

2. Answer options should:
   - Be mutually exclusive
   - Be free of obvious hints or patterns
   - Use consistent formatting

3. Language requirements:
   - Use ${language} exclusively
   - Maintain consistent terminology
   - Use proper grammar and punctuation
   - Avoid colloquialisms unless relevant to the topic

QUESTION SCHEMA:
${POSSIBLE_QUESTIONS[questionType].schemaString}

EXAMPLE:
${JSON.stringify(POSSIBLE_QUESTIONS[questionType].examples[0])}

Please generate a single question in JSON format, strictly following the provided type definition.

${
    notes?.length
        ? `
USER NOTES (should be followed):
    ${notes}
    `
        : ""
}

IMPORTANT: Your response should follow this zod schema:
z.object({
    question: ${POSSIBLE_QUESTIONS[questionType].schemaString}
})
`
    return prompt
}

interface PromptParams {
    mainTopic: string
    language: string
    notes: string | null
    questionType: keyof typeof POSSIBLE_QUESTIONS
}
