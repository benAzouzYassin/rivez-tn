import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { Check, Copy } from "lucide-react"
import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import XpIcon from "../icons/xp"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import TooltipWrapper from "../ui/tooltip"
import { ErrorDisplay } from "./error-display"
interface Props {
    fixed?: boolean
}
export default function FloatingSection(props: Props) {
    const { data: userData } = useCurrentUser()
    return (
        <section className="  col-span-4  py-4 pr-4 pl-5 ">
            <div className={cn({ " fixed top-30 pr-4 ": props.fixed })}>
                <div className="border-neutral-200  flex flex-col min-h-[24.5rem] gap-4  border py-5 px-3 rounded-3xl">
                    <div
                        onClick={() => {}}
                        className="  transition-all  gap-5 border-2 px-4 py-3 rounded-2xl justify-between "
                    >
                        <div className="flex">
                            <div className="grow">
                                <p className="text-xl font-extrabold  text-neutral-500">
                                    Get free credits
                                </p>
                                <p className="mt-1 font-semibold text-neutral-500">
                                    Invite your friends and get{" "}
                                    <span className="text-blue-500 font-extrabold">
                                        25 free credit !
                                    </span>{" "}
                                </p>
                            </div>
                            <div className="  min-w-14 h-full  rounded-xl">
                                <FreeCredits />
                            </div>
                        </div>
                        <ShareDialog>
                            <Button
                                variant={"blue"}
                                className="h-9 mt-3 mb-2 w-full font-extrabold rounded-xl px-3"
                            >
                                Invite friend
                            </Button>
                        </ShareDialog>
                    </div>

                    <Link
                        href={"#"}
                        className=" hover:bg-neutral-100 active:scale-95 transition-all flex gap-5 border-2 px-4 items-center py-3 rounded-2xl justify-between "
                    >
                        <div className="grow">
                            <p className="text-xl font-extrabold  text-neutral-500">
                                XP Points :
                            </p>
                        </div>
                        <div className="flex items-center text-xl text-[#f5b237] font-black  gap-1">
                            {userData?.xp_points || 0}
                            <div className="w-8 h-8 text-[#f5b237]  -mt-px rounded-xl">
                                <XpIcon className="w-7 h-7" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
interface Props {
    className?: string
}
function FreeCredits(props: Props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path
                d="m8 4v3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m8 11v3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m6 9h-3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m13 9h-3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <circle cx="40.5" cy="25.5" fill="#ffe5d2" r="21.5" />
            <circle
                cx="47.5"
                cy="4.5"
                fill="none"
                r="2.5"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <circle cx="56.5" cy="44.5" fill="#4c241d" r="1.132" />
            <circle cx="59.5" cy="54.5" fill="#4c241d" r="1.132" />
            <circle cx="49.5" cy="55.5" fill="#4c241d" r="1.132" />
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path
                    d="m58.837 12.663-3.674 3.674"
                    fill="none"
                    stroke="#4c241d"
                />
                <path
                    d="m55.163 12.663 3.674 3.674"
                    fill="none"
                    stroke="#4c241d"
                />
                <circle
                    cx="32"
                    cy="33"
                    fill="#ffce56"
                    r="23"
                    stroke="#4c241d"
                />
                <path
                    d="m19.551 20a18 18 0 1 0 24.9 0"
                    fill="none"
                    stroke="#fc8c29"
                />
                <path d="m35 17v5" fill="none" stroke="#4c241d" />
                <path d="m24 17h4l-4 4h8" fill="none" stroke="#4c241d" />
                <path d="m32 23v-7h6v6" fill="none" stroke="#4c241d" />
                <path d="m40 19h-8" fill="none" stroke="#4c241d" />
                <path d="m26 14v2" fill="none" stroke="#4c241d" />
                <path d="m28 21v2" fill="none" stroke="#4c241d" />
                <path
                    d="m26.613 26.076 4.982 1.78a1.211 1.211 0 0 0 .81 0l4.982-1.78a1.2 1.2 0 0 1 1.537 1.537l-1.78 4.987a1.211 1.211 0 0 0 0 .81l1.78 4.982a1.2 1.2 0 0 1 -1.537 1.537l-4.982-1.78a1.211 1.211 0 0 0 -.81 0l-4.982 1.78a1.2 1.2 0 0 1 -1.537-1.537l1.78-4.982a1.211 1.211 0 0 0 0-.81l-1.78-4.982a1.2 1.2 0 0 1 1.537-1.542z"
                    fill="#fff"
                    stroke="#4c241d"
                />
                <circle
                    cx="14"
                    cy="50"
                    fill="#ffce56"
                    r="12"
                    stroke="#4c241d"
                />
                <circle cx="14" cy="50" fill="none" r="9" stroke="#fc8c29" />
            </g>
        </svg>
    )
}
export function ShareDialog({ children }: { children: ReactNode }) {
    const currentUser = useCurrentUser()
    const [copied, setCopied] = useState(false)
    const isDark = false

    const [shareLink, setShareLink] = useState("")

    useEffect(() => {
        if (currentUser.data?.id) {
            setShareLink(
                `${window.location.origin}?invite_code=${currentUser.data.id}`
            )
        }
    }, [currentUser])

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareLink
            )}`,
            "_blank"
        )
    }

    const shareToWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareLink)}`,
            "_blank"
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                className={`sm:max-w-[700px] !rounded-xl ${
                    isDark ? "bg-gray-900 border-gray-700" : "bg-white"
                }`}
            >
                <DialogTitle
                    className={`text-3xl text-center font-bold ${
                        isDark ? "text-gray-100" : "text-neutral-600"
                    }`}
                >
                    Invite friends
                </DialogTitle>
                <DialogDescription
                    className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                ></DialogDescription>
                {
                    <>
                        <div className="flex items-center mt-4 space-x-2">
                            <div
                                className={`flex-1 flex items-center border rounded-lg overflow-hidden ${
                                    isDark
                                        ? "border-gray-700 bg-gray-800"
                                        : "border-gray-300 bg-gray-50"
                                }`}
                            >
                                <input
                                    className={`w-full p-3 text-lg font-semibold bg-transparent outline-none flex-1 ${
                                        isDark
                                            ? "text-gray-200"
                                            : "text-neutral-700"
                                    }`}
                                    value={shareLink}
                                    readOnly
                                />
                            </div>
                            <TooltipWrapper asChild content="Copy link">
                                <button
                                    onClick={handleCopy}
                                    className={`p-3 h-14 w-14 rounded-lg border-2 active:scale-90 cursor-pointer transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                                        isDark
                                            ? "border-blue-500/80 text-blue-400 hover:bg-gray-800"
                                            : "border-blue-400/80 text-blue-600 hover:bg-blue-50"
                                    }`}
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
                }
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
