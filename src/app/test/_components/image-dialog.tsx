"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"
import {
    ChevronLeft,
    Code2Icon,
    PencilLine,
    UploadCloud,
    Wand2,
} from "lucide-react"
import { ReactNode, useRef, useState } from "react"
import CodeSnippets from "./code-snippets"
import dynamic from "next/dynamic"
const DrawImage = dynamic(() => import("./draw-image"))

type Props = {
    selectedType:
        | "image-upload"
        | "image-ai-generation"
        | "image-draw"
        | "code-snippets"
        | null
    onTypeChange: (type: Props["selectedType"]) => void
    onImageUpload: (url: string) => void
    onCodeSnippetsSave: (snippets: any[]) => void
}
export default function ImageDialog() {
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
            onOpenChange={(value) => {
                if (!value) {
                    setSelectedType(null)
                }
            }}
            modal={false}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="font-medium">
                    Select Image Source
                </Button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    "sm:max-w-[1100px] border-2 border-black/50 shadow-black/50 shadow-[0px_4px_0px_0px] overflow-x-hidden pb-12",
                    {
                        "sm:max-w-[1200px]": selectedType === "image-draw",
                    }
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
                        className="h-[320px] "
                        onSelectedTabChange={setSelectedSnippetTab}
                        onThemeChange={setCodeSnippetTheme}
                        selectedTabId={selectedSnippetTab}
                        setTabs={setCodeSnippets}
                        tabs={codeSnippets}
                        theme={codeSnippetTheme}
                    />
                )}
                {selectedType === "image-ai-generation" && (
                    <div>image generattion</div>
                )}
                {selectedType === "image-draw" && (
                    <DrawImage
                        onSave={(url) => {
                            // TODO use the url
                        }}
                    />
                )}
                {!selectedType && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {items.map((item, index) => (
                            <Item
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
    return (
        <div className="relative w-auto flex ">
            {props.id == "image-upload" && (
                <input
                    ref={fileInputRef}
                    type="file"
                    className="file-input w-0 h-0 cursor-pointer  border-red-500 border top-0 left-0 right-0"
                />
            )}
            <Button
                onClick={() => {
                    if (props.id == "image-upload") {
                        return fileInputRef.current?.click()
                    }
                    props.onSelect?.(props.id)
                }}
                variant={"secondary"}
                className={cn(
                    `h-48 flex flex-col grow  relative overflow-hidden group border-2  transition-all  `,
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
                        `text-lg text-wrap translate-y-2 font-bold text-neutral-800 transition-colors duration-300 relative z-10`,
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
}

const items: ItemProps[] = [
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
        id: "image-ai-generation",
        icon: (
            <Wand2 className="!w-12 !h-12  stroke-[1.7] group-hover:scale-125 transition-all duration-300 relative z-10" />
        ),
        title: "Generate with AI",
        description: "Create custom images",
        buttonClassName: " border-purple-400  shadow-purple-400",
        titleClassName: "text-purple-800",
        descriptionClassName: "text-purple-500  opacity-100",
        iconClassName: "text-purple-500 text-purple-600",
        BgClassName: "bg-purple-50 hover:bg-purple-100  opacity-100",
        borderClassName: " border-purple-400",
        shadowClassName: "shadow-purple-100",
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
