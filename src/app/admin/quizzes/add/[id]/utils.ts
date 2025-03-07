import { generateQuiz } from "@/data-access/quizzes/generate"
import { shuffleArray } from "@/utils/array"
import { Store } from "./store"

export const getRightOptionPairLocalId = (
    correctOptions: string[][],
    leftOptions: { text: string; localId: string }[],
    rightOpt: string
) => {
    const pair = correctOptions?.find((item) =>
        item.includes(rightOpt)
    ) as string[]
    const leftOption = pair?.filter((item) => item !== rightOpt)[0]
    if (!leftOption || !pair) {
        return null
    }
    return (
        leftOptions?.find((item) => item.text === leftOption)?.localId || null
    )
}

export const formatGeneratedQuestions = (
    data: Parameters<Parameters<typeof generateQuiz>["2"]>["0"],
    getState: () => Store
) => {
    const generatedQuestions = data?.questions || []
    const result = generatedQuestions.map((q) => {
        if (q.type === "MATCHING_PAIRS") {
            const leftOptions = shuffleArray(
                q.content.leftSideOptions.map((opt) => ({
                    text: opt,
                    localId: crypto.randomUUID(),
                }))
            )
            const rightOptions = shuffleArray(
                q.content.rightSideOptions.map((opt) => ({
                    text: opt,
                    localId: crypto.randomUUID(),
                    leftOptionLocalId: getRightOptionPairLocalId(
                        q.content.correct,
                        leftOptions,
                        opt
                    ),
                }))
            )

            return {
                content: {
                    leftOptions,
                    rightOptions,
                },
                localId:
                    getState().allQuestions.find(
                        (item) => item.questionText === q.questionText
                    )?.localId || crypto.randomUUID(),
                questionText: q.questionText,
                imageUrl: null,
                type: q.type,
                layout: "horizontal",
                questionType: "MATCHING_PAIRS",
                imageType: "none",
            }
        }
        if (q.type === "TRUE_OR_FALSE") {
            const options = q.content.options.map((opt) => ({
                text: opt,
                localId: crypto.randomUUID(),
                isCorrect: q.content.correct.includes(opt),
            }))

            return {
                content: {
                    options,
                },
                localId:
                    getState().allQuestions.find(
                        (item) => item.questionText === q.questionText
                    )?.localId || crypto.randomUUID(),
                questionText: q.questionText,
                imageUrl: null,
                type: q.type,
                layout: "vertical",
                questionType: "MULTIPLE_CHOICE",
                imageType: "none",
            }
        }
        if (q.type === "MULTIPLE_CHOICE_WITHOUT_IMAGE") {
            const options = shuffleArray(
                q.content.options.map((opt) => ({
                    text: opt,
                    localId: crypto.randomUUID(),
                    isCorrect: q.content.correct.includes(opt),
                }))
            )
            return {
                content: {
                    options,
                },
                localId:
                    getState().allQuestions.find(
                        (item) => item.questionText === q.questionText
                    )?.localId || crypto.randomUUID(),
                questionText: q.questionText,
                imageUrl: null,
                type: q.type,
                layout: "vertical",
                questionType: "MULTIPLE_CHOICE",
                imageType: "none",
            }
        }
        if (q.type === "MULTIPLE_CHOICE_WITH_IMAGE") {
            const options = shuffleArray(
                q.content.options.map((opt) => ({
                    text: opt,
                    localId: crypto.randomUUID(),
                    isCorrect: q.content.correct.includes(opt),
                }))
            )
            return {
                content: {
                    options,
                },
                localId:
                    getState().allQuestions.find(
                        (item) => item.questionText === q.questionText
                    )?.localId || crypto.randomUUID(),
                questionText: q.questionText,
                imageUrl: null,
                type: q.type,
                layout: "horizontal",
                questionType: "MULTIPLE_CHOICE",
                imageType: "normal-image",
            }
        }
        if (q.type === "FILL_IN_THE_BLANK") {
            return {
                content: {
                    parts: q.content.parts,
                    options: q.content.options.map((opt) => ({
                        text: opt,
                        localId: crypto.randomUUID(),
                    })),
                    correct: q.content.correct.map((item) => {
                        return {
                            option: item.option,
                            index: item.index,
                            optionId: crypto.randomUUID(),
                        }
                    }),
                },
                localId:
                    getState().allQuestions.find(
                        (item) => item.questionText === q.questionText
                    )?.localId || crypto.randomUUID(),
                questionText: q.questionText,
                imageUrl: null,
                type: q.type,
                layout: "horizontal",
                questionType: "FILL_IN_THE_BLANK",
                imageType: "normal-image",
            }
        }
    })
    return result
}
