import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageIcon } from "lucide-react"
import { ChangeEvent, DragEvent, useState } from "react"
interface Props {
    handleSummarize: (data: { images: File[]; language: string }) => void
}
export default function ImageUpload(props: Props) {
    const [files, setFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [language, setLanguage] = useState("")
    const [customLang, setCustomLang] = useState("")
    const [isSelectingLang, setIsSelectingLang] = useState(false)
    const [isCustomLang, setIsCustomLang] = useState(false)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e?.target?.files || []).filter(
            (file) => file.type.startsWith("image/")
        )
        handleFiles(selectedFiles || [])
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        )
        handleFiles(droppedFiles || [])
    }

    const handleFiles = async (files: File[]) => {
        setFiles(files)
        setIsSelectingLang(true)
    }
    const handleConfirm = () => {
        setIsSelectingLang(false)
        props.handleSummarize({
            images: files,
            language,
        })
    }
    return (
        <div className="w-full max-w-3xl pt-28 space-y-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-neutral-600 mb-5">
                    Upload your images
                </h1>
            </div>
            <Dialog open={isSelectingLang} onOpenChange={setIsSelectingLang}>
                <DialogContent>
                    <DialogTitle className="text-2xl font-bold text-neutral-600">
                        Select Language (Optional)
                    </DialogTitle>
                    <DialogDescription></DialogDescription>

                    {!isCustomLang ? (
                        <Select onValueChange={setLanguage}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="arabic">Arabic</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            placeholder="Type your language"
                            className="w-full"
                            value={customLang}
                            onChange={(e) => setCustomLang(e.target.value)}
                        />
                    )}
                    <div className="flex items-center gap-2 -mt-6">
                        <span className="font-semibold text-neutral-600">
                            Use Custom Language
                        </span>
                        <Switch
                            className="scale-125 cursor-pointer"
                            checked={isCustomLang}
                            onCheckedChange={setIsCustomLang}
                        />
                    </div>
                    <Button
                        onClick={handleConfirm}
                        className="mt-4 text-lg w-full"
                    >
                        Confirm
                    </Button>
                </DialogContent>
            </Dialog>
            <div
                className={`flex active:scale-95 flex-col items-center justify-center h-96 ${
                    isDragging
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-300"
                } border-2 border-dashed rounded-3xl transition-all duration-200 ease-in-out hover:border-blue-300 hover:bg-blue-50`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center h-full w-full justify-center p-6"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="h-10 w-10 text-blue-400/90" />
                    </div>
                    <p className="text-xl font-bold text-neutral-500 mb-1">
                        Drop images here or click to browse
                    </p>
                    <p className="text-sm font-semibold text-neutral-500">
                        Supports JPG, PNG, GIF, and other image formats
                    </p>
                </label>
            </div>
        </div>
    )
}
