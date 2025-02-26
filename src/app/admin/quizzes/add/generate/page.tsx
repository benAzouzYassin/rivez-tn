"use client"
import {
    Edit,
    FileTextIcon,
    ImageIcon,
    LetterTextIcon,
    Link,
    Video,
} from "lucide-react"
import QuizType from "./_components/quiz-type"

export default function Page() {
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

                <section className="grid grid-cols-1 sm:grid-cols-2 max-w-[1100px] gap-x-8 gap-y-10 mt-12 ">
                    {items.map((item) => (
                        <QuizType key={item.text} {...item} />
                    ))}
                </section>
            </>
        </main>
    )
}
const items = [
    {
        value: "subject",
        text: "Subject Based",
        icon: <LetterTextIcon className="!w-8 text-blue-400 !h-8" />,
        description:
            "Create a custom quiz from any topic or subject area you specify.",
    },
    {
        value: "document",
        text: "Document Upload",
        icon: <FileTextIcon className="!w-8 !h-8 text-blue-400" />,
        description:
            "Upload PDF, Word, or text files to generate questions from your own materials.",
    },
    {
        value: "youtube",
        text: "YouTube Video",
        icon: <Video className="!w-8 text-blue-400 !h-8" />,
        description:
            "Transform any YouTube video into a comprehensive quiz by providing a URL.",
    },
    {
        value: "link",
        text: "Website Content",
        icon: <Link className="!w-8 text-blue-400 !h-8" />,
        description:
            "Generate questions from any webpage by simply pasting a URL.",
    },
    {
        value: "custom-quiz",
        text: "Custom quiz",
        icon: <Edit className="!w-8 text-blue-400 !h-8" />,
        description:
            "Write your own questions and answers for complete control over quiz content.",
    },
    {
        value: "image",
        text: "Images Analysis",
        icon: <ImageIcon className="!w-8 text-blue-400 !h-8" />,
        description:
            "Upload images containing text, diagrams, or visual information to create visual quizzes.",
    },
] as const
