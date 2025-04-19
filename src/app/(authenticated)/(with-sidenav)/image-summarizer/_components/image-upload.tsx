import { ImageIcon } from "lucide-react"
import { ChangeEvent, DragEvent, useState } from "react"
interface Props {
    handleSummarize: (data: { images: File[]; language: string }) => void
}
export default function ImageUpload(props: Props) {
    const [isDragging, setIsDragging] = useState(false)
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
        props.handleSummarize({
            images: files,
            language: "",
        })
    }
    return (
        <div className="w-full max-w-3xl pt-28 space-y-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-neutral-600 mb-5">
                    Upload your images
                </h1>
            </div>

            <div
                className={`flex active:scale-95 flex-col items-center justify-center h-64 md:h-96 ${
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
                    <p className="text-xl font-bold text-neutral-500 mb-1 text-center">
                        Drop images here or click to browse
                    </p>
                    <p className="text-sm font-semibold text-neutral-500 text-center">
                        Supports JPG, PNG, GIF, and other image formats
                    </p>
                </label>
            </div>
        </div>
    )
}
