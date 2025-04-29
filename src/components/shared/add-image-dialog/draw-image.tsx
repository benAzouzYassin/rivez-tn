"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { maxFileSize, uploadFile } from "@/utils/file-management"
import { exportToCanvas } from "@excalidraw/excalidraw"
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

const ExcalidrawPrimitive = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        loading: () => (
            <div className="w-full h-[100px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/50" />
            </div>
        ),
        ssr: false,
    }
)

type Props = {
    onSave: (url: string) => void
}

export default function Excalidraw(props: Props) {
    const [canvasUrl, setCanvasUrl] = useState<string>("")
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // --- TRANSLATION OBJECT ---
    const translation = useMemo(
        () => ({
            en: {
                "Save Drawing": "Save Drawing",
                "Save image": "Save image",
                "Something went wrong.": "Something went wrong.",
                "Image is too large.": "Image is too large.",
                "Uploading your image...": "Uploading your image...",
                "Uploaded your image successfully.":
                    "Uploaded your image successfully.",
            },
            fr: {
                "Save Drawing": "Enregistrer le dessin",
                "Save image": "Enregistrer l'image",
                "Something went wrong.": "Une erreur s'est produite.",
                "Image is too large.": "L'image est trop volumineuse.",
                "Uploading your image...": "Téléchargement de votre image...",
                "Uploaded your image successfully.":
                    "Votre image a été téléchargée avec succès.",
            },
            ar: {
                "Save Drawing": "حفظ الرسم",
                "Save image": "حفظ الصورة",
                "Something went wrong.": "حدث خطأ ما.",
                "Image is too large.": "الصورة كبيرة جدًا.",
                "Uploading your image...": "جارٍ رفع الصورة...",
                "Uploaded your image successfully.": "تم رفع الصورة بنجاح.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const initialData: ExcalidrawInitialDataState = {
        appState: {
            currentItemFontFamily: 1,
        },
    }

    const handleExport = async (): Promise<void> => {
        if (!excalidrawAPI) {
            return
        }
        const elements = excalidrawAPI.getSceneElements()
        if (!elements || !elements.length) {
            return
        }

        try {
            const canvas = await exportToCanvas({
                elements,
                appState: {
                    ...initialData.appState,
                    exportWithDarkMode: true,
                },
                files: excalidrawAPI.getFiles(),
            })

            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.font = "30px Virgil"
            }
            const dataUrl = canvas.toDataURL()
            setCanvasUrl(dataUrl)
            setIsModalOpen(true)
        } catch (error) {
            console.error("Error exporting canvas:", error)
            toastError(t["Something went wrong."])
        }
    }

    const handleSubmit = async (): Promise<void> => {
        if (!canvasUrl) return

        setIsSubmitting(true)
        try {
            const response = await fetch(canvasUrl)
            const blob = await response.blob()
            if (blob.size > maxFileSize) {
                toastError(t["Image is too large."])
                return
            }
            toastLoading(t["Uploading your image..."])
            const url = await uploadFile(blob)
            props.onSave(url)
            dismissToasts("loading")
            toastSuccess(t["Uploaded your image successfully."])
            setIsModalOpen(false)
        } catch (error) {
            dismissToasts("loading")
            toastError(t["Something went wrong."])
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="relative flex flex-col -mt-5 pb-5 items-center justify-center overflow-hidden">
            <div className="w-[1050px] border rounded-2xl overflow-hidden relative h-[550px] mx-auto">
                <ExcalidrawPrimitive
                    excalidrawAPI={(api) => {
                        setExcalidrawAPI(api)
                    }}
                    langCode={lang === "ar" ? "ar-SA" : undefined}
                    autoFocus
                    initialData={initialData}
                    theme="dark"
                    UIOptions={{
                        canvasActions: {
                            export: false,
                            loadScene: false,
                            saveToActiveFile: false,
                            saveAsImage: false,
                            clearCanvas: true,
                        },
                    }}
                />
            </div>

            <Button
                className="w-3/4 mx-auto h-12 font-extrabold text-base mt-4"
                onClick={handleExport}
            >
                {t["Save Drawing"]}
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div
                        className={cn(
                            "min-w-[700px]   min-h-[500px] rounded-xl relative overflow-hidden  flex items-center justify-center   mx-auto  border bg-neutral-50  "
                        )}
                    >
                        <img
                            className={cn(
                                "h-full mx-auto overflow-hidden rounded-md absolute top-0 left-0 w-full object-contain"
                            )}
                            src={canvasUrl}
                            alt=""
                        />
                    </div>
                    <Button isLoading={isSubmitting} onClick={handleSubmit}>
                        {t["Save image"]}
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
