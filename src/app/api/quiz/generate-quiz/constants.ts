import { z } from "zod"

export const POSSIBLE_QUESTIONS = {
    MULTIPLE_CHOICE_WITHOUT_IMAGE: {
        name: "MULTIPLE_CHOICE_WITHOUT_IMAGE",
        examples: [
            {
                questionText:
                    "Which of the following countries are in South America?",
                type: "MULTIPLE_CHOICE_WITHOUT_IMAGE",
                content: {
                    correct: ["Brazil", "Peru"],
                    options: ["Brazil", "Mexico", "Peru", "Spain"],
                },
            },
            {
                questionText:
                    "Which programming languages are statically typed?",
                type: "MULTIPLE_CHOICE_WITHOUT_IMAGE",
                content: {
                    correct: ["TypeScript", "Java", "C++"],
                    options: ["TypeScript", "Python", "Java", "C++"],
                },
            },
        ],
        schema: z.object({
            questionText: z.string(),
            type: z.literal("MULTIPLE_CHOICE_WITHOUT_IMAGE"),
            content: z.object({
                correct: z.array(z.string()).min(1),
                options: z.array(z.string()).min(4).max(4),
            }),
        }),
        schemaString: `
           z.object({
                questionText: z.string(),
                type: z.literal("MULTIPLE_CHOICE_WITHOUT_IMAGE"),
                content: z.object({
                    correct: z.array(z.string()).min(1),
                    options: z.array(z.string()).min(4).max(4),
                }),
            })
        `,
    },

    MULTIPLE_CHOICE_WITH_IMAGE: {
        name: "MULTIPLE_CHOICE_WITH_IMAGE",
        examples: [
            {
                questionText: "What are the animals who eat meat.",
                type: "MULTIPLE_CHOICE_WITH_IMAGE",
                content: {
                    correct: ["Lion", "Tiger"],
                    options: ["Elephant", "Lion", "Giraffe", "Zebra"],
                },
            },
            {
                questionText:
                    "Which architectural styles are represented in this building?",
                type: "MULTIPLE_CHOICE_WITH_IMAGE",
                content: {
                    correct: ["Gothic", "Renaissance"],
                    options: [
                        "Gothic",
                        "Baroque",
                        "Renaissance",
                        "Neoclassical",
                    ],
                },
            },
        ],
        schema: z.object({
            questionText: z.string(),
            type: z.literal("MULTIPLE_CHOICE_WITH_IMAGE"),
            content: z.object({
                correct: z.array(z.string()).min(1),
                options: z.array(z.string()).min(4).max(4),
            }),
        }),
        schemaString: `
           z.object({
                questionText: z.string(),
                type: z.literal("MULTIPLE_CHOICE_WITH_IMAGE"),
                content: z.object({
                    correct: z.array(z.string()).min(1),
                    options: z.array(z.string()).min(4).max(4),
                }),
            })
        `,
    },
    TRUE_OR_FALSE: {
        name: "TRUE_OR_FALSE",

        examples: [
            {
                questionText: "The Earth is flat.",
                type: "TRUE_OR_FALSE",
                content: {
                    correct: ["False"],
                    options: ["True", "False"],
                },
            },
            {
                questionText:
                    "Water boils at 100 degrees Celsius at sea level.",
                type: "TRUE_OR_FALSE",
                content: {
                    correct: ["True"],
                    options: ["True", "False"],
                },
            },
        ],
        schema: z.object({
            questionText: z.string(),
            type: z.literal("TRUE_OR_FALSE"),
            content: z.object({
                correct: z.array(z.string()),
                options: z.array(z.string()),
            }),
        }),
        schemaString: `
           z.object({
                questionText: z.string(),
                type: z.literal("TRUE_OR_FALSE"),
                content: z.object({
                    correct: z.array(z.string()),
                    options: z.array(z.string()),
                }),
            })
        `,
    },

    MATCHING_PAIRS: {
        name: "MATCHING_PAIRS",

        examples: [
            {
                questionText: "Match the countries with their capitals:",
                type: "MATCHING_PAIRS",
                content: {
                    correct: [
                        ["France", "Paris"],
                        ["Germany", "Berlin"],
                        ["Japan", "Tokyo"],
                        ["Brazil", "Brasília"],
                    ],
                    leftSideOptions: ["France", "Germany", "Japan", "Brazil"],
                    rightSideOptions: [
                        "Brasília",
                        "Berlin",
                        "Paris",
                        "Moscow",
                        "Tokyo",
                        "Madrid",
                    ],
                },
            },
            {
                questionText: "Match the authors with their famous works:",
                type: "MATCHING_PAIRS",
                content: {
                    correct: [
                        ["Shakespeare", "Hamlet"],
                        ["Tolkien", "The Lord of the Rings"],
                        ["J.K. Rowling", "Harry Potter"],
                        ["George Orwell", "1984"],
                    ],
                    leftSideOptions: [
                        "Shakespeare",
                        "Tolkien",
                        "J.K. Rowling",
                        "George Orwell",
                    ],
                    rightSideOptions: [
                        "The Lord of the Rings",
                        "Pride and Prejudice",
                        "Harry Potter",
                        "1984",
                        "Moby Dick",
                        "Hamlet",
                    ],
                },
            },
        ],
        schema: z.object({
            questionText: z.string(),
            type: z.literal("MATCHING_PAIRS"),
            content: z.object({
                correct: z.array(z.array(z.string())),
                leftSideOptions: z.array(z.string()),
                rightSideOptions: z.array(z.string()),
            }),
        }),
        schemaString: `z.object({
                questionText: z.string(),
                type: z.literal("MATCHING_PAIRS"),
                content: z.object({
                    leftSideOptions: z.array(z.string()),
                    rightSideOptions: z.array(z.string()),
                    correct: z.array(z.array(z.string())) // the correct array should utilize all leftSideOptions,
                }),
            })`,
    },
    FILL_IN_THE_BLANK: {
        name: "FILL_IN_THE_BLANK",
        examples: [
            {
                questionText: "Complete the sentence:",
                type: "FILL_IN_THE_BLANK",
                content: {
                    parts: ["The capital of France is ", "."],
                    options: ["London", "Berlin", "Madrid"],
                    correct: [
                        {
                            option: "Paris",
                            index: 0,
                        },
                    ],
                },
            },
            {
                questionText: "Fill in the missing parts of the definition:",
                type: "FILL_IN_THE_BLANK",
                content: {
                    parts: [
                        "Water is a compound made up of ",
                        " and ",
                        ".",
                        "have no color",
                    ],
                    options: ["carbon", "nitrogen"],
                    correct: [
                        {
                            option: "hydrogen",
                            index: 0,
                        },
                        {
                            option: "oxygen",
                            index: 1,
                        },
                        {
                            option: "Water",
                            index: 2,
                        },
                    ],
                },
            },
        ],
        schema: z.object({
            questionText: z.string(),
            type: z.literal("FILL_IN_THE_BLANK"),
            content: z.object({
                parts: z.array(z.string()).min(4), // will be joined with this string to represent an blank fields "___"
                options: z.array(z.string()),
                correct: z.array(
                    z.object({
                        option: z.string(),
                        index: z.number(),
                    })
                ),
            }),
        }),

        schemaString: `z.object({
                questionText: z.string(),
                type: z.literal("FILL_IN_THE_BLANK"),
                content: z.object({
                    parts: z.array(z.string()).min(4), //example : if we want "this___fill in the example." we will get this array ["this" , "fill in the blank example."] 
                    options: z.array(z.string()),// will have the options that are not present in the correct array only,
                    correct: z.array(
                        z.object({
                            option: z.string(),
                            index: z.number(), // index always stars from 0
                        })
                    ),
                }),
            })`,
    },
} as const
