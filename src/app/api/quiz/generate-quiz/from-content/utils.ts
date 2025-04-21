import { POSSIBLE_QUESTIONS } from "../constants"

interface PromptParams {
    name: string
    content: string
    language: string
    notes: string | null
    minQuestions: number
    maxQuestions: number
    allowQuestions: "ALL" | (keyof typeof POSSIBLE_QUESTIONS)[]
}
export function generateQuizPrompt(params: PromptParams): string {
    const { language, notes, content, minQuestions, maxQuestions } = params

    const questionsNames = (
        params.allowQuestions === "ALL"
            ? Object.keys(POSSIBLE_QUESTIONS)
            : params.allowQuestions
    ).filter(
        (q) => q !== "FILL_IN_THE_BLANK"
    ) as (keyof typeof POSSIBLE_QUESTIONS)[]
    const allowedQuestions = questionsNames.map((q) => POSSIBLE_QUESTIONS[q])
    const prompt = `
Hello i am the user.
I want you to generate an educational quiz from content with the following specifications:

QUIZ METADATA:
- Language: ${language}
- Maximum questions count : is ${maxQuestions > 1 ? maxQuestions : 2}
- Minimum questions count : is ${minQuestions} 

QUESTION DISTRIBUTION:
- Aim for a balanced mix of ${questionsNames.join(" and ")} questions
- Minimum number of questions is ${minQuestions}
- Aim for creating ${
        maxQuestions > minQuestions
            ? (maxQuestions / 2).toFixed(0)
            : minQuestions
    } questions 

QUALITY REQUIREMENTS:
1. Questions should:
   - Be clear and unambiguous.
   - Progress from basic to more challenging concepts.
   - Avoid obvious patterns in correct answers.
   - Depend on the content that is provided below.
   - Base all questions strictly on the content from the provided PDF bellow.
   - Challenging and not easy.
   
2. Answer options should:
   - Be mutually exclusive
   - Be free of obvious hints or patterns
   - Use consistent formatting

3. Language requirements:
   - Use ${language} exclusively
   - Maintain consistent terminology
   - Use proper grammar and punctuation
   - Avoid colloquialisms unless relevant to the topic

QUESTION SCHEMAS:
${allowedQuestions.map((question, index) => {
    return `
    ${index + 1}. ${question.name} : ${question.schemaString} 
    `
})}

EXAMPLES:
${allowedQuestions.map((question, index) => {
    return `
    ${index + 1}. ${question.name} :
        ${question.examples.map((example, exampleIndex) => {
            return `
        - JSON example ${exampleIndex + 1}: ${JSON.stringify(example)}
        `
        })} 
    `
})}

CONTENT YOU WILL BASE YOUR KNOWLEDGE FROM  : 
${content}

Please generate the quiz in JSON format, with each question object strictly following the provided type definitions.


${
    notes?.length
        ? `
USER NOTES (should be followed):
    ${notes}
    `
        : ""
}

IMPORTANT : Your response should follow this zod schema : 
 z.object({
    questionsCount: z.number(),
    questions: z.array(
        z.union([
        ${allowedQuestions
            .map((question) => {
                return question.schemaString
            })
            .join(",")}
        ])
    ),
}) 
`
    return prompt
}
