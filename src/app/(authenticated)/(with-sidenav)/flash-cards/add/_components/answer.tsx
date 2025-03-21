import AddImageDialog from "@/components/shared/add-image-dialog/add-image-dialog"
const RichTextEditor = dynamic(
    () => import("@/components/shared/rich-text-editor"),
    {
        ssr: false,
    }
)
import { cn } from "@/lib/ui-utils"
import { ImageIcon, X } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"

interface Props {
    className?: string
}
export default function Answer(props: Props) {
    const [isAddingImage, setIsAddingImage] = useState(false)
    return (
        <div
            className={cn(
                "w-[37rem] flex flex-col pt-10 relative min-h-[32rem] border-2 rounded-2xl border-neutral-300 border-dashed",
                props.className
            )}
        >
            <div className="flex items-center  justify-center mb-8"></div>
            <RichTextEditor
                placeholder="Flashcard content..."
                containerClassName="w-[90%] mx-auto"
            />
            <div className="relative mt-4 mb-10  mx-auto w-[80%]">
                <button
                    onClick={() => {}}
                    className="absolute -right-3 hover:cursor-pointer active:scale-95 -top-3 p-[2px] bg-red-100 border-2 border-red-400 rounded-full text-red-500/90 opacity-80  transition-all duration-200 hover:bg-red-200 hover:border-red-500 hover:text-red-600"
                >
                    <X className="w-4 h-4 stroke-3" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsAddingImage(true)
                    }}
                    className=" w-full  hover:bg-blue-50 cursor-pointer active:scale-95 transition-all  flex items-center justify-center mx-auto rounded-lg h-56 border-2"
                >
                    <ImageIcon className="w-14 h-14 text-neutral-300 " />
                </button>
            </div>
            <AddImageDialog
                onImageSave={() => {}}
                onOpenChange={setIsAddingImage}
                selectedType={"image-upload"}
                isOpen={isAddingImage}
                onCodeSnippetsSave={() => {}}
            />
        </div>
    )
}
