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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import dynamic from "next/dynamic"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
import { mindmapsContentDb } from "../../_utils/indexed-db"
import { FileInputLoading } from "./file-input-loading"
import { Badge } from "@/components/ui/badge"
import CreditIcon from "@/components/icons/credit-icon"
import { highPrice, lowPrice } from "@/constants/prices"
import { useCurrentUser } from "@/hooks/use-current-user"
import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
const PdfInput = dynamic(() => import("./pdf-input"), {
    loading: () => <FileInputLoading />,
})
const ImageInput = dynamic(() => import("./image-input"), {
    loading: () => <FileInputLoading />,
})
interface Props {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}
export default function AddDialog(props: Props) {
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const { data: user } = useCurrentUser()
    const creditBalance = user?.credit_balance?.toFixed(1)
    const [currentTab, setCurrentTab] = useState<
        "subject" | "document" | "youtube" | "image" | null
    >(null)
    const [imagesInBase64, setImagesInBase64] = useState<string[]>([])
    const [language, setLanguage] = useState("")
    const [topic, setTopic] = useState("")
    const [instructions, setInstructions] = useState("")
    const [pdfPages, setPdfPages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const router = useRouter()
    const items = [
        {
            price: lowPrice,
            disabled: false,
            value: "subject",
            text: "Text Input",
            icon: <LetterTextIcon className="w-7 text-indigo-500 h-7" />,
            description:
                "Create a mind map from any topic or subject you specify.",
        },
        {
            price: highPrice,
            disabled: false,
            value: "document",
            text: "Upload PDF",
            icon: <FileTextIcon className="w-7 h-7 text-indigo-500" />,
            description:
                "Upload a PDF file to generate questions from its content.",
        },
        {
            price: highPrice,
            disabled: false,
            value: "youtube",
            text: "YouTube Video",
            icon: <Video className="w-7 text-indigo-500 h-7" />,
            description:
                "Convert a YouTube video into a mind map by entering its URL.",
        },
        {
            price: highPrice,
            disabled: false,
            value: "image",
            text: "Extract from Images",
            icon: <ImageIcon className="w-7 text-indigo-500 h-7" />,
            description:
                "Upload images with text to generate visual mind maps.",
        },
    ]

    const handleCardClick = (tab: string) => {
        setCurrentTab(tab as any)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (currentTab === "subject") {
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=subject&topic=${topic}&language=${language}&additionalInstructions=${instructions}`
                )
            }
            if (currentTab === "document") {
                const pdfPagesLocalId = await mindmapsContentDb.content.add({
                    pdfPages,
                    imagesInBase64: [],
                })
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=document&pdfPagesLocalId=${pdfPagesLocalId}&language=${language}&additionalInstructions=${instructions}`
                )
            }
            if (currentTab === "image") {
                const imagesBase64DbId = await mindmapsContentDb.content.add({
                    pdfPages: [],
                    imagesInBase64,
                })
                router.push(
                    `/mind-maps/generate?shouldGenerate=true&contentType=image&imagesInBase64Id=${imagesBase64DbId}&language=${language}&additionalInstructions=`
                )
            }
            if (currentTab === "youtube") {
                router.push(
                    `/mind-maps/generate?youtubeUrl=${youtubeUrl}&shouldGenerate=true&contentType=youtube&language=${language}&additionalInstructions=`
                )
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <Dialog
                onOpenChange={(value) => {
                    if (value === false) {
                        wait(300).then(() => {
                            setCurrentTab(null)
                        })
                    }
                    props.setIsOpen(value)
                }}
                open={props.isOpen}
            >
                <DialogTrigger asChild>
                    <Button className="text-base md:w-fit w-full h-[3.2rem]">
                        <Plus className="-mr-1 !w-5 stroke-2 !h-5" /> Add
                        Mindmap
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className={cn(
                        "sm:min-w-[1000px] md:w-[1000px] md:max-w-[1000px]",
                        {
                            "w-[1000px]": currentTab === null,
                        }
                    )}
                >
                    <DialogHeader>
                        <DialogTitle className="md:text-4xl text-2xl mt-20 md:mt-2 text-center font-bold text-neutral-500">
                            Generate a Mind Map
                        </DialogTitle>
                        <DialogDescription className="text-neutral-600"></DialogDescription>
                    </DialogHeader>

                    {!currentTab && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 md:mt-6">
                            {items.map((item) => (
                                <Card
                                    key={item.value}
                                    onClick={() => {
                                        if (
                                            Number(creditBalance) < item.price
                                        ) {
                                            return setIsInsufficientCredits(
                                                true
                                            )
                                        }
                                        handleCardClick(item.value)
                                    }}
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
                                        <div className="flex items-center ">
                                            <h3 className="text-xl text-neutral-700 font-bold pt-1">
                                                {item.text}
                                            </h3>
                                            <Badge
                                                variant={"blue"}
                                                className=" py-0 scale-80 px-2 font-bold inline-flex gap-[3px] ml-1 !text-lg"
                                            >
                                                {item.price}{" "}
                                                <CreditIcon className="!w-5 !h-5" />
                                            </Badge>
                                        </div>
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
                    {currentTab === "image" && (
                        <form onSubmit={handleSubmit} className="mt-6">
                            <ImageInput onChange={setImagesInBase64} />
                            <Button
                                type="submit"
                                className="text-lg mt-5 h-[52px] w-full"
                                isLoading={isSubmitting}
                                disabled={imagesInBase64.length === 0}
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
                            <div className="-mt-1"></div>
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
                    {currentTab === "youtube" && (
                        <form onSubmit={handleSubmit} className="mt-5 pb-0">
                            <div>
                                <label
                                    htmlFor="text"
                                    className="font-medium text-neutral-600"
                                >
                                    Youtube url
                                    <span className="text-red-400 text-xl font-semibold">
                                        *
                                    </span>
                                </label>
                                <Input
                                    errorMessage=""
                                    className="w-full"
                                    id="text"
                                    value={youtubeUrl}
                                    onChange={(e) =>
                                        setYoutubeUrl(e.target.value)
                                    }
                                    placeholder="https://www.youtube.com/watch?v=something"
                                    required
                                />
                            </div>
                            <div className="-mt-1"></div>

                            <Button
                                type="submit"
                                className="text-lg h-[52px] w-full"
                                isLoading={isSubmitting}
                                disabled={!youtubeUrl}
                            >
                                Generate Mind Map
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={setIsInsufficientCredits}
            />
        </>
    )
}
