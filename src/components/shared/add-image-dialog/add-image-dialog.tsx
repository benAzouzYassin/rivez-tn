"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toastError, toastSuccess } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { maxFileSize, uploadFile } from "@/utils/file-management"
import {
    ArrowLeft,
    ChevronLeft,
    Code2Icon,
    LinkIcon,
    Loader2,
    PencilLine,
    UploadCloud,
} from "lucide-react"
import dynamic from "next/dynamic"
import { ReactNode, useRef, useState, useMemo } from "react"
import CodeSnippets from "./code-snippets"
import { Input } from "@/components/ui/input"
import { wait } from "@/utils/wait"
import { getLanguage } from "@/utils/get-language"

const DrawImage = dynamic(() => import("./draw-image"), {
    loading: () => (
        <div className="w-full h-[100px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        </div>
    ),
    ssr: false,
})

type Props = {
    disabledOptions?: (
        | "image-upload"
        | "image-draw"
        | "code-snippets"
        | "image-url"
    )[]
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    selectedType?:
        | "image-upload"
        | "image-draw"
        | "code-snippets"
        | "image-url"
        | null
    onImageSave: (url: string) => void
    onCodeSnippetsSave?: (
        snippets: {
            name: string
            code: string
            localId: string
            type: string
        }[],
        shouldClose: boolean
    ) => void
}

