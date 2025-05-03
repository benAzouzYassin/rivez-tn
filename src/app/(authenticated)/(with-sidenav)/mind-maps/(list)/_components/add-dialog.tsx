"use client"

import {
    ChevronLeft,
    FileTextIcon,
    ImageIcon,
    LetterTextIcon,
    Plus,
    Video,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import dynamic from "next/dynamic"
import { useRouter } from "nextjs-toploader/app"
import { useState, useMemo } from "react"
import { mindmapsContentDb } from "../../_utils/indexed-db"
import { FileInputLoading } from "./file-input-loading"
import { Badge } from "@/components/ui/badge"
import CreditIcon from "@/components/icons/credit-icon"
import { highPrice, lowPrice } from "@/constants/prices"
import { useCurrentUser } from "@/hooks/use-current-user"
import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import { getLanguage } from "@/utils/get-language"
import { customToFixed } from "@/utils/numbers"
import { useTheme } from "next-themes"

const PdfInput = dynamic(() => import("./pdf-input"), {
    loading: () => <FileInputLoading />,
})
const ImageInput = dynamic(() => import("./image-input"), {
    loading: () => <FileInputLoading />,
})

interface Props {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function AddDialog(props: Props) {
    const isSmallScreen = useIsSmallScreen()
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const { data: user } = useCurrentUser()
    const creditBalance = customToFixed(user?.credit_balance, 1)
    const [currentTab, setCurrentTab] = useState<
        "subject" | "document" | "youtube" | "image" | null
    >(null)
    const [imagesInBase64, setImagesInBase64] = useState<string[]>([])
    const [language, setLanguage] = useState("")
    const [topic, setTopic] = useState("")
    const [instructions, setInstructions] = useState("")
    const [pdfPages, setPdfPages] = useState<
        { textContent: string; imageInBase64: string | null }[]
    >([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const router = useRouter()

    const translation = useMemo(
        () => ({
            en: {
                "Add Mindmap": "Add Mindmap",
                "Generate a Mind Map": "Generate a Mind Map",
                "Text Input": "Text Input",
                "Upload PDF": "Upload PDF",
                "YouTube Video": "YouTube Video",
                "Extract from Images": "Extract from Images",
                "Create a mind map from any topic or subject you specify.":
                    "Create a mind map from any topic or subject you specify.",
                "Upload a PDF file to generate questions from its content.":
                    "Upload a PDF file to generate questions from its content.",
                "Convert a YouTube video into a mind map by entering its URL.":
                    "Convert a YouTube video into a mind map by entering its URL.",
                "Upload images with text to generate visual mind maps.":
                    "Upload images with text to generate visual mind maps.",
                Back: "Back",
                "Topic or Subject": "Topic or Subject",
                "Enter the main topic or subject for the mind map.":
                    "Enter the main topic or subject for the mind map.",
                "Additional Instructions": "Additional Instructions",
                "Provide any specific guidelines or requests for AI processing.":
                    "Provide any specific guidelines or requests for AI processing.",
                "Generate Mind Map": "Generate Mind Map",
                "Youtube url": "Youtube url",
                "https://www.youtube.com/watch?v=something":
                    "https://www.youtube.com/watch?v=something",
                "Insufficient credits": "Insufficient credits",
                "You do not have enough credits to perform this action.":
                    "You do not have enough credits to perform this action.",
            },
            fr: {
                "Add Mindmap": "Ajouter",
                "Generate a Mind Map": "Générer une carte mentale",
                "Text Input": "Saisie de texte",
                "Upload PDF": "Télécharger un PDF",
                "YouTube Video": "Vidéo YouTube",
                "Extract from Images": "Extraire des images",
                "Create a mind map from any topic or subject you specify.":
                    "Créez une carte mentale à partir de n'importe quel sujet que vous spécifiez.",
                "Upload a PDF file to generate questions from its content.":
                    "Téléchargez un fichier PDF pour générer des questions à partir de son contenu.",
                "Convert a YouTube video into a mind map by entering its URL.":
                    "Convertissez une vidéo YouTube en carte mentale en entrant son URL.",
                "Upload images with text to generate visual mind maps.":
                    "Téléchargez des images avec du texte pour générer des cartes mentales visuelles.",
                Back: "Retour",
                "Topic or Subject": "Sujet ou thème",
                "Enter the main topic or subject for the mind map.":
                    "Entrez le sujet principal pour la carte mentale.",
                "Additional Instructions": "Instructions supplémentaires",
                "Provide any specific guidelines or requests for AI processing.":
                    "Fournissez des directives spécifiques ou des demandes pour le traitement par IA.",
                "Generate Mind Map": "Générer la carte mentale",
                "Youtube url": "URL YouTube",
                "https://www.youtube.com/watch?v=something":
                    "https://www.youtube.com/watch?v=something",
                "Insufficient credits": "Crédits insuffisants",
                "You do not have enough credits to perform this action.":
                    "Vous n'avez pas assez de crédits pour effectuer cette action.",
            },
            ar: {
                "Add Mindmap": "إضافة ",
                "Generate a Mind Map": "إنشاء خريطة ذهنية",
                "Text Input": "إدخال نص",
                "Upload PDF": "رفع ملف PDF",
                "YouTube Video": "فيديو يوتيوب",
                "Extract from Images": "استخراج من الصور",
                "Create a mind map from any topic or subject you specify.":
                    "أنشئ خريطة ذهنية من أي موضوع تحدده.",
                "Upload a PDF file to generate questions from its content.":
                    "قم بتحميل ملف PDF لإنشاء أسئلة من محتواه.",
                "Convert a YouTube video into a mind map by entering its URL.":
                    "حوّل فيديو يوتيوب إلى خريطة ذهنية بإدخال الرابط.",
                "Upload images with text to generate visual mind maps.":
                    "قم بتحميل صور تحتوي على نص لإنشاء خرائط ذهنية بصرية.",
                Back: "عودة",
                "Topic or Subject": "الموضوع أو العنوان",
                "Enter the main topic or subject for the mind map.":
                    "أدخل الموضوع الرئيسي للخريطة الذهنية.",
                "Additional Instructions": "تعليمات إضافية",
                "Provide any specific guidelines or requests for AI processing.":
                    "قدم أي إرشادات أو طلبات محددة لمعالجة الذكاء الاصطناعي.",
                "Generate Mind Map": "إنشاء الخريطة الذهنية",
                "Youtube url": "رابط يوتيوب",
                "https://www.youtube.com/watch?v=something":
                    "https://www.youtube.com/watch?v=something",
                "Insufficient credits": "رصيد غير كافٍ",
                "You do not have enough credits to perform this action.":
                    "ليس لديك رصيد كافٍ لتنفيذ هذا الإجراء.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const items = [
        {
            price: lowPrice,
            disabled: false,
            value: "subject",
            text: t["Text Input"],
            icon: (
                <LetterTextIcon className="w-7 text-indigo-500 dark:text-neutral-300/90 h-7" />
            ),
            description:
                t["Create a mind map from any topic or subject you specify."],
        },
        {
            price: highPrice,
            disabled: isSmallScreen,
            value: "document",
            text: t["Upload PDF"],
            icon: (
                <FileTextIcon className="w-7 h-7 text-indigo-500 dark:text-neutral-300/90" />
            ),
            description:
                t["Upload a PDF file to generate questions from its content."],
        },
        {
            price: highPrice,
            disabled: false,
            value: "youtube",
            text: t["YouTube Video"],
            icon: (
                <Video className="w-7 text-indigo-500 dark:text-neutral-300/90 h-7" />
            ),
            description:
                t[
                    "Convert a YouTube video into a mind map by entering its URL."
                ],
        },
        {
            price: highPrice,
            disabled: false,
            value: "image",
            text: t["Extract from Images"],
            icon: (
                <ImageIcon className="w-7 text-indigo-500 dark:text-neutral-300/90 h-7" />
            ),
            description:
                t["Upload images with text to generate visual mind maps."],
        },
    ]

    const handleCardClick = (tab: string) => {
        setCurrentTab(tab as any)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (currentTab === "subject") {
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=subject&topic=${topic}&language=${language}&additionalInstructions=${instructions}`
                )
            }
            if (currentTab === "document") {
                const pdfPagesLocalId = await mindmapsContentDb.content.add({
                    pdfPages,
                    imagesInBase64: [],
                })
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=document&pdfPagesLocalId=${pdfPagesLocalId}&language=${language}&additionalInstructions=${instructions}`
                )
            }
            if (currentTab === "image") {
                const imagesBase64DbId = await mindmapsContentDb.content.add({
                    pdfPages: [],
                    imagesInBase64,
                })
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=image&imagesInBase64Id=${imagesBase64DbId}&language=${language}&additionalInstructions=`
                )
            }
            if (currentTab === "youtube") {
                router.push(
                    `/mind-maps/generate?youtubeUrl=${youtubeUrl}&shouldGenerate=true&contentType=youtube&language=${language}&additionalInstructions=`
                )
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Dialog
                onOpenChange={(value) => {
                    if (value === false) {
                        wait(300).then(() => {
                            setCurrentTab(null)
                        })
                    }
                    props.setIsOpen(value)
                }}
                open={props.isOpen}
            >
                <DialogTrigger asChild>
                    <Button
                        variant={isDark ? "blue" : "default"}
                        className="text-base md:w-fit w-full h-[3.2rem]"
                    >
                        <Plus className="-mr-1 !w-5 stroke-2 !h-5" />{" "}
                        {t["Add Mindmap"]}
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className={cn(
                        "sm:min-w-[1000px]  md:w-[1000px] md:max-w-[1000px] overflow-y-auto bg-white dark:bg-neutral-900 transition-colors",
                        {
                            "w-[1000px]": currentTab === null,
                        }
                    )}
                >
                    <DialogHeader className="md:block hidden">
                        <DialogTitle className="md:text-4xl text-2xl mt-20 md:mt-2 text-center font-bold text-neutral-500 dark:text-neutral-200">
                            {t["Generate a Mind Map"]}
                        </DialogTitle>
                        <DialogDescription className="text-neutral-600 dark:text-neutral-400"></DialogDescription>
                    </DialogHeader>

                    {!currentTab && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-[90vw] gap-x-4 gap-y-5 md:mt-6">
                            {items
                                .filter((item) => !item.disabled)
                                .map((item) => (
                                    <Card
                                        key={item.value}
                                        onClick={() => {
                                            if (
                                                Number(creditBalance) <
                                                item.price
                                            ) {
                                                return setIsInsufficientCredits(
                                                    true
                                                )
                                            }
                                            handleCardClick(item.value)
                                        }}
                                        className={cn(
                                            "p-4 flex h-28 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 cursor-pointer transition-all active:shadow-none active:translate-y-2 items-center gap-4 rounded-2xl bg-white  border border-neutral-200 dark:border-neutral-700",
                                            {
                                                "bg-neutral-200 dark:bg-neutral-800 active:translate-y-0 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-not-allowed border border-neutral-300 dark:border-neutral-700":
                                                    item.disabled,
                                            }
                                        )}
                                    >
                                        <span className="bg-blue-100  dark:bg-blue-700/50 flex items-center p-2 rounded-xl w-fit">
                                            {item.icon}
                                        </span>
                                        <div>
                                            <div className="flex items-center ">
                                                <h3 className="text-xl text-neutral-700 dark:text-neutral-100 font-bold pt-1">
                                                    {item.text}
                                                </h3>
                                                <Badge
                                                    variant={"blue"}
                                                    className="py-0 scale-80 px-2 font-bold inline-flex gap-[3px] ml-1 !text-lg"
                                                >
                                                    {item.price}{" "}
                                                    <CreditIcon className="!w-5 !h-5" />
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    )}
                    {currentTab !== null && (
                        <Button
                            onClick={() => setCurrentTab(null)}
                            variant={"secondary"}
                            className="absolute gap-1 rtl:right-3 ltr:left-3 text-base font-bold text-neutral-500 dark:text-neutral-300 top-5 rounded-xl"
                        >
                            <ChevronLeft className="min-w-6 min-h-6" />
                            {t["Back"]}
                        </Button>
                    )}
                    {currentTab === "document" && (
                        <form onSubmit={handleSubmit} className="mt-6">
                            <PdfInput onPDFPagesChanges={setPdfPages} />

                            <Button
                                variant={isDark ? "blue" : "default"}
                                type="submit"
                                className="text-lg mt-5 h-[52px] w-full"
                                isLoading={isSubmitting}
                                disabled={pdfPages.length === 0}
                            >
                                {t["Generate Mind Map"]}
                            </Button>
                        </form>
                    )}
                    {currentTab === "image" && (
                        <form onSubmit={handleSubmit} className="mt-6">
                            <ImageInput onChange={setImagesInBase64} />
                            <Button
                                variant={isDark ? "blue" : "default"}
                                type="submit"
                                className="text-lg mt-5 h-[52px] w-full"
                                isLoading={isSubmitting}
                                disabled={imagesInBase64.length === 0}
                            >
                                {t["Generate Mind Map"]}
                            </Button>
                        </form>
                    )}
                    {currentTab === "subject" && (
                        <form onSubmit={handleSubmit} className="mt-5 pb-0">
                            <div>
                                <label
                                    htmlFor="text"
                                    className="font-medium text-neutral-600 dark:text-neutral-300"
                                >
                                    {t["Topic or Subject"]}
                                    <span className="text-red-400 text-xl font-semibold">
                                        *
                                    </span>
                                </label>
                                <Textarea
                                    errorMessage=""
                                    className="h-28 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
                                    id="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder={
                                        t[
                                            "Enter the main topic or subject for the mind map."
                                        ]
                                    }
                                    required
                                />
                            </div>
                            <div className="-mt-1"></div>
                            <div>
                                <label
                                    htmlFor="requirement"
                                    className="font-medium text-neutral-600 dark:text-neutral-300"
                                >
                                    {t["Additional Instructions"]}
                                </label>
                                <Textarea
                                    className="h-24 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
                                    id="requirement"
                                    value={instructions}
                                    onChange={(e) =>
                                        setInstructions(e.target.value)
                                    }
                                    placeholder={
                                        t[
                                            "Provide any specific guidelines or requests for AI processing."
                                        ]
                                    }
                                />
                            </div>
                            <Button
                                variant={isDark ? "blue" : "default"}
                                type="submit"
                                className="text-lg h-[52px] w-full"
                                isLoading={isSubmitting}
                                disabled={!topic}
                            >
                                {t["Generate Mind Map"]}
                            </Button>
                        </form>
                    )}
                    {currentTab === "youtube" && (
                        <form onSubmit={handleSubmit} className="mt-5 pb-0">
                            <div>
                                <label
                                    htmlFor="text"
                                    className="font-medium text-neutral-600 dark:text-neutral-300"
                                >
                                    {t["Youtube url"]}
                                    <span className="text-red-400 text-xl font-semibold">
                                        *
                                    </span>
                                </label>
                                <Input
                                    errorMessage=""
                                    className="w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
                                    id="text"
                                    value={youtubeUrl}
                                    onChange={(e) =>
                                        setYoutubeUrl(e.target.value)
                                    }
                                    placeholder={
                                        t[
                                            "https://www.youtube.com/watch?v=something"
                                        ]
                                    }
                                    required
                                />
                            </div>
                            <div className="-mt-1"></div>

                            <Button
                                variant={isDark ? "blue" : "default"}
                                type="submit"
                                className="text-lg h-[52px] w-full"
                                isLoading={isSubmitting}
                                disabled={!youtubeUrl}
                            >
                                {t["Generate Mind Map"]}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={setIsInsufficientCredits}
            />
        </>
    )
}
