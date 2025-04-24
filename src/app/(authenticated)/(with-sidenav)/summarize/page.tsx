"use client"

import { highPrice, lowPrice, mediumPrice } from "@/constants/prices"
import { FileTextIcon, ImageIcon, Video } from "lucide-react"
import { useMemo, useState } from "react"
import Item from "./_components/item"
import YoutubeLinkDialog from "./_components/youtube-link-dialog"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import { getLanguage } from "@/utils/get-language"

export default function Page() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const isSmallScreen = useIsSmallScreen()

    const translation = useMemo(
        () => ({
            en: {
                "Summarize something": "Summarize something",
                "Choose a method to create your summary quickly and easily.":
                    "Choose a method to create your summary quickly and easily.",
                "PDF Document Upload": "PDF Document Upload",
                "Upload PDF files to generate summaries.":
                    "Upload PDF files to generate summaries.",
                "From Images": "From Images",
                "Upload images containing text, diagrams, or visual information to create summaries.":
                    "Upload images containing text, diagrams, or visual information to create summaries.",
                "YouTube Video": "YouTube Video",
                "Transform any YouTube video into a comprehensive summarized summary by providing a URL.":
                    "Transform any YouTube video into a comprehensive summarized summary by providing a URL.",
            },
            fr: {
                "Summarize something": "Résumez quelque chose",
                "Choose a method to create your summary quickly and easily.":
                    "Choisissez une méthode pour créer votre résumé rapidement et facilement.",
                "PDF Document Upload": "Téléchargement de document PDF",
                "Upload PDF files to generate summaries.":
                    "Téléchargez des fichiers PDF pour générer des résumés.",
                "From Images": "À partir d'images",
                "Upload images containing text, diagrams, or visual information to create summaries.":
                    "Téléchargez des images contenant du texte, des diagrammes ou des informations visuelles pour créer des résumés.",
                "YouTube Video": "Vidéo YouTube",
                "Transform any YouTube video into a comprehensive summarized summary by providing a URL.":
                    "Transformez n'importe quelle vidéo YouTube en un résumé complet en fournissant une URL.",
            },
            ar: {
                "Summarize something": "لخص شيئًا ما",
                "Choose a method to create your summary quickly and easily.":
                    "اختر طريقة لإنشاء ملخصك بسرعة وسهولة.",
                "PDF Document Upload": "تحميل مستند PDF",
                "Upload PDF files to generate summaries.":
                    "قم بتحميل ملفات PDF لإنشاء ملخصات.",
                "From Images": "من الصور",
                "Upload images containing text, diagrams, or visual information to create summaries.":
                    "قم بتحميل الصور التي تحتوي على نصوص أو مخططات أو معلومات بصرية لإنشاء ملخصات.",
                "YouTube Video": "فيديو يوتيوب",
                "Transform any YouTube video into a comprehensive summarized summary by providing a URL.":
                    "حوّل أي فيديو على يوتيوب إلى ملخص شامل عن طريق توفير رابط URL.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const items = useMemo(
        () =>
            [
                {
                    price: lowPrice / 5,
                    isPerPage: true,
                    disabled: isSmallScreen,
                    route: "/pdf-summarizer",
                    text: t["PDF Document Upload"],
                    icon: (
                        <FileTextIcon className="!w-7 !h-7 text-indigo-500" />
                    ),
                    description: t["Upload PDF files to generate summaries."],
                },

                {
                    price: mediumPrice,
                    disabled: false,
                    route: "/image-summarizer",
                    text: t["From Images"],
                    icon: <ImageIcon className="!w-7 text-indigo-500 !h-7" />,
                    description:
                        t[
                            "Upload images containing text, diagrams, or visual information to create summaries."
                        ],
                },
                {
                    price: highPrice,
                    disabled: false,
                    onClick: () => setIsDialogOpen(true),
                    text: t["YouTube Video"],
                    icon: <Video className="!w-7 text-indigo-500 !h-7" />,
                    description:
                        t[
                            "Transform any YouTube video into a comprehensive summarized summary by providing a URL."
                        ],
                },
            ] as const,
        [isSmallScreen, t]
    )

    return (
        <main className="flex relative flex-col items-center w-full min-h-screen md:p-6 bg-white">
            <div className="max-w-3xl w-full text-center">
                <h1 className="md:text-4xl text-3xl font-extrabold text-neutral-700  pt-6">
                    {t["Summarize something"]}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    {
                        t[
                            "Choose a method to create your summary quickly and easily."
                        ]
                    }
                </p>
            </div>

            <section className="grid  md:px-0 px-3  grid-cols-1 sm:grid-cols-2 max-w-[850px] pb-10 gap-x-10 gap-y-7 mt-10 ">
                {items
                    .filter((item) => !item.disabled)
                    .map((item) => (
                        <Item key={item.text} {...item} />
                    ))}
            </section>
            <YoutubeLinkDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
            />
        </main>
    )
}
