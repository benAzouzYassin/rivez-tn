"use client"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import {
    Edit,
    FileTextIcon,
    ImageIcon,
    LetterTextIcon,
    Video,
} from "lucide-react"
import QuizType from "./_components/quiz-type"
import { highPrice, mediumPrice } from "@/constants/prices"
export default function Page() {
    const isSmallScreen = useIsSmallScreen()
    return (
        <main className="flex relative flex-col items-center w-full min-h-screen p-6 bg-white">
            <>
                <div className="max-w-3xl w-full text-center">
                    <h1 className="text-4xl font-extrabold text-neutral-700 pt-6">
                        Generate Quiz
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Choose a method to create your quiz quickly and easily.
                    </p>
                </div>

                <section className="grid grid-cols-1 sm:grid-cols-2 max-w-[1100px] gap-x-4 gap-y-5 mt-12 ">
                    {items.map((item) =>
                        item.value === "custom-quiz" && isSmallScreen ? null : (
                            <QuizType key={item.text} {...item} />
                        )
                    )}
                </section>
            </>
        </main>
    )
}
const items = [
    {
        price: highPrice,
        disabled: false,
        value: "document",
        text: "From Document PDF",
        icon: <FileTextIcon className="!w-7 !h-7 text-indigo-500" />,
        description:
            "Upload PDF files to generate questions from your own materials.",
    },
    {
        price: highPrice,
        disabled: false,
        value: "image",
        text: "From Images",
        icon: <ImageIcon className="!w-7 text-indigo-500 !h-7" />,
        description:
            "Upload images containing text, diagrams, or visual information to create visual quizzes.",
    },
    {
        price: 0,
        disabled: false,
        value: "custom-quiz",
        text: "Custom quiz",
        icon: <Edit className="!w-7 text-indigo-500 !h-7" />,
        description:
            "Write your own questions and answers for complete control over quiz content.",
    },

    {
        price: highPrice,
        disabled: false,
        value: "youtube",
        text: "YouTube Video",
        icon: <Video className="!w-7 text-indigo-500 !h-7" />,
        description:
            "Transform any YouTube video into a comprehensive quiz by providing a URL.",
    },

    {
        disabled: false,
        value: "subject",
        text: "From subject",
        price: mediumPrice,
        icon: <LetterTextIcon className="!w-7 text-indigo-500 !h-7" />,
        description:
            "Create a custom quiz from any topic or subject area you specify.",
    },
] as const
