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
import { useEffect, useState } from "react"

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
            <DialogContent className="sm:max-w-[700px] !rounded-xl">
                <DialogTitle className="text-3xl text-neutral-600 text-center font-bold">
                    Share Mindmap
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
                                    value={sharingLink}
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
                        <div className="-mt-2 flex justify-center">
                            <div className="flex gap-8">
                                <div className="cursor-pointer flex flex-col items-center">
                                    <button
                                        onClick={shareToFacebook}
                                        className="group p-3 scale-80 cursor-pointer rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-300"
                                    >
                                        <FacebookIcon className="w-10  h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                    <span className="mt-2 text-sm font-medium text-gray-600">
                                        Facebook
                                    </span>
                                </div>
                                <div className="flex cursor-pointer flex-col items-center">
                                    <button
                                        onClick={shareToWhatsApp}
                                        className="group cursor-pointer p-3 rounded-full bg-green-50 hover:bg-green-100 transition-all duration-300"
                                    >
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

function WhatsAppIcon(props: { className: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="63"
            height="63"
            viewBox="0 0 63 63"
            fill="none"
        >
            <path
                d="M31.5 63C48.897 63 63 48.897 63 31.5C63 14.103 48.897 0 31.5 0C14.103 0 0 14.103 0 31.5C0 48.897 14.103 63 31.5 63Z"
                fill="url(#paint0_linear_2428_72323)"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M46.6524 16.7346C42.8818 12.9593 37.8604 10.8779 32.5171 10.8779C21.5038 10.8779 12.5391 19.8379 12.5344 30.8513C12.5344 34.3699 13.4538 37.8093 15.2038 40.8379L12.3711 51.1886L22.9644 48.4119C25.8811 50.0033 29.1711 50.8433 32.5124 50.8433H32.5218C43.5351 50.8433 52.4998 41.8833 52.5044 30.8653C52.4998 25.5313 50.4231 20.5099 46.6524 16.7346ZM32.5171 47.4693H32.5124C29.5304 47.4693 26.6091 46.6666 24.0611 45.1546L23.4544 44.7953L17.1684 46.4426L18.8484 40.3153L18.4518 39.6853C16.7904 37.0439 15.9131 33.9873 15.9131 30.8513C15.9131 21.6999 23.3611 14.2519 32.5218 14.2519C36.9598 14.2519 41.1271 15.9833 44.2631 19.1193C47.3991 22.2599 49.1258 26.4273 49.1211 30.8653C49.1211 40.0213 41.6731 47.4693 32.5171 47.4693ZM41.6264 35.0326C41.1271 34.7806 38.6724 33.5766 38.2151 33.4086C37.7578 33.2406 37.4264 33.1566 37.0904 33.6606C36.7591 34.1599 35.8024 35.2846 35.5084 35.6159C35.2191 35.9473 34.9251 35.9893 34.4258 35.7419C33.9264 35.4899 32.3164 34.9673 30.4124 33.2639C28.9284 31.9386 27.9251 30.3053 27.6358 29.8059C27.3464 29.3066 27.6031 29.0359 27.8551 28.7886C28.0791 28.5646 28.3544 28.2053 28.6018 27.9159C28.8491 27.6266 28.9331 27.4166 29.1011 27.0853C29.2691 26.7539 29.1851 26.4599 29.0591 26.2126C28.9331 25.9606 27.9344 23.5059 27.5191 22.5073C27.1131 21.5319 26.7024 21.6673 26.3944 21.6486C26.1051 21.6346 25.7691 21.6299 25.4378 21.6299C25.1064 21.6299 24.5651 21.7559 24.1078 22.2553C23.6504 22.7546 22.3624 23.9633 22.3624 26.4179C22.3624 28.8726 24.1498 31.2479 24.4018 31.5793C24.6491 31.9106 27.9204 36.9553 32.9324 39.1159C34.1224 39.6293 35.0558 39.9373 35.7791 40.1659C36.9738 40.5439 38.0658 40.4926 38.9244 40.3619C39.8858 40.2173 41.8784 39.1533 42.2938 37.9866C42.7091 36.8199 42.7091 35.8213 42.5831 35.6113C42.4618 35.4106 42.1258 35.2846 41.6264 35.0326Z"
                fill="white"
            ></path>
            <defs>
                <linearGradient
                    id="paint0_linear_2428_72323"
                    x1="31.5"
                    y1="58.4231"
                    x2="31.5"
                    y2="-4.57693"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#78CD51"></stop>
                    <stop offset="1" stopColor="#A0FC84"></stop>
                </linearGradient>
            </defs>
        </svg>
    )
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 512 512"
        >
            <path
                className="opacity-90 "
                fill="#0866FF"
                d="M134.941,272.691h56.123v231.051c0,4.562,3.696,8.258,8.258,8.258h95.159  c4.562,0,8.258-3.696,8.258-8.258V273.78h64.519c4.195,0,7.725-3.148,8.204-7.315l9.799-85.061c0.269-2.34-0.472-4.684-2.038-6.44  c-1.567-1.757-3.81-2.763-6.164-2.763h-74.316V118.88c0-16.073,8.654-24.224,25.726-24.224c2.433,0,48.59,0,48.59,0  c4.562,0,8.258-3.698,8.258-8.258V8.319c0-4.562-3.696-8.258-8.258-8.258h-66.965C309.622,0.038,308.573,0,307.027,0  c-11.619,0-52.006,2.281-83.909,31.63c-35.348,32.524-30.434,71.465-29.26,78.217v62.352h-58.918c-4.562,0-8.258,3.696-8.258,8.258  v83.975C126.683,268.993,130.379,272.691,134.941,272.691z"
            />
        </svg>
    )
}
function ShareDialogSkeleton() {
    return (
        <>
            <div className="flex items-center mt-4 space-x-2">
                <div className="flex-1 flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    <div className="w-full p-3 h-14">
                        <div className="h-7 bg-gray-200 animate-pulse rounded-md w-full"></div>
                    </div>
                </div>
                <div className="p-3 h-14 w-14 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                    <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
            </div>

            <div className="mt-2 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-gray-200">
                            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="-mt-2 flex justify-center">
                <div className="flex gap-8">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="p-3 rounded-full bg-gray-100">
                                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                            </div>
                            <div className="mt-2 h-4 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
