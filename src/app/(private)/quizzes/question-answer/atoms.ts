import { atom } from "jotai"

export const currentStepAtom = atom(0)

export const wrongAnswersIdsAtom = atom<string[]>([])

export const questionsAtom = atom<Question[]>([
    {
        id: "q1",
        question: {
            questionText: "What is the capital of France?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q1_opt1", content: "Paris", isCorrect: true },
                { id: "q1_opt2", content: "London", isCorrect: false },
                { id: "q1_opt3", content: "Berlin", isCorrect: false },
                { id: "q1_opt4", content: "Madrid", isCorrect: false },
            ],
        },
    },
    {
        id: "q2",
        question: {
            questionText:
                "Which programming language was created by Brendan Eich?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q2_opt1", content: "Python", isCorrect: false },
                { id: "q2_opt2", content: "JavaScript", isCorrect: true },
                { id: "q2_opt3", content: "Java", isCorrect: false },
                { id: "q2_opt4", content: "C++", isCorrect: false },
            ],
        },
    },
    {
        id: "q3",
        question: {
            questionText: "What is the largest planet in our solar system?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q3_opt1", content: "Mars", isCorrect: false },
                { id: "q3_opt2", content: "Saturn", isCorrect: false },
                { id: "q3_opt3", content: "Jupiter", isCorrect: true },
                { id: "q3_opt4", content: "Neptune", isCorrect: false },
            ],
        },
    },
    {
        id: "q4",
        question: {
            questionText: "Who painted the Mona Lisa?",
            imageUrl: "/placeholders/code.png",
            options: [
                {
                    id: "q4_opt1",
                    content: "Vincent van Gogh",
                    isCorrect: false,
                },
                {
                    id: "q4_opt2",
                    content: "Leonardo da Vinci",
                    isCorrect: true,
                },
                { id: "q4_opt3", content: "Pablo Picasso", isCorrect: false },
                { id: "q4_opt4", content: "Michelangelo", isCorrect: false },
            ],
        },
    },
    {
        id: "q5",
        question: {
            questionText: "What is the chemical symbol for gold?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q5_opt1", content: "Ag", isCorrect: false },
                { id: "q5_opt2", content: "Fe", isCorrect: false },
                { id: "q5_opt3", content: "Au", isCorrect: true },
                { id: "q5_opt4", content: "Cu", isCorrect: false },
            ],
        },
    },
    {
        id: "q6",
        question: {
            questionText:
                "Which framework is developed by Meta (formerly Facebook)?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q6_opt1", content: "Angular", isCorrect: false },
                { id: "q6_opt2", content: "Vue", isCorrect: false },
                { id: "q6_opt3", content: "Svelte", isCorrect: false },
                { id: "q6_opt4", content: "React", isCorrect: true },
            ],
        },
    },
    {
        id: "q7",
        question: {
            questionText: "What is the square root of 144?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q7_opt1", content: "10", isCorrect: false },
                { id: "q7_opt2", content: "12", isCorrect: true },
                { id: "q7_opt3", content: "14", isCorrect: false },
                { id: "q7_opt4", content: "16", isCorrect: false },
            ],
        },
    },
    {
        id: "q8",
        question: {
            questionText: "Which year did World War II end?",
            imageUrl: "/placeholders/code.png",
            options: [
                { id: "q8_opt1", content: "1943", isCorrect: false },
                { id: "q8_opt2", content: "1944", isCorrect: false },
                { id: "q8_opt3", content: "1945", isCorrect: true },
                { id: "q8_opt4", content: "1946", isCorrect: false },
            ],
        },
    },
])

type Question = {
    id: string
    question: {
        questionText: string
        imageUrl: string
        options: { id: string; content: string; isCorrect: boolean }[]
    }
}
