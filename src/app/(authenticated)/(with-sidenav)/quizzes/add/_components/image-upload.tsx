import AddImageDialog from "@/components/shared/add-image-dialog/add-image-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { deleteFile } from "@/utils/file-management"
import { Upload, XIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    className?: string
    onImageUrlChange: (url: string | null) => void
    imageUrl: string | null
}
export default function ImageUpload(props: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                "Drag or click to upload quiz image.":
                    "Drag or click to upload quiz image.",
                "Images (PNG, JPG, GIF)": "Images (PNG, JPG, GIF)",
                "up to 10MB": "up to 10MB",
                "This is the cover image": "This is the cover image",
            },
            fr: {
                "Drag or click to upload quiz image.":
                    "Glissez ou cliquez pour télécharger l'image du quiz.",
                "Images (PNG, JPG, GIF)": "Images (PNG, JPG, GIF)",
                "up to 10MB": "jusqu'à 10 Mo",
                "This is the cover image": "Ceci est l'image de couverture",
            },
            ar: {
                "Drag or click to upload quiz image.":
                    "اسحب أو انقر لتحميل صورة الاختبار.",
                "Images (PNG, JPG, GIF)": "صور (PNG، JPG، GIF)",
                "up to 10MB": "حتى 10 ميجابايت",
                "This is the cover image": "هذه هي صورة الغلاف",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    return (
        <>
            <div
                className={cn(
                    "w-full min-h-[250px] overflow-y-auto border-blue-400/50 hover:cursor-pointer relative border-2 border-dashed rounded-xl",
                    "transition-all duration-200 ease-in-out",
                    "flex items-center justify-center",
                    props.className
                )}
            >
                {!!props.imageUrl && (
                    <Button
                        variant={"outline-red"}
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteFile(props.imageUrl!)
                            props.onImageUrlChange(null)
                        }}
                        className="absolute hover:bg-red-100 z-10 h-7 px-[3px] rounded-full top-2 right-2"
                    >
                        <XIcon className="!w-5 !h-5 stroke-[2.7]" />
                    </Button>
                )}
                {props.imageUrl ? (
                    <div className="absolute top-0 p-2 left-0 w-full h-full">
                        <img
                            alt=""
                            className="h-full w-full object-contain"
                            src={props.imageUrl}
                        />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 rounded px-3 py-1 text-xs font-semibold text-neutral-700 shadow">
                            {t["This is the cover image"]}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-neutral-50/70 rounded-xl hover:bg-neutral-100 absolute top-0 cursor-pointer left-0 w-full h-full"
                    >
                        <Upload className="w-10 h-10 mb-2 mx-auto text-neutral-400" />
                        <p className="text-base font-semibold text-neutral-500">
                            {t["Drag or click to upload quiz image."]}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0">
                            {t["Images (PNG, JPG, GIF)"]}
                        </p>
                        <p className="text-xs text-neutral-400">
                            {t["up to 10MB"]}
                        </p>
                    </button>
                )}
            </div>
            <AddImageDialog
                isOpen={isOpen}
                onImageSave={props.onImageUrlChange}
                onOpenChange={setIsOpen}
                disabledOptions={["code-snippets", "image-url"]}
            />
        </>
    )
}
