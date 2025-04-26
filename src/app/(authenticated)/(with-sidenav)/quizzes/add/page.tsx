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
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

export default function Page() {
    const isSmallScreen = useIsSmallScreen()

    // Translation object
    const translation = useMemo(
        () => ({
            en: {
                "Generate Quiz": "Generate Quiz",
                "Choose a method to create your quiz quickly and easily.":
                    "Choose a method to create your quiz quickly and easily.",
                "From Document PDF": "From Document PDF",
                "Upload PDF files to generate questions from your own materials.":
                    "Upload PDF files to generate questions from your own materials.",
                "From Images": "From Images",
                "Upload images containing text, diagrams, or visual information to create visual quizzes.":
                    "Upload images containing text, diagrams, or visual information to create visual quizzes.",
                "YouTube Video": "YouTube Video",
                "Transform any YouTube video into a comprehensive quiz by providing a URL.":
                    "Transform any YouTube video into a comprehensive quiz by providing a URL.",
                "From subject": "From subject",
                "Create a custom quiz from any topic or subject area you specify.":
                    "Create a custom quiz from any topic or subject area you specify.",
                "Custom quiz": "Custom quiz",
                "Write your own questions and answers for complete control over quiz content.":
                    "Write your own questions and answers for complete control over quiz content.",
            },
            fr: {
                "Generate Quiz": "Générer un quiz",
                "Choose a method to create your quiz quickly and easily.":
                    "Choisissez une méthode pour créer votre quiz rapidement et facilement.",
                "From Document PDF": "À partir d'un document PDF",
                "Upload PDF files to generate questions from your own materials.":
                    "Téléchargez des fichiers PDF pour générer des questions à partir de vos propres documents.",
                "From Images": "À partir d'images",
                "Upload images containing text, diagrams, or visual information to create visual quizzes.":
                    "Téléchargez des images contenant du texte, des schémas ou des informations visuelles pour créer des quiz visuels.",
                "YouTube Video": "Vidéo YouTube",
                "Transform any YouTube video into a comprehensive quiz by providing a URL.":
                    "Transformez n'importe quelle vidéo YouTube en un quiz complet en fournissant une URL.",
                "From subject": "À partir d'un sujet",
                "Create a custom quiz from any topic or subject area you specify.":
                    "Créez un quiz personnalisé à partir de n'importe quel sujet ou domaine que vous spécifiez.",
                "Custom quiz": "Quiz personnalisé",
                "Write your own questions and answers for complete control over quiz content.":
                    "Rédigez vos propres questions et réponses pour un contrôle total du contenu du quiz.",
            },
            ar: {
                "Generate Quiz": "إنشاء اختبار",
                "Choose a method to create your quiz quickly and easily.":
                    "اختر طريقة لإنشاء اختبارك بسرعة وسهولة.",
                "From Document PDF": "من ملف PDF",
                "Upload PDF files to generate questions from your own materials.":
                    "قم بتحميل ملفات PDF لإنشاء أسئلة من موادك الخاصة.",
                "From Images": "من الصور",
                "Upload images containing text, diagrams, or visual information to create visual quizzes.":
                    "قم بتحميل صور تحتوي على نصوص أو مخططات أو معلومات مرئية لإنشاء اختبارات بصرية.",
                "YouTube Video": "فيديو يوتيوب",
                "Transform any YouTube video into a comprehensive quiz by providing a URL.":
                    "حوّل أي فيديو يوتيوب إلى اختبار شامل من خلال توفير الرابط.",
                "From subject": "من موضوع",
                "Create a custom quiz from any topic or subject area you specify.":
                    "أنشئ اختبارًا مخصصًا من أي موضوع أو مجال تحدده.",
                "Custom quiz": "اختبار مخصص",
                "Write your own questions and answers for complete control over quiz content.":
                    "اكتب أسئلتك وإجاباتك الخاصة لتحكم كامل في محتوى الاختبار.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const items = useMemo(() => {
        return [
            {
                price: highPrice,
                disabled: isSmallScreen,
                value: "document",
                text: t["From Document PDF"],
                icon: <FileTextIcon className="!w-7 !h-7 text-indigo-500" />,
                description:
                    t[
                        "Upload PDF files to generate questions from your own materials."
                    ],
            },
            {
                price: highPrice,
                disabled: false,
                value: "image",
                text: t["From Images"],
                icon: <ImageIcon className="!w-7 text-indigo-500 !h-7" />,
                description:
                    t[
                        "Upload images containing text, diagrams, or visual information to create visual quizzes."
                    ],
            },
            {
                price: highPrice,
                disabled: false,
                value: "youtube",
                text: t["YouTube Video"],
                icon: <Video className="!w-7 text-indigo-500 !h-7" />,
                description:
                    t[
                        "Transform any YouTube video into a comprehensive quiz by providing a URL."
                    ],
            },
            {
                disabled: false,
                value: "subject",
                text: t["From subject"],
                price: mediumPrice,
                icon: <LetterTextIcon className="!w-7 text-indigo-500 !h-7" />,
                description:
                    t[
                        "Create a custom quiz from any topic or subject area you specify."
                    ],
            },
            {
                price: 0,
                disabled: isSmallScreen,
                value: "custom-quiz",
                text: t["Custom quiz"],
                icon: <Edit className="!w-7 text-indigo-500 !h-7" />,
                description:
                    t[
                        "Write your own questions and answers for complete control over quiz content."
                    ],
            },
        ] as const
    }, [isSmallScreen, t])

    return (
        <main className="flex relative flex-col items-center w-full min-h-screen p-6 bg-white">
            <div className="max-w-3xl w-full text-center">
                <h1 className="text-4xl font-extrabold text-neutral-700 pt-6">
                    {t["Generate Quiz"]}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    {
                        t[
                            "Choose a method to create your quiz quickly and easily."
                        ]
                    }
                </p>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 max-w-[1100px] gap-x-4 gap-y-5 mt-12 ">
                {items
                    .filter((item) => !item.disabled)
                    .map((item) => (
                        <QuizType key={item.text} {...item} />
                    ))}
            </section>
        </main>
    )
}
