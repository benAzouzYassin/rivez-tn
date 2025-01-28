import { createSeedClient } from "@snaplet/seed"

async function main() {
    const seed = await createSeedClient({ dryRun: true })

    // Seed quizzes with more categories
    const { quizzes } = await seed.quizzes([
        {
            name: "General Knowledge Quiz",
            created_at: new Date(),
        },
        {
            name: "Science and Technology Quiz",
            created_at: new Date(),
        },
        {
            name: "History Quiz",
            created_at: new Date(),
        },
        {
            name: "Pop Culture Quiz",
            created_at: new Date(),
        },
        {
            name: "Geography Quiz",
            created_at: new Date(),
        },
    ])

    // Define questions for each quiz
    const questionsData = [
        // General Knowledge Quiz
        {
            quiz_id: quizzes[0].id,
            questions: [
                {
                    question: "What is the capital of France?",
                    options: [
                        { content: "Paris", is_correct: true },
                        { content: "London", is_correct: false },
                        { content: "Berlin", is_correct: false },
                        { content: "Madrid", is_correct: false },
                    ],
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: [
                        { content: "Mars", is_correct: true },
                        { content: "Venus", is_correct: false },
                        { content: "Jupiter", is_correct: false },
                        { content: "Saturn", is_correct: false },
                    ],
                },
                {
                    question: "What is the largest mammal in the world?",
                    options: [
                        { content: "Blue Whale", is_correct: true },
                        { content: "African Elephant", is_correct: false },
                        { content: "Giraffe", is_correct: false },
                        { content: "Polar Bear", is_correct: false },
                    ],
                },
            ],
        },
        // Science and Technology Quiz
        {
            quiz_id: quizzes[1].id,
            questions: [
                {
                    question: "What is the chemical symbol for gold?",
                    options: [
                        { content: "Au", is_correct: true },
                        { content: "Ag", is_correct: false },
                        { content: "Fe", is_correct: false },
                        { content: "Cu", is_correct: false },
                    ],
                },
                {
                    question: "Who invented the telephone?",
                    options: [
                        { content: "Alexander Graham Bell", is_correct: true },
                        { content: "Thomas Edison", is_correct: false },
                        { content: "Nikola Tesla", is_correct: false },
                        { content: "Albert Einstein", is_correct: false },
                    ],
                },
                {
                    question: "What is the speed of light?",
                    options: [
                        {
                            content: "299,792,458 meters per second",
                            is_correct: true,
                        },
                        {
                            content: "300,000,000 meters per second",
                            is_correct: false,
                        },
                        {
                            content: "199,792,458 meters per second",
                            is_correct: false,
                        },
                        {
                            content: "399,792,458 meters per second",
                            is_correct: false,
                        },
                    ],
                },
            ],
        },
        // History Quiz
        {
            quiz_id: quizzes[2].id,
            questions: [
                {
                    question:
                        "When was the Declaration of Independence signed?",
                    options: [
                        { content: "July 4, 1776", is_correct: true },
                        { content: "July 4, 1775", is_correct: false },
                        { content: "July 4, 1777", is_correct: false },
                        { content: "July 4, 1778", is_correct: false },
                    ],
                },
                {
                    question: "Who was the first woman to win a Nobel Prize?",
                    options: [
                        { content: "Marie Curie", is_correct: true },
                        { content: "Mother Teresa", is_correct: false },
                        { content: "Jane Addams", is_correct: false },
                        { content: "Pearl Buck", is_correct: false },
                    ],
                },
            ],
        },
        // Pop Culture Quiz
        {
            quiz_id: quizzes[3].id,
            questions: [
                {
                    question: "Which band performed 'Bohemian Rhapsody'?",
                    options: [
                        { content: "Queen", is_correct: true },
                        { content: "The Beatles", is_correct: false },
                        { content: "Led Zeppelin", is_correct: false },
                        { content: "Pink Floyd", is_correct: false },
                    ],
                },
                {
                    question:
                        "Who played Iron Man in the Marvel Cinematic Universe?",
                    options: [
                        { content: "Robert Downey Jr.", is_correct: true },
                        { content: "Chris Evans", is_correct: false },
                        { content: "Chris Hemsworth", is_correct: false },
                        { content: "Mark Ruffalo", is_correct: false },
                    ],
                },
            ],
        },
        // Geography Quiz
        {
            quiz_id: quizzes[4].id,
            questions: [
                {
                    question: "What is the largest continent by land area?",
                    options: [
                        { content: "Asia", is_correct: true },
                        { content: "Africa", is_correct: false },
                        { content: "North America", is_correct: false },
                        { content: "Europe", is_correct: false },
                    ],
                },
                {
                    question:
                        "Which country has the most islands in the world?",
                    options: [
                        { content: "Sweden", is_correct: true },
                        { content: "Indonesia", is_correct: false },
                        { content: "Japan", is_correct: false },
                        { content: "Philippines", is_correct: false },
                    ],
                },
            ],
        },
    ]

    // Seed questions and options
    for (const quizData of questionsData) {
        for (const questionData of quizData.questions) {
            const { quizzes_questions } = await seed.quizzes_questions([
                {
                    quiz: quizData.quiz_id,
                    question: questionData.question,
                    image: "",
                    created_at: new Date(),
                },
            ])

            // Seed options for each question
            await seed.quizzes_questions_options(
                questionData.options.map((option) => ({
                    question: quizzes_questions[0].id,
                    content: option.content,
                    is_correct: option.is_correct,
                    created_at: new Date(),
                }))
            )
        }
    }

    process.exit()
}

main()
