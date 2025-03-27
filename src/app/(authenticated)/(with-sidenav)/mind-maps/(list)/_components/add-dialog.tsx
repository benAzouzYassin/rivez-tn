"use client"

import {
    ChevronLeft,
    FileTextIcon,
    ImageIcon,
    LetterTextIcon,
    Plus,
    Video,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/ui-utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import dynamic from "next/dynamic"
import { PdfInputLoading } from "./pdf-input-loading"
import { useRouter } from "nextjs-toploader/app"
const PdfInput = dynamic(() => import("./pdf-input"), {
    loading: () => <PdfInputLoading />,
})
export default function AddDialog() {
    const [currentTab, setCurrentTab] = useState<
        "subject" | "document" | "youtube" | "image" | null
    >(null)
    const [language, setLanguage] = useState("")
    const [topic, setTopic] = useState("")
    const [instructions, setInstructions] = useState("")
    const [pdfPages, setPdfPages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const items = [
        {
            disabled: false,
            value: "subject",
            text: "Text Input",
            icon: <LetterTextIcon className="w-7 text-indigo-500 h-7" />,
            description:
                "Create a mind map from any topic or subject you specify.",
        },
        {
            disabled: false,
            value: "document",
            text: "Upload PDF",
            icon: <FileTextIcon className="w-7 h-7 text-indigo-500" />,
            description:
                "Upload a PDF file to generate questions from its content.",
        },
        {
            disabled: true,
            value: "youtube",
            text: "YouTube Video",
            icon: <Video className="w-7 text-indigo-500 h-7" />,
            description:
                "Convert a YouTube video into a mind map by entering its URL.",
        },
        {
            disabled: true,
            value: "image",
            text: "Extract from Images",
            icon: <ImageIcon className="w-7 text-indigo-500 h-7" />,
            description:
                "Upload images with text or diagrams to generate visual mind maps.",
        },
    ]

    const handleCardClick = (tab: string) => {
        if (["subject", "document"].includes(tab)) {
            setCurrentTab(tab as any)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (currentTab === "subject") {
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=subject&topic=${topic}&language=${language}&additionalInstructions=${instructions}`
                )
            } else if (currentTab === "document") {
                // TODO implement this
                console.log({
                    type: "document",
                    pdfPages,
                    language,
                })
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-base h-[3.2rem]">
                    <Plus className="-mr-1 !w-5 stroke-2 !h-5" /> Add Mind Map
                </Button>
            </DialogTrigger>
            <DialogContent
                className={cn("sm:min-w-[800px] w-[800px] max-w-[1000px]", {
                    "w-[1000px]": currentTab === null,
                })}
            >
                <DialogHeader>
                    <DialogTitle className="text-4xl text-center font-bold text-neutral-500 mt-2">
                        Generate a Mind Map
                    </DialogTitle>
                    <DialogDescription className="text-neutral-600"></DialogDescription>
                </DialogHeader>

                {!currentTab && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 mt-6">
                        {items.map((item) => (
                            <Card
                                key={item.value}
                                onClick={() => handleCardClick(item.value)}
                                className={cn(
                                    "p-4 flex h-28 hover:bg-neutral-100 cursor-pointer transition-all active:shadow-none active:translate-y-2 items-center gap-4 rounded-2xl ",
                                    {
                                        "bg-neutral-200 active:translate-y-0 hover:bg-neutral-200 cursor-not-allowed":
                                            item.disabled,
                                    }
                                )}
                            >
                                <span className="bg-blue-100 flex items-center p-2 rounded-xl w-fit">
                                    {item.icon}
                                </span>
                                <div>
                                    <h3 className="text-xl text-neutral-700 font-bold pt-1">
                                        {item.text}
                                    </h3>
                                    <p className="text-sm font-medium text-neutral-500">
                                        {item.description}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {currentTab !== null && (
                    <Button
                        onClick={() => setCurrentTab(null)}
                        variant={"secondary"}
                        className="absolute gap-1 left-3 text-base font-bold text-neutral-500 top-5 rounded-xl"
                    >
                        <ChevronLeft className="min-w-6 min-h-6" />
                        Back
                    </Button>
                )}
                {currentTab === "document" && (
                    <form onSubmit={handleSubmit} className="mt-6">
                        <PdfInput
                            onPDFPagesChanges={(value: string[]) =>
                                setPdfPages(value)
                            }
                        />
                        <div className="mt-5">
                            <label
                                htmlFor="language"
                                className="font-medium text-neutral-600"
                            >
                                Select Language
                            </label>
                            <Select
                                onValueChange={setLanguage}
                                value={language}
                            >
                                <SelectTrigger id="language" className="w-full">
                                    <SelectValue placeholder="Choose a language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">
                                        English
                                    </SelectItem>
                                    <SelectItem value="arabic">
                                        Arabic
                                    </SelectItem>
                                    <SelectItem value="french">
                                        French
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="text-lg mt-5 h-[52px] w-full"
                            isLoading={isSubmitting}
                            disabled={pdfPages.length === 0}
                        >
                            Generate Mind Map
                        </Button>
                    </form>
                )}
                {currentTab === "subject" && (
                    <form onSubmit={handleSubmit} className="mt-5 pb-0">
                        <div>
                            <label
                                htmlFor="text"
                                className="font-medium text-neutral-600"
                            >
                                Topic or Subject
                                <span className="text-red-400 text-xl font-semibold">
                                    *
                                </span>
                            </label>
                            <Textarea
                                errorMessage=""
                                className="h-28"
                                id="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter the main topic or subject for the mind map."
                                required
                            />
                        </div>
                        <div className="-mt-1">
                            <label
                                htmlFor="language"
                                className="font-medium text-neutral-600"
                            >
                                Select Language
                            </label>
                            <Select
                                onValueChange={setLanguage}
                                value={language}
                            >
                                <SelectTrigger id="language" className="w-full">
                                    <SelectValue placeholder="Choose a language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">
                                        English
                                    </SelectItem>
                                    <SelectItem value="arabic">
                                        Arabic
                                    </SelectItem>
                                    <SelectItem value="french">
                                        French
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label
                                htmlFor="requirement"
                                className="font-medium text-neutral-600"
                            >
                                Additional Instructions
                            </label>
                            <Textarea
                                className="h-24"
                                id="requirement"
                                value={instructions}
                                onChange={(e) =>
                                    setInstructions(e.target.value)
                                }
                                placeholder="Provide any specific guidelines or requests for AI processing."
                            />
                        </div>
                        <Button
                            type="submit"
                            className="text-lg h-[52px] w-full"
                            isLoading={isSubmitting}
                            disabled={!topic}
                        >
                            Generate Mind Map
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
