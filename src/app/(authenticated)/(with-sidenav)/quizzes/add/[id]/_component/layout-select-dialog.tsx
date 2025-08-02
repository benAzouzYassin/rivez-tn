import CreditIcon from "@/components/icons/credit-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { lowPrice } from "@/constants/prices"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { getLanguage } from "@/utils/get-language"
import { wait } from "@/utils/wait"
import { ArrowLeft, Edit, Sparkles } from "lucide-react"
import { ReactNode, useMemo, useRef, useState } from "react"
import { Store } from "../store"
import AddQuestionWithAiForm from "./add-question-with-ai-form"
import MatchingPairs from "./layouts-icons/matching-pairs"
import MultipleChoiceHorizontal from "./layouts-icons/multiple-choice-horizontal"
import MultipleChoiceVertical from "./layouts-icons/multiple-choice-vertical"

type Props = {
    contentClassName?: string
    trigger: ReactNode
    onSelect: (layoutType: LayoutOptions) => void
    enableAi?: boolean
    onSelectWithAi?: (
        layoutType: LayoutOptions,
        data: Omit<
            Parameters<Store["addQuestionWithAi"]>["0"]["aiData"],
            "questionType"
        >
    ) => void
}

export default function LayoutSelectDialog(props: Props) {
    const translation = useMemo(
        () => ({
            en: {
                selectLayout: "Select a question layout",
                useAi: "Use AI",
                useAiDesc:
                    "Generate content automatically with our smart assistant",
                custom: "Custom",
                customDesc: "Create your own content with our editing tools",
                back: "Back",
                modeSelect: "Do you want to use AI?",
                imageLeft: "Image on left, options on right",
                imageTop: "Image on the top, options on bottom",
                termsLeft: "Terms on left, definitions on right",
                noImage: "Options without an image.",
            },
            fr: {
                selectLayout: "Sélectionnez une disposition de question",
                useAi: "Utiliser l'IA",
                useAiDesc:
                    "Générez du contenu automatiquement avec notre assistant intelligent",
                custom: "Personnalisé",
                customDesc:
                    "Créez votre propre contenu avec nos outils d'édition",
                back: "Retour",
                modeSelect: "Voulez-vous utiliser l'IA ?",
                imageLeft: "Image à gauche, options à droite",
                imageTop: "Image en haut, options en bas",
                termsLeft: "Termes à gauche, définitions à droite",
                noImage: "Options sans image.",
            },
            ar: {
                selectLayout: "اختر نوع السؤال",
                useAi: "استخدم الذكاء الاصطناعي",
                useAiDesc: "أنشئ المحتوى تلقائيًا بمساعدنا الذكي",
                custom: "مخصص",
                customDesc: "أنشئ المحتوى بنفسك باستخدام أدوات التحرير",
                back: "رجوع",
                modeSelect: "هل تريد استخدام الذكاء الاصطناعي؟",
                imageLeft: "صورة على اليسار، الخيارات على اليمين",
                imageTop: "صورة في الأعلى، الخيارات في الأسفل",
                termsLeft: "المصطلحات على اليسار، التعريفات على اليمين",
                noImage: "خيارات بدون صورة.",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const { data: userData } = useCurrentUser()
    const price = lowPrice
    const [isOpen, setIsOpen] = useState(false)
    const [tab, setTab] = useState<"layout-select" | "mode-select" | "ai-form">(
        "layout-select"
    )
    const selectedLayout = useRef<LayoutOptions>(null)
    const handleLayoutSelect = (layout: LayoutOptions) => {
        const customerCredit = Number(userData?.credit_balance || "0")
        if (props.enableAi && customerCredit >= lowPrice) {
            selectedLayout.current = layout
            setTab("mode-select")
        } else {
            props.onSelect(layout)
            setIsOpen(false)
        }
    }
    const handleModeSelect = (mode: "ai" | "custom") => {
        if (mode === "custom") {
            setIsOpen(false)
            wait(100).then(() => {
                setTab("layout-select")
                props.onSelect?.(selectedLayout.current!)
                selectedLayout.current = null
            })
        }
        if (mode === "ai") {
            setTab("ai-form")
        }
    }
    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent
                className={cn(
                    "rounded-xl pb-6 !min-w-[900px] overflow-hidden border w-[900px] max-w-[900px] dark:bg-neutral-900 dark:border-neutral-800",
                    props.contentClassName,
                    {
                        "w-fit": tab === "mode-select",
                    }
                )}
            >
                <div className="p-4 ">
                    <DialogTitle
                        className={cn(
                            "text-center pb-3 text-neutral-500 dark:text-neutral-100   font-extrabold text-3xl",
                            { "opacity-0": tab === "ai-form" }
                        )}
                    >
                        {tab === "layout-select"
                            ? t.selectLayout
                            : t.modeSelect}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </div>
                {tab === "ai-form" && (
                    <AddQuestionWithAiForm
                        onBackClick={() => setTab("mode-select")}
                        onSubmit={(data) => {
                            setIsOpen(false)
                            props.onSelectWithAi?.(
                                selectedLayout.current!,
                                data
                            )
                            wait(100).then(() => {
                                setTab("layout-select")
                                selectedLayout.current = null
                            })
                        }}
                    />
                )}
                {tab === "mode-select" && (
                    <div className="grid relative grid-cols-2 mx-auto py-3 gap-6 w-full max-w-2xl">
                        <Button
                            onClick={() => setTab("layout-select")}
                            className="absolute -top-24 rtl:-left-14  text-base"
                            variant={"secondary"}
                        >
                            <ArrowLeft className="!w-6 !h-6 text-neutral-400 dark:text-neutral-300 stroke-[2.5]" />
                        </Button>
                        <Card
                            onClick={() => handleModeSelect("ai")}
                            asButton
                            className="cursor-pointer active:translate-y-1 active:shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-700/50 border-3 dark:border-neutral-700 transition-all group overflow-hidden relative "
                        >
                            <CardContent className="flex flex-col items-center justify-center p-6 h-56">
                                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mb-4">
                                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="text-2xl font-bold text-blue-500 dark:text-blue-300 mb-2">
                                    {t.useAi}
                                    <Badge
                                        variant={"blue"}
                                        className="ml-px -mt-1 scale-80 py-0 px-2 font-bold inline-flex gap-[3px] !text-lg"
                                    >
                                        {price}{" "}
                                        <CreditIcon className="!w-5 !h-5" />
                                    </Badge>
                                </div>
                                <p className="text-base text-neutral-500 dark:text-neutral-300 font-medium text-center mb-3">
                                    {t.useAiDesc}
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => handleModeSelect("custom")}
                            asButton
                            className="cursor-pointer active:translate-y-1 active:shadow-none border-3 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all group overflow-hidden relative"
                        >
                            <CardContent className="flex flex-col items-center justify-center p-6 h-56">
                                <div className="bg-gray-100 dark:bg-neutral-700 rounded-full p-3 mb-4">
                                    <Edit className="h-6 w-6 text-neutral-600 dark:text-neutral-200 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-2">
                                    {t.custom}
                                </p>
                                <p className="text-base text-neutral-500 dark:text-neutral-300 font-medium text-center mb-3">
                                    {t.customDesc}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {tab === "layout-select" && (
                    <>
                        <div className="p-0">
                            <div className="p-0 grid gap-y-5 grid-cols-2">
                                <div className="fle flex-col items-center justify-center">
                                    <h3 className="text-base font-bold text-neutral-500 dark:text-neutral-300 text-center">
                                        {t.imageLeft}
                                    </h3>
                                    <div
                                        onClick={() => {
                                            handleLayoutSelect(
                                                "horizontal-multiple-choice"
                                            )
                                        }}
                                        className="ml-auto mt-1 flex items-center justify-center"
                                    >
                                        <MultipleChoiceHorizontal
                                            imageClassName="!h-[140px]  !w-[130px] ml-2 mt-6"
                                            itemClassName="!h-7 mt-1 first:mt-5 !w-[110px]"
                                            className="!w-[290px]  h-[210px]"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect(
                                            "vertical-multiple-choice"
                                        )
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 dark:text-neutral-300 text-center">
                                        {t.imageTop}
                                    </h3>
                                    <MultipleChoiceVertical
                                        textClassName="hidden"
                                        imageClassName="h-20 w-[90%] mx-auto mt-4"
                                        itemClassName="h-7 mt-1 w-[85%] odd:ml-4 even:ml-1"
                                        className="!w-[310px] h-[210px]"
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect("fill-in-the-blank")
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 dark:text-neutral-300 text-center">
                                        {t.termsLeft}
                                    </h3>

                                    <MatchingPairs
                                        itemClassName="h-6 mt-1"
                                        className="!w-[290px] pt-4 px-5 h-[210px]"
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect(
                                            "multiple-choice-without-image"
                                        )
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 dark:text-neutral-300 text-center">
                                        {t.noImage}
                                    </h3>
                                    <MultipleChoiceVertical
                                        textClassName="mb-7 mt-8"
                                        imageClassName="hidden"
                                        itemClassName="h-8  mt-1 w-[85%] odd:ml-4 even:ml-1"
                                        className="!w-[310px] h-[210px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export type LayoutOptions =
    | "vertical-multiple-choice"
    | "horizontal-multiple-choice"
    | "matching-pairs"
    | "multiple-choice-without-image"
    | "fill-in-the-blank"
