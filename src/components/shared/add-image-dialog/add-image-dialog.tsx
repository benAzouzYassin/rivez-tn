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
    ChevronLeft,
    Code2Icon,
    LinkIcon,
    Loader2,
    PencilLine,
    UploadCloud,
} from "lucide-react"
import dynamic from "next/dynamic"
import { ReactNode, useRef, useState } from "react"
import CodeSnippets from "./code-snippets"
import { Input } from "@/components/ui/input"
import { wait } from "@/utils/wait"
const DrawImage = dynamic(() => import("./draw-image"), {
    loading: () => {
        return (
            <div className="w-full h-[100px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            </div>
        )
    },
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
export default function AddImageDialog(props: Props) {
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
                    "sm:max-w-[1200px] border-2 border-black/50 items-start  shadow-black/50 shadow-[0px_4px_0px_0px] min-h-[450px] overflow-x-hidden pb-12"
                )}
            >
                {!!selectedType && (
                    <Button
                        onClick={() => setSelectedType(null)}
                        className=" text-sm gap-1   absolute top-4 left-5"
                        variant="secondary"
                    >
                        <ChevronLeft className="stroke-3 -ml-1 text-neutral-500 !w-4 !h-4" />
                        Go back
                    </Button>
                )}
                <DialogHeader>
                    <DialogTitle className="text-3xl text-center pb-10 pt-5 text-neutral-700 font-extrabold">
                        {!selectedType && "What type of image do you want?"}
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
                        className="h-[320px] "
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
                            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                Enter Image URL
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Input
                                    ref={imageUrlInputRef}
                                    id="image-url-input"
                                    placeholder="https://example.com/image.jpg"
                                    className="grow w-full  border-2 border-neutral-300 "
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
                                                "Image URL added successfully."
                                            )
                                        } else {
                                            toastError(
                                                "Please enter a valid image URL."
                                            )
                                        }
                                    }}
                                    variant="default"
                                    className="text-base"
                                >
                                    Add Image
                                </Button>
                            </div>
                            <p className="text-sm text-neutral-500 mt-2">
                                Enter the URL of the image you want to use
                            </p>
                        </div>

                        {imageUrl && (
                            <div className="w-full mt-4 ">
                                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                    Preview
                                </h3>
                                <div className="border-2 border-neutral-300 rounded-md p-2 h-60 flex items-center justify-center">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        onError={() =>
                                            toastError(
                                                "Unable to load image from URL"
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
                                    props?.disabledOptions?.length === 0,
                                "grid-cols-1 md:grid-cols-2 mt-0 lg:grid-cols-3":
                                    props?.disabledOptions?.length === 1,
                                "grid-cols-1 md:grid-cols-2 mt-0 lg:grid-cols-2":
                                    props.disabledOptions?.length === 2,
                                "grid-cols-1 md:grid-cols-1 mt-0 lg:grid-cols-1":
                                    props.disabledOptions?.length === 3,
                            }
                        )}
                    >
                        {items
                            .filter(
                                (item) =>
                                    props.disabledOptions?.includes(
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
    return (
        <div className="relative w-auto flex ">
            {props.id == "image-upload" && (
                <input
                    accept="image/*"
                    onChange={async (e) => {
                        try {
                            setIsLoading(true)
                            const file = Array.from(e.target.files || []).at(0)
                            if (file) {
                                if (file.size > maxFileSize) {
                                    return toastError("Image is too large.")
                                }
                                const url = await uploadFile(file)
                                props.onImageUpload(url)
                                toastSuccess("Image uploaded sccessfully.")
                            }
                        } catch (err) {
                            console.error(err)
                            toastError("Something went wrong.")
                        }
                    }}
                    ref={fileInputRef}
                    type="file"
                    className="file-input w-0 h-0 cursor-pointer  border-red-500 border top-0 left-0 right-0"
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
                        `h-48 flex grow flex-col  w-full  relative overflow-hidden group border-2  transition-all  `,
                        props.buttonClassName,
                        props.borderClassName
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
                            `text-lg text-wrap  translate-y-2 font-bold text-neutral-800 transition-colors duration-300 relative z-10`,
                            props.titleClassName
                        )}
                    >
                        {props.title}
                    </p>

                    <span
                        className={cn(
                            `text-sm mt-1 transition-all duration-300 relative z-10`,
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

const items: Omit<ItemProps, "onImageUpload">[] = [
    {
        id: "image-upload",
        icon: (
            <UploadCloud className="!w-12 stroke-[1.7] !h-12 peer-hover:bg-red-500 group-hover:scale-125 transition-all duration-300 relative z-10" />
        ),
        title: "Upload Image",
        description: "From your device",
        buttonClassName: " border-green-400  shadow-green-400 ",
        titleClassName: "text-green-700",
        descriptionClassName: "text-green-500 ",
        iconClassName: "text-green-500 group-text-green-600",
        BgClassName: "bg-green-50 hover:bg-green-100 opacity-0 opacity-100",
        borderClassName: " border-green-400",
        shadowClassName: "shadow-green-100",
    },
    {
        id: "image-draw",
        icon: (
            <PencilLine className="!w-12 !h-12 stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
        ),
        title: "Draw with Excalidraw",
        description: "Sketch your ideas",
        buttonClassName: " border-indigo-400 shadow-indigo-400",
        titleClassName: "text-indigo-800",
        descriptionClassName: "text-indigo-500  opacity-100",
        iconClassName: "text-indigo-500 text-indigo-600",
        BgClassName: "bg-indigo-50  opacity-100 hover:bg-indigo-100",
        borderClassName: " border-indigo-400 ",
        shadowClassName: "shadow-indigo-100",
    },
    {
        id: "image-url",
        icon: (
            <LinkIcon className="!w-12 !h-12 stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
        ),
        title: "Image link",
        description: "Use an image from a link.",
        buttonClassName: " border-yellow-400 shadow-yellow-400",
        titleClassName: "text-yellow-800",
        descriptionClassName: "text-yellow-500  opacity-100",
        iconClassName: "text-yellow-500 text-yellow-600",
        BgClassName: "bg-yellow-50  opacity-100 hover:bg-yellow-100",
        borderClassName: " border-yellow-400",
        shadowClassName: "shadow-yellow-100",
    },
    {
        id: "code-snippets",
        icon: (
            <Code2Icon className="!w-12 !h-12 stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
        ),
        title: "Code Snippet",
        description: "Beautiful code snippets",
        buttonClassName: " border-zinc-400 shadow-zinc-400",
        titleClassName: "text-zinc-800",
        descriptionClassName: "text-zinc-500  opacity-100",
        iconClassName: "text-zinc-500 text-zinc-600",
        BgClassName: "bg-zinc-50  opacity-100 hover:bg-zinc-100",
        borderClassName: " border-zinc-400",
        shadowClassName: "shadow-zinc-100",
    },
]
