"use client"

import { highPrice, lowPrice, mediumPrice } from "@/constants/prices"
import { ArrowLeft, FileTextIcon, ImageIcon, Video } from "lucide-react"
import { useMemo, useState } from "react"
import Item from "./item"
import YoutubeLinkDialog from "./youtube-link-dialog"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import { getLanguage } from "@/utils/get-language"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface Props {
    onBack: () => void
    hideBack?: boolean
}
export default function Add(props: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const isSmallScreen = useIsSmallScreen()
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const translation = useMemo(
        () => ({
            en: {
                "Summarize something": "Summarize something",
                "Choose a method to create your summary quickly and easily.":
                    "Choose a method to create your summary quickly and easily.",
                "PDF Document": "PDF Document",
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
                "PDF Document": "Document PDF",
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
                "PDF Document": "مستند PDF",
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
                    text: t["PDF Document"],
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
        <main
            className={
                isDark
                    ? "flex relative flex-col items-center w-full min-h-screen md:p-6 bg-neutral-900 transition-colors"
                    : "flex relative flex-col items-center w-full min-h-screen md:p-6 bg-white transition-colors"
            }
        >
            {!props.hideBack && (
                <Button
                    onClick={props.onBack}
                    className={
                        isDark
                            ? "absolute left-6 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                            : "absolute left-6"
                    }
                    variant={"secondary"}
                >
                    <ArrowLeft className="w-6 min-w-6 min-h-6 stroke-[2.5] text-neutral-500 h-6 dark:text-neutral-300" />
                </Button>
            )}
            <div className="max-w-3xl w-full text-center">
                <h1
                    className={
                        isDark
                            ? "md:text-4xl text-3xl font-extrabold text-neutral-100 pt-6"
                            : "md:text-4xl text-3xl font-extrabold text-neutral-700 pt-6"
                    }
                >
                    {t["Summarize something"]}
                </h1>
                <p
                    className={
                        isDark
                            ? "text-lg text-neutral-400 mt-2"
                            : "text-lg text-gray-600 mt-2"
                    }
                >
                    {
                        t[
                            "Choose a method to create your summary quickly and easily."
                        ]
                    }
                </p>
            </div>
            <section className="grid md:px-0 px-3 grid-cols-1 sm:grid-cols-2 max-w-[850px] pb-10 gap-x-10 gap-y-7 mt-10">
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
