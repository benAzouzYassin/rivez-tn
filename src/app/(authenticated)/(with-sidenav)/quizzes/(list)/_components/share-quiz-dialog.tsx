import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Check } from "lucide-react"
import MessengerIcon from "./messenger-icon"
import WhatsAppIcon from "./whatsapp-icon"
import InstaIcon from "./insta-icon"
import TooltipWrapper from "@/components/ui/tooltip"
import { PublishingStatusType } from "@/data-access/types"
import { updateQuiz } from "@/data-access/quizzes/update"
import { ErrorDisplay } from "@/components/shared/error-display"
import ShareDialogSkeleton from "./share-dialog-skeleton"

interface Props {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    status: PublishingStatusType
    id: number
}
export default function ShareQuizDialog(props: Props) {
    const [copied, setCopied] = useState(false)
    const [quizLink, setQuizLink] = useState("")
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const handleCopy = () => {
        navigator.clipboard.writeText(quizLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    useEffect(() => {
        if (props.isOpen) {
            if (props.status !== "PUBLISHED") {
                updateQuiz(props.id, { publishing_status: "PUBLISHED" })
                    .then(() => {
                        setQuizLink(
                            `${window.location.origin}/quizzes/${props.id}?share=true`
                        )
                    })
                    .catch((err) => {
                        console.error(err)
                        setIsError(true)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                setIsLoading(false)
                setQuizLink(
                    `${window.location.origin}/quizzes/${props.id}?share=true`
                )
            }
        }
    }, [props.id, props.isOpen, props.status])

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[700px] !rounded-xl">
                <DialogTitle className="text-3xl text-neutral-600 text-center font-bold">
                    Share Quiz
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500"></DialogDescription>
                {isLoading && <ShareDialogSkeleton />}
                {isError && <ErrorDisplay hideButton />}
                {!isLoading && !isError && (
                    <>
                        <div className="flex items-center mt-4 space-x-2">
                            <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                                <input
                                    className="w-full p-3 text-lg font-semibold text-neutral-700 bg-transparent outline-none flex-1"
                                    value={quizLink}
                                    readOnly
                                />
                            </div>
                            <TooltipWrapper asChild content="Copy link">
                                <button
                                    onClick={handleCopy}
                                    className="p-3 h-14 w-14 rounded-lg border-2 border-blue-400/80 active:scale-90 text-blue-600 cursor-pointer hover:bg-blue-50 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                                    disabled={copied}
                                >
                                    <span
                                        className={`absolute transform transition-all duration-300 ${
                                            copied ? "scale-0" : "scale-100"
                                        }`}
                                    >
                                        <Copy size={20} />
                                    </span>
                                    <span
                                        className={`absolute transform transition-all duration-300 ${
                                            copied ? "scale-100" : "scale-0"
                                        }`}
                                    >
                                        <Check size={18} />
                                    </span>
                                </button>
                            </TooltipWrapper>
                        </div>

                        <div className="mt-2 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4  text-gray-500">
                                        or share directly
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="-mt-2 flex justify-center">
                            <div className="flex gap-8">
                                <div className="flex cursor-pointer flex-col items-center">
                                    <button className="group p-3 cursor-pointer rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-300">
                                        <MessengerIcon className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                    <span className="mt-2 text-sm font-medium text-gray-600">
                                        Messenger
                                    </span>
                                </div>
                                <div className="cursor-pointer flex flex-col items-center">
                                    <button className="group p-3 cursor-pointer rounded-full bg-purple-50 hover:bg-purple-100 transition-all duration-300">
                                        <InstaIcon className="w-10 h-10 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                    <span className="mt-2 text-sm font-medium text-gray-600">
                                        Instagram
                                    </span>
                                </div>
                                <div className="flex cursor-pointer flex-col items-center">
                                    <button className="group cursor-pointer p-3 rounded-full bg-green-50 hover:bg-green-100 transition-all duration-300">
                                        <WhatsAppIcon className="w-10 h-10 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                    <span className="mt-2 text-sm font-medium text-gray-600">
                                        WhatsApp
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
