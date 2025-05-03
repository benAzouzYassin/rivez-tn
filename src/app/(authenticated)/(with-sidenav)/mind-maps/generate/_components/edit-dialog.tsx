"use client"

import { Save } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TGeneratedMindmap } from "@/data-access/mindmaps/constants"
import { generateEditedVersion } from "@/data-access/mindmaps/generate-edited-version"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { Edge, Node } from "@xyflow/react"
import { useQueryState } from "nuqs"
import { useRef, useState, useMemo } from "react"
import { convertItemsToNodes } from "../../_utils/convert-to-nodes"
import { CHEAP_TYPES } from "../constants"
import { handleMindMapRefund } from "@/data-access/mindmaps/handle-refund"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { Badge } from "@/components/ui/badge"
import { lowPrice } from "@/constants/prices"
import CreditIcon from "@/components/icons/credit-icon"
import { useTheme } from "next-themes"
import { getLanguage } from "@/utils/get-language"

interface Props {
    setNodes: (nodes: Node[]) => void
    setEdges: (nodes: Edge[]) => void
    isOpen: boolean
    mindMap: TGeneratedMindmap | undefined
    onOpenChange: (value: boolean) => void
    setAiResult: (data: TGeneratedMindmap) => void
    contentType: string | null
}

export default function EditMindmapDialog(props: Props) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const refetchUser = useRefetchUser()
    const [editInstructions, setEditInstructions] = useState("")
    const [language, setLanguage] = useQueryState("language")
    const newGeneratedResult = useRef<TGeneratedMindmap>(null)

    // Translation object
    const translation = useMemo(
        () => ({
            en: {
                title: "Modify mindmap with AI",
                describe:
                    "Describe the changes you want to make to your existing mindmap.",
                describeLabel: "Describe Your Changes",
                describePlaceholder: "Example: Change the language to ...",
                describeHint:
                    "Be specific about what you want to add, remove, or modify.",
                language: "Language",
                languagePlaceholder: "Same as original (recommended)",
                languageHint:
                    "Choose a different language or keep the original.",
                cancel: "Cancel",
                save: "Save Changes",
                modifying: "Modifying your mindmap",
                error: "Something went wrong",
                success: "Modified successfully.",
                required: "*",
                english: "English",
                arabic: "Arabic",
                french: "French",
            },
            fr: {
                title: "Modifier la carte mentale avec l'IA",
                describe:
                    "Décrivez les modifications que vous souhaitez apporter à votre carte mentale existante.",
                describeLabel: "Décrivez vos modifications",
                describePlaceholder: "Exemple : Changer la langue en ...",
                describeHint:
                    "Soyez précis sur ce que vous souhaitez ajouter, supprimer ou modifier.",
                language: "Langue",
                languagePlaceholder: "Identique à l'original (recommandé)",
                languageHint:
                    "Choisissez une langue différente ou gardez l'originale.",
                cancel: "Annuler",
                save: "Enregistrer les modifications",
                modifying: "Modification de votre carte mentale",
                error: "Une erreur s'est produite",
                success: "Modifié avec succès.",
                required: "*",
                english: "Anglais",
                arabic: "Arabe",
                french: "Français",
            },
            ar: {
                title: "تعديل الخريطة الذهنية بالذكاء الاصطناعي",
                describe:
                    "صف التغييرات التي تريد إجراؤها على خريطتك الذهنية الحالية.",
                describeLabel: "صف التغييرات المطلوبة",
                describePlaceholder: "مثال: غيّر اللغة إلى ...",
                describeHint:
                    "كن محددًا بشأن ما تريد إضافته أو إزالته أو تعديله.",
                language: "اللغة",
                languagePlaceholder: "نفس الأصل (موصى به)",
                languageHint: "اختر لغة مختلفة أو احتفظ بالأصل.",
                cancel: "إلغاء",
                save: "حفظ التغييرات",
                modifying: "جارٍ تعديل الخريطة الذهنية",
                error: "حدث خطأ ما",
                success: "تم التعديل بنجاح.",
                required: "*",
                english: "الإنجليزية",
                arabic: "العربية",
                french: "الفرنسية",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const handleSubmit = () => {
        let didGenerate = false
        toastLoading(t.modifying)
        props.onOpenChange(false)
        const onChange = (data: TGeneratedMindmap) => {
            didGenerate = true
            newGeneratedResult.current = data
            try {
                const [nodes, edges] = convertItemsToNodes(
                    data.items.map((item) => {
                        const loadingSubitemsCount =
                            item.subItemsCount - (item.subItems?.length || 0)
                        const loadingSubItems =
                            loadingSubitemsCount > 0
                                ? Array.from({
                                      length: loadingSubitemsCount,
                                  }).map((_) => {
                                      return {
                                          language: language,
                                          isLoading: true,
                                          description: "",
                                          id: crypto.randomUUID(),
                                          title: "",
                                          subItems: [],
                                          markdownContent: "",
                                          enableSheet: false,
                                          enableDelete: false,
                                      }
                                  })
                                : []
                        return {
                            language: language || undefined,
                            isLoading: false,
                            description: item.description,
                            id: item.id,
                            title: item.title,
                            subItems: [
                                ...(item.subItems?.map((subItem) => ({
                                    ...subItem,
                                })) || []),
                                ...loadingSubItems,
                            ],
                            markdownContent: "",
                            enableSheet: false,
                            enableDelete: true,
                        }
                    }),
                    null,
                    undefined,
                    undefined,
                    {
                        isDark,
                    }
                )
                if (nodes.length) {
                    props.setNodes(
                        nodes.map((node) => ({
                            ...node,
                            data: { ...node.data, enableDelete: true },
                        }))
                    )
                }
                if (edges.length) props.setEdges(edges)
            } catch {}
        }

        const onStreamEnd = () => {
            dismissToasts("loading")

            if (!didGenerate || !newGeneratedResult.current) {
                toastError(t.error)
                handleFallBack()
                handleMindMapRefund({
                    generationType: CHEAP_TYPES.includes(
                        props.contentType as any
                    )
                        ? "CHEAP"
                        : "NORMAL",
                }).catch(console.error)
            } else {
                props.setAiResult(newGeneratedResult.current)

                toastSuccess(t.success)
                refetchUser()
            }
        }
        generateEditedVersion(
            {
                editInstructions,
                language: language,
                originalMindmap: JSON.stringify(props.mindMap || {}),
            },
            onChange,
            onStreamEnd
        ).catch((err) => {
            dismissToasts("loading")
            toastError(t.error)
            handleMindMapRefund({
                generationType: CHEAP_TYPES.includes(props.contentType as any)
                    ? "CHEAP"
                    : "NORMAL",
            }).catch(console.error)
        })
    }
    const handleFallBack = () => {
        if (!props.mindMap) return
        const [nodes, edges] = convertItemsToNodes(
            props.mindMap.items.map((item) => {
                const loadingSubitemsCount =
                    item.subItemsCount - (item.subItems?.length || 0)
                const loadingSubItems =
                    loadingSubitemsCount > 0
                        ? Array.from({
                              length: loadingSubitemsCount,
                          }).map((_) => {
                              return {
                                  language: language,
                                  isLoading: true,
                                  description: "",
                                  id: crypto.randomUUID(),
                                  title: "",
                                  subItems: [],
                                  markdownContent: "",
                                  enableSheet: false,
                                  enableDelete: false,
                              }
                          })
                        : []
                return {
                    language: language || undefined,
                    isLoading: false,
                    description: item.description,
                    id: item.id,
                    title: item.title,
                    subItems: [
                        ...(item.subItems?.map((subItem) => ({
                            ...subItem,
                        })) || []),
                        ...loadingSubItems,
                    ],
                    markdownContent: "",
                    enableSheet: false,
                    enableDelete: true,
                }
            }),
            null,
            undefined,
            undefined,
            {
                isDark,
            }
        )
        props.setNodes(nodes)
        props.setEdges(edges)
    }
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-700 dark:text-neutral-100">
                        {t.title}{" "}
                        <Badge
                            variant={"blue"}
                            className="scale-80 -ml-1 py-0 px-2 font-bold inline-flex gap-[3px]  !text-lg"
                        >
                            {lowPrice} <CreditIcon className="!w-5 !h-5" />
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-neutral-500 dark:text-neutral-300">
                        {t.describe}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    className="mt-4 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="instructions"
                            className="font-medium text-neutral-600 dark:text-neutral-200 block mb-1"
                        >
                            {t.describeLabel}
                            <span className="text-red-400 text-xl font-semibold ml-1">
                                {t.required}
                            </span>
                        </label>
                        <Textarea
                            id="instructions"
                            value={editInstructions}
                            onChange={(e) =>
                                setEditInstructions(e.target.value)
                            }
                            placeholder={t.describePlaceholder}
                            className="h-32"
                            required
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-5 ml-1">
                            {t.describeHint}
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="language"
                            className="font-medium text-neutral-600 dark:text-neutral-200 block"
                        >
                            {t.language}
                        </label>
                        <Select
                            onValueChange={setLanguage}
                            value={language || undefined}
                        >
                            <SelectTrigger id="language" className="w-full">
                                <SelectValue
                                    placeholder={t.languagePlaceholder}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english">
                                    {t.english}
                                </SelectItem>
                                <SelectItem value="arabic">
                                    {t.arabic}
                                </SelectItem>
                                <SelectItem value="french">
                                    {t.french}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-3 ml-1">
                            {t.languageHint}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => props.onOpenChange(false)}
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            variant={isDark ? "blue" : "default"}
                            type="submit"
                            className="gap-1"
                            disabled={!editInstructions.trim()}
                        >
                            <Save size={16} />
                            {t.save}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
