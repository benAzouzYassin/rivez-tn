import PopoverList from "@/components/ui/popover-list"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/ui-utils"
import { useState } from "react"
import { ImageIcon, X } from "lucide-react"
import AddImageDialog from "@/components/shared/add-image-dialog/add-image-dialog"
import { QuestionText } from "./question-text"

interface Props {
    className?: string
}
export default function Question(props: Props) {
    const [isAddingImage, setIsAddingImage] = useState(false)
    return (
        <div
            className={cn(
                "w-[32rem] flex flex-col relative h-[30rem] border-2 rounded-2xl border-neutral-300 border-dashed",
                props.className
            )}
        >
            <div className="flex h-fit p-4 w-full justify-end">
                <Select>
                    <SelectTrigger className="w-44 ">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-center mb-14 mt-5">
                <QuestionText className="" text="" onChange={() => {}} />
            </div>
            <div className="relative mx-auto w-[80%]">
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
