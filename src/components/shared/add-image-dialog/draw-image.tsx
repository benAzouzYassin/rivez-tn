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
import { useEffect, useState } from "react"

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
            toastError("Something went wrong.")
        }
    }

    const handleSubmit = async (): Promise<void> => {
        if (!canvasUrl) return

        setIsSubmitting(true)
        try {
            const response = await fetch(canvasUrl)
            const blob = await response.blob()
            if (blob.size > maxFileSize) {
                toastError("Image is too large.")
                return
            }
            toastLoading("Uploading your image...")
            const url = await uploadFile(blob)
            props.onSave(url)
            dismissToasts("loading")
            toastSuccess("Uploaded your image successfully.")
            setIsModalOpen(false)
        } catch (error) {
            dismissToasts("loading")
            toastError("Something went wrong.")
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
                Save Drawing
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
                        Save image
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
