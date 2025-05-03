import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { ErrorDisplay } from "@/components/shared/error-display"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import TooltipWrapper from "@/components/ui/tooltip"
import { updateMindmap } from "@/data-access/mindmaps/update"
import { PublishingStatusType } from "@/data-access/types"
import { Check, Copy } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    status: PublishingStatusType
    id: number
}

export default function ShareDialog(props: Props) {
    const [copied, setCopied] = useState(false)
    const [sharingLink, setSharingLink] = useState("")
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const translation = useMemo(
        () => ({
            en: {
                "Share Mindmap": "Share Mindmap",
                "Copy link": "Copy link",
                Facebook: "Facebook",
                WhatsApp: "WhatsApp",
            },
            fr: {
                "Share Mindmap": "Partager la carte mentale",
                "Copy link": "Copier le lien",
                Facebook: "Facebook",
                WhatsApp: "WhatsApp",
            },
            ar: {
                "Share Mindmap": "مشاركة الخريطة الذهنية",
                "Copy link": "نسخ الرابط",
                Facebook: "فيسبوك",
                WhatsApp: "واتساب",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const handleCopy = () => {
        navigator.clipboard.writeText(sharingLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    useEffect(() => {
        if (props.isOpen) {
            if (props.status !== "PUBLISHED") {
                updateMindmap(props.id, { publishing_status: "PUBLISHED" })
                    .then(() => {
                        setSharingLink(
                            `${window.location.origin}/mind-maps/${props.id}?share=true`
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
                setSharingLink(
                    `${window.location.origin}/mind-maps/${props.id}?share=true`
                )
            }
        }
    }, [props.id, props.isOpen, props.status])

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                sharingLink
            )}`,
            "_blank"
        )
    }

    const shareToWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodeURIComponent(sharingLink)}`,
            "_blank"
        )
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[700px] !rounded-xl bg-white dark:bg-neutral-900">
                <DialogTitle className="text-3xl text-neutral-600 dark:text-neutral-100 text-center font-bold">
                    {t["Share Mindmap"]}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-neutral-300"></DialogDescription>
                {isLoading && <ShareDialogSkeleton />}
                {isError && <ErrorDisplay hideButton />}
                {!isLoading && !isError && (
                    <>
                        <div className="flex items-center mt-4 space-x-2 rtl:space-x-reverse">
                            <div className="flex-1 flex items-center border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-neutral-800">
                                <input
                                    className="w-full p-3 text-lg font-semibold text-neutral-700 dark:text-neutral-100 bg-transparent outline-none flex-1"
                                    value={sharingLink}
                                    readOnly
                                />
                            </div>
                            <TooltipWrapper asChild content={t["Copy link"]}>
                                <button
                                    onClick={handleCopy}
                                    className="p-3 h-14 w-14 rounded-lg border-2 border-blue-400/80 active:scale-90 text-blue-600 dark:text-blue-300 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 flex items-center justify-center relative overflow-hidden bg-white dark:bg-neutral-800"
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
                        <div className="-mt-2 flex justify-center">
                            <div className="flex gap-8">
                                <div className="cursor-pointer flex flex-col items-center">
                                    <button
                                        onClick={shareToFacebook}
                                        className="group p-3 scale-80 cursor-pointer rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-300"
                                    >
                                        <FacebookIcon className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                    <span className="mt-2 text-sm font-medium text-gray-600 dark:text-neutral-200">
                                        {t.Facebook}
                                    </span>
                                </div>
                                <div className="flex cursor-pointer flex-col items-center">
                                    <button
                                        onClick={shareToWhatsApp}
                                        className="group cursor-pointer p-3 rounded-full bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/60 transition-all duration-300"
                                    >
                                        <WhatsAppIcon className="w-10 h-10 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                    <span className="mt-2 text-sm font-medium text-gray-600 dark:text-neutral-200">
                                        {t.WhatsApp}
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

function ShareDialogSkeleton() {
    return (
        <>
            <div className="flex items-center mt-4 space-x-2 rtl:space-x-reverse">
                <div className="flex-1 flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
                    <div className="w-full p-3 h-14">
                        <div className="h-7 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-md w-full"></div>
                    </div>
                </div>
                <div className="p-3 h-14 w-14 rounded-lg border-2 border-gray-200 dark:border-neutral-700 flex items-center justify-center">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-md"></div>
                </div>
            </div>

            <div className="mt-2 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-neutral-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-neutral-900 px-4 text-gray-200 dark:text-neutral-700">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-md"></div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="-mt-2 flex justify-center">
                <div className="flex gap-8">
                    {[1, 2].map((index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="p-3 rounded-full bg-gray-100 dark:bg-neutral-800">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
                            </div>
                            <div className="mt-2 h-4 w-16 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