export default function AddImageDialog({
    disabledOptions = [],
    ...props
}: Props) {
    const [imageUrl, setImageUrl] = useState("")
    const imageUrlInputRef = useRef<HTMLInputElement>(null)
    const [selectedType, setSelectedType] =
        useState<Props["selectedType"]>(null)

    const [codeSnippetTheme, setCodeSnippetTheme] = useState(
        "monokaiOneDarkVivid"
    )
    const [selectedSnippetTab, setSelectedSnippetTab] = useState("1")
    const [codeSnippets, setCodeSnippets] = useState([
        {
            name: "hello.ts",
            code: 'console.log("hello world")',
            localId: "1",
            type: "typescript",
        },
    ])

    const translation = useMemo(
        () => ({
            en: {
                "What type of image do you want?":
                    "What type of image do you want?",
                "Go back": "Go back",
                "Upload Image": "Upload Image",
                "From your device": "From your device",
                "Draw with Excalidraw": "Draw with Excalidraw",
                "Sketch your ideas": "Sketch your ideas",
                "Image link": "Image link",
                "Use an image from a link.": "Use an image from a link.",
                "Code Snippet": "Code Snippet",
                "Beautiful code snippets": "Beautiful code snippets",
                "Enter Image URL": "Enter Image URL",
                "Add Image": "Add Image",
                "Enter the URL of the image you want to use":
                    "Enter the URL of the image you want to use",
                Preview: "Preview",
                "Image URL added successfully.":
                    "Image URL added successfully.",
                "Please enter a valid image URL.":
                    "Please enter a valid image URL.",
                "Unable to load image from URL":
                    "Unable to load image from URL",
                "Image is too large.": "Image is too large.",
                "Image uploaded sccessfully.": "Image uploaded successfully.",
                "Something went wrong.": "Something went wrong.",
            },
            fr: {
                "What type of image do you want?":
                    "Quel type d'image souhaitez-vous ?",
                "Go back": "Retour",
                "Upload Image": "Télécharger une image",
                "From your device": "Depuis votre appareil",
                "Draw with Excalidraw": "Dessiner avec Excalidraw",
                "Sketch your ideas": "Dessinez vos idées",
                "Image link": "Lien d'image",
                "Use an image from a link.":
                    "Utiliser une image à partir d'un lien.",
                "Code Snippet": "Extrait de code",
                "Beautiful code snippets": "Beaux extraits de code",
                "Enter Image URL": "Entrez l'URL de l'image",
                "Add Image": "Ajouter l'image",
                "Enter the URL of the image you want to use":
                    "Entrez l'URL de l'image que vous souhaitez utiliser",
                Preview: "Aperçu",
                "Image URL added successfully.":
                    "URL de l'image ajoutée avec succès.",
                "Please enter a valid image URL.":
                    "Veuillez entrer une URL d'image valide.",
                "Unable to load image from URL":
                    "Impossible de charger l'image depuis l'URL",
                "Image is too large.": "L'image est trop volumineuse.",
                "Image uploaded sccessfully.": "Image téléchargée avec succès.",
                "Something went wrong.": "Une erreur s'est produite.",
            },
            ar: {
                "What type of image do you want?": "ما نوع الصورة التي تريدها؟",
                "Go back": "العودة",
                "Upload Image": "رفع صورة",
                "From your device": "من جهازك",
                "Draw with Excalidraw": "ارسم باستخدام Excalidraw",
                "Sketch your ideas": "ارسم أفكارك",
                "Image link": "رابط صورة",
                "Use an image from a link.": "استخدم صورة من رابط.",
                "Code Snippet": "مقتطف كود",
                "Beautiful code snippets": "مقتطفات كود جميلة",
                "Enter Image URL": "أدخل رابط الصورة",
                "Add Image": "أضف الصورة",
                "Enter the URL of the image you want to use":
                    "أدخل رابط الصورة التي تريد استخدامها",
                Preview: "معاينة",
                "Image URL added successfully.": "تمت إضافة رابط الصورة بنجاح.",
                "Please enter a valid image URL.": "يرجى إدخال رابط صورة صالح.",
                "Unable to load image from URL": "تعذر تحميل الصورة من الرابط",
                "Image is too large.": "الصورة كبيرة جدًا.",
                "Image uploaded sccessfully.": "تم رفع الصورة بنجاح.",
                "Something went wrong.": "حدث خطأ ما.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const items: Omit<ItemProps, "onImageUpload">[] = [
        {
            id: "image-upload",
            icon: (
                <UploadCloud className="!w-12 stroke-[1.7] !h-12 peer-hover:bg-red-500 group-hover:scale-125 transition-all duration-300 relative z-10" />
            ),
            title: t["Upload Image"],
            description: t["From your device"],
            buttonClassName:
                "border-green-400 dark:border-green-800/50 shadow-green-600 dark:shadow-green-900",
            titleClassName: "text-green-700 dark:text-green-300",
            descriptionClassName: "text-green-500 dark:text-green-400",
            iconClassName:
                "text-green-500 dark:text-green-400 group-text-green-600",
            BgClassName:
                "bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/40 opacity-0 opacity-100",
            borderClassName: "border-green-400 dark:border-green-600",
            shadowClassName: "shadow-green-100 dark:shadow-green-900",
        },
        {
            id: "image-draw",
            icon: (
                <PencilLine className="!w-12 !h-12 stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
            ),
            title: t["Draw with Excalidraw"],
            description: t["Sketch your ideas"],
            buttonClassName:
                "border-indigo-400 dark:border-indigo-600 shadow-indigo-400 dark:shadow-indigo-900",
            titleClassName: "text-indigo-800 dark:text-indigo-300",
            descriptionClassName:
                "text-indigo-500 dark:text-indigo-400 opacity-100",
            iconClassName:
                "text-indigo-500 dark:text-indigo-400 text-indigo-600",
            BgClassName:
                "bg-indigo-50 dark:bg-indigo-950/30 opacity-100 hover:bg-indigo-100 dark:hover:bg-indigo-950/30",
            borderClassName: "border-indigo-400 dark:border-indigo-600",
            shadowClassName: "shadow-indigo-100 dark:shadow-indigo-900",
        },
        {
            id: "image-url",
            icon: (
                <LinkIcon className="!w-12 !h-12 stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
            ),
            title: t["Image link"],
            description: t["Use an image from a link."],
            buttonClassName:
                "border-yellow-400 dark:border-yellow-600 shadow-yellow-400 dark:shadow-yellow-900",
            titleClassName: "text-yellow-800 dark:text-yellow-300",
            descriptionClassName:
                "text-yellow-500 dark:text-yellow-400 opacity-100",
            iconClassName:
                "text-yellow-500 dark:text-yellow-400 text-yellow-600",
            BgClassName:
                "bg-yellow-50 dark:bg-yellow-800/10 opacity-100 hover:bg-yellow-100 dark:hover:bg-yellow-900/10",
            borderClassName: "border-yellow-400 dark:border-yellow-600",
            shadowClassName: "shadow-yellow-100 dark:shadow-yellow-900",
        },
        {
            id: "code-snippets",
            icon: (
                <Code2Icon className="!w-12 !h-12 stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
            ),
            title: t["Code Snippet"],
            description: t["Beautiful code snippets"],
            buttonClassName:
                "border-zinc-400 dark:border-zinc-600 shadow-zinc-400 dark:shadow-zinc-900",
            titleClassName: "text-zinc-800 dark:text-zinc-200",
            descriptionClassName:
                "text-zinc-500 dark:text-zinc-400 opacity-100",
            iconClassName: "text-zinc-500 dark:text-zinc-400 text-zinc-600",
            BgClassName:
                "bg-zinc-50 dark:bg-zinc-900 opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800",
            borderClassName: "border-zinc-400 dark:border-zinc-600",
            shadowClassName: "shadow-zinc-100 dark:shadow-zinc-900",
        },
    ]

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(value) => {
                if (!value) {
                    setSelectedType(null)
                }
                props.onOpenChange(value)
            }}
            modal={false}
        >
            <DialogContent
                className={cn(
                    "sm:max-w-[1200px] border-2 border-black/50 dark:border-white/20 items-start shadow-black/50 dark:shadow-black/80 shadow-[0px_4px_0px_0px] min-h-[450px] overflow-x-hidden pb-12",
                    "bg-white dark:bg-neutral-900"
                )}
            >
                {!!selectedType && (
                    <Button
                        onClick={() => setSelectedType(null)}
                        className="text-sm gap-1 absolute top-4 rtl:left-12 ltr:left-5"
                        variant="secondary"
                    >
                        <ArrowLeft className="stroke-3 -ml-1 text-neutral-500 dark:text-neutral-400 !w-4 !h-4" />
                    </Button>
                )}
                <DialogHeader>
                    <DialogTitle className="text-3xl text-center pb-10 pt-5 text-neutral-700 dark:text-neutral-100 font-extrabold">
                        {!selectedType && t["What type of image do you want?"]}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {selectedType === "code-snippets" && (
                    <CodeSnippets
                        onSave={(shouldClose) => {
                            props.onCodeSnippetsSave?.(
                                codeSnippets,
                                shouldClose
                            )
                        }}
                        className="h-[320px]"
                        onSelectedTabChange={setSelectedSnippetTab}
                        onThemeChange={setCodeSnippetTheme}
                        selectedTabId={selectedSnippetTab}
                        setTabs={setCodeSnippets}
                        tabs={codeSnippets}
                        theme={codeSnippetTheme}
                    />
                )}

                {selectedType === "image-draw" && (
                    <DrawImage
                        onSave={(url) => {
                            props.onImageSave(url)
                            props.onOpenChange(false)
                            setSelectedType(null)
                        }}
                    />
                )}
                {selectedType === "image-url" && (
                    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto space-y-2 -mt-10">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-2">
                                {t["Enter Image URL"]}
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Input
                                    ref={imageUrlInputRef}
                                    id="image-url-input"
                                    placeholder="https://example.com/image.jpg"
                                    className="grow w-full border-2 border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    type="url"
                                    onBlur={(e) => setImageUrl(e.target.value)}
                                    onPaste={(e: any) => {
                                        wait(10).then(() =>
                                            setImageUrl(
                                                imageUrlInputRef.current
                                                    ?.value || ""
                                            )
                                        )
                                    }}
                                />
                                <Button
                                    onClick={() => {
                                        if (imageUrl) {
                                            props.onImageSave(imageUrl)
                                            props.onOpenChange(false)
                                            setSelectedType(null)
                                            setImageUrl("")
                                            toastSuccess(
                                                t[
                                                    "Image URL added successfully."
                                                ]
                                            )
                                        } else {
                                            toastError(
                                                t[
                                                    "Please enter a valid image URL."
                                                ]
                                            )
                                        }
                                    }}
                                    variant="default"
                                    className="text-base"
                                >
                                    {t["Add Image"]}
                                </Button>
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                {
                                    t[
                                        "Enter the URL of the image you want to use"
                                    ]
                                }
                            </p>
                        </div>

                        {imageUrl && (
                            <div className="w-full mt-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-2">
                                    {t["Preview"]}
                                </h3>
                                <div className="border-2 border-neutral-300 dark:border-neutral-700 rounded-md p-2 h-60 flex items-center justify-center bg-white dark:bg-neutral-800">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        onError={() =>
                                            toastError(
                                                t[
                                                    "Unable to load image from URL"
                                                ]
                                            )
                                        }
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {!selectedType && (
                    <div
                        className={cn(
                            "grid grid-cols-1 md:grid-cols-2 mt-0 lg:grid-cols-4 gap-3 px-20",
                            {
                                "grid-cols-1 md:grid-cols-2 mt-0 lg:grid-cols-4":
                                    disabledOptions?.length === 0,
                                "grid-cols-1 md:grid-cols-2 mt-0 lg:grid-cols-3":
                                    disabledOptions?.length === 1,
                                "grid-cols-1 md:grid-cols-2 mt-0 lg:grid-cols-2":
                                    disabledOptions?.length === 2,
                                "grid-cols-1 md:grid-cols-1 mt-0 lg:grid-cols-1":
                                    disabledOptions?.length === 3,
                            }
                        )}
                    >
                        {items
                            .filter(
                                (item) =>
                                    disabledOptions?.includes(
                                        item.id as any
                                    ) === false
                            )
                            .map((item, index) => (
                                <Item
                                    onImageUpload={(url) => {
                                        props.onImageSave(url)
                                        props.onOpenChange(false)
                                        setSelectedType(null)
                                    }}
                                    onSelect={setSelectedType}
                                    key={index}
                                    {...item}
                                />
                            ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function Item(props: ItemProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    // Get translation for error/success messages
    const lang = getLanguage()
    const translation = {
        en: {
            "Image is too large.": "Image is too large.",
            "Image uploaded sccessfully.": "Image uploaded successfully.",
            "Something went wrong.": "Something went wrong.",
        },
        fr: {
            "Image is too large.": "L'image est trop volumineuse.",
            "Image uploaded sccessfully.": "Image téléchargée avec succès.",
            "Something went wrong.": "Une erreur s'est produite.",
        },
        ar: {
            "Image is too large.": "الصورة كبيرة جدًا.",
            "Image uploaded sccessfully.": "تم رفع الصورة بنجاح.",
            "Something went wrong.": "حدث خطأ ما.",
        },
    }
    const t = translation[lang]

    return (
        <div className="relative w-auto flex">
            {props.id == "image-upload" && (
                <input
                    accept="image/*"
                    onChange={async (e) => {
                        try {
                            setIsLoading(true)
                            const file = Array.from(e.target.files || []).at(0)
                            if (file) {
                                if (file.size > maxFileSize) {
                                    setIsLoading(false)
                                    return toastError(t["Image is too large."])
                                }
                                const url = await uploadFile(file)
                                props.onImageUpload(url)
                                toastSuccess(t["Image uploaded sccessfully."])
                            }
                        } catch (err) {
                            console.error(err)
                            toastError(t["Something went wrong."])
                        } finally {
                            setIsLoading(false)
                        }
                    }}
                    ref={fileInputRef}
                    type="file"
                    className="file-input w-0 h-0 cursor-pointer  top-0 left-0 right-0"
                />
            )}

            <div className="flex grow relative">
                <Button
                    isLoading={isLoading}
                    onMouseDown={() => {
                        if (props.id == "image-upload") {
                            return fileInputRef.current?.click()
                        }
                        props.onSelect?.(props.id)
                    }}
                    variant={"secondary"}
                    className={cn(
                        `h-48 flex grow flex-col w-full relative overflow-hidden group border-2 transition-all`,
                        props.buttonClassName,
                        props.borderClassName,
                        props.shadowClassName,
                        "bg-white dark:bg-neutral-900 border-2 dark:border-opacity-70"
                    )}
                >
                    <div
                        className={cn(
                            "absolute inset-0 transition-opacity duration-300",
                            props.BgClassName
                        )}
                    ></div>

                    <div className={cn(props.iconClassName)}>{props.icon}</div>

                    <p
                        className={cn(
                            `text-lg text-wrap translate-y-2 font-bold text-neutral-800 dark:text-neutral-100 transition-colors duration-300 relative z-10`,
                            props.titleClassName
                        )}
                    >
                        {props.title}
                    </p>

                    <span
                        className={cn(
                            `text-sm mt-1 transition-all duration-300 relative z-10 dark:text-neutral-300`,
                            props.descriptionClassName
                        )}
                    >
                        {props.description}
                    </span>
                </Button>
            </div>
        </div>
    )
}

interface ItemProps {
    id: Props["selectedType"]
    icon: ReactNode
    title: string
    description: string
    buttonClassName: string
    titleClassName: string
    descriptionClassName: string
    iconClassName: string
    BgClassName: string
    borderClassName: string
    shadowClassName: string
    onSelect?: (id: ItemProps["id"]) => void
    onImageUpload: (url: string) => void
}
