"use client"

import { CREDITS_FOR_10_DINARS } from "@/app/api/buy-credits/generate-payment-link/constants"
import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { generatePaymentLink } from "@/data-access/payments/handle-payment"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
}

export default function InsufficientCreditsDialog(props: Props) {
    const [tab, setTab] = useState<"default" | "payment">("default")
    const options = [10, 20, 30, 40, 50]
    const [selectedPrice, setSelectedPrice] = useState<string>("10")
    const [loadingButton, setLoadingButton] = useState<
        null | "online" | "e-dinar" | "bank" | "poste"
    >(null)

    const lang = getLanguage()
    const t = useMemo(
        () =>
            ({
                en: {
                    "You've run out of credits!": "You've run out of credits !",
                    "Purchase more credits to continue using our services":
                        "Purchase more credits to continue using our services",
                    "More Credits": "More Credits",
                    OR: "OR",
                    Amount: "Amount",
                    "Please select a price": "Please select a price",
                    "credit for": "credit for",
                    Dinars: "Dinars",
                    "Payment Methods": "Payment Methods",
                    "Online payment": "Online payment",
                    "E-Dinar": "E-Dinar",
                    "Bank transfer": "Bank transfer",
                    "Mandat post (soon..)": "Mandat post (soon..)",
                    Back: "Back",
                    "Contact our support team :": "Contact our support team :",
                    Whatsapp: "Whatsapp",
                    Facebook: "Facebook",
                    "Something went wrong": "Something went wrong",
                },
                fr: {
                    "You've run out of credits!":
                        "Vous n'avez plus de crédits !",
                    "Purchase more credits to continue using our services":
                        "Achetez plus de crédits pour continuer à utiliser nos services",
                    "More Credits": "Plus de crédits",
                    OR: "OU",
                    Amount: "Montant",
                    "Please select a price": "Veuillez sélectionner un prix",
                    "credit for": "crédits pour",
                    Dinars: "Dinars",
                    "Payment Methods": "Méthodes de paiement",
                    "Online payment": "Paiement en ligne",
                    "E-Dinar": "E-Dinar",
                    "Bank transfer": "Virement bancaire",
                    "Mandat post (soon..)": "Mandat postal (bientôt..)",
                    Back: "Retour",
                    "Contact our support team :":
                        "Contactez notre équipe d'assistance :",
                    Whatsapp: "Whatsapp",
                    Facebook: "Facebook",
                    "Something went wrong": "Une erreur est survenue",
                },
                ar: {
                    "You've run out of credits!": "لقد نفذ رصيدك !",
                    "Purchase more credits to continue using our services":
                        "اشترِ المزيد من الرصيد للاستمرار في استخدام خدماتنا",
                    "More Credits": "رصيد إضافي",
                    OR: "أو",
                    Amount: "المبلغ",
                    "Please select a price": "يرجى اختيار السعر",
                    "credit for": "رصيد مقابل",
                    Dinars: "دينار",
                    "Payment Methods": "طرق الدفع",
                    "Online payment": "الدفع عبر الإنترنت",
                    "E-Dinar": "إي-دينار",
                    "Bank transfer": "التحويل البنكي",
                    "Mandat post (soon..)": "التحويل البريدي (قريبًا..)",
                    Back: "عودة",
                    "Contact our support team :":
                        "تواصل مع فريق الدعم الخاص بنا :",
                    Whatsapp: "واتساب",
                    Facebook: "فيسبوك",
                    "Something went wrong": "حدث خطأ ما",
                },
            }[lang]),
        [lang]
    )

    const handleOnlinePayment = async () => {
        const price = Number(selectedPrice)
        if (!price || isNaN(price)) {
            setLoadingButton(null)
            return toastError(t["Something went wrong"])
        }
        const creditCount = CREDITS_FOR_10_DINARS * (price / 10)
        const link = await generatePaymentLink({
            credits: creditCount,
        })
        if (!link) {
            setLoadingButton(null)
            return toastError(t["Something went wrong"])
        }
        window.open(link)
        wait(10).then(() => {
            window.close()
        })
        setLoadingButton(null)
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="md:max-w-[800px] md:min-w-[800px] w-[800px] flex flex-col items-center">
                <DialogTitle className="text-center h-fit text-3xl md:text-4xl pt-5 md:pt-2 text-neutral-600 font-bold"></DialogTitle>

                {tab === "default" && (
                    <div className="flex flex-col items-center gap-6 -mt-2 pb-8 md:min-w-[400px]">
                        <Icon />

                        <div className="text-center space-y-3">
                            <p className="md:text-2xl text-xl text-neutral-700 font-bold">
                                {t["You've run out of credits!"]}
                            </p>
                            <p className="text-neutral-600">
                                {
                                    t[
                                        "Purchase more credits to continue using our services"
                                    ]
                                }
                            </p>
                        </div>
                        <Button
                            className="w-full "
                            onClick={() => {
                                setTab("payment")
                            }}
                        >
                            {t["More Credits"]}
                        </Button>
                        <div className="flex items-center  w-full">
                            <hr className="rounded-full w-full bg-[#E5E5E5] h-1" />
                            <p className="mx-2 font-bold text-[#AFAFAF]">
                                {t.OR}
                            </p>
                            <hr className="rounded-full w-full bg-[#E5E5E5] h-1" />
                        </div>
                    </div>
                )}
                {tab === "payment" && (
                    <div className=" w-full">
                        <Button
                            onClick={() => {
                                setTab("default")
                            }}
                            className="absolute font-bold text-neutral-500 top-2 left-2 md:top-4 md:left-4 "
                            variant={"secondary"}
                        >
                            <ChevronLeft className="!w-5 !h-5 -mr-1 stroke-[2.5]" />{" "}
                            {t.Back}
                        </Button>
                        <div className="mt-10"></div>
                        <label className="font-bold  text-neutral-700 ml-1 text-lg">
                            {t.Amount}{" "}
                        </label>
                        <Select
                            value={selectedPrice}
                            onValueChange={setSelectedPrice}
                        >
                            <SelectTrigger>
                                <div>
                                    {selectedPrice ? (
                                        <div>
                                            {CREDITS_FOR_10_DINARS *
                                                (Number(selectedPrice) /
                                                    10)}{" "}
                                            {t["credit for"]} {selectedPrice}{" "}
                                            {t.Dinars}{" "}
                                        </div>
                                    ) : (
                                        <div className="">
                                            {t["Please select a price"]}
                                        </div>
                                    )}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((item) => {
                                    return (
                                        <SelectItem
                                            key={item}
                                            value={String(item)}
                                        >
                                            {CREDITS_FOR_10_DINARS *
                                                (Number(item) / 10)}{" "}
                                            {t["credit for"]} {item} {t.Dinars}{" "}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>

                        <div className="md:grid md:gap-x-8 gap-y-3 flex flex-col md:gap-y-5 md:grid-cols-2 mt-2">
                            <div className="col-span-2 text-center font-bold text-neutral-700 text-2xl">
                                {t["Payment Methods"]}
                            </div>
                            <Button
                                isLoading={loadingButton == "online"}
                                onClick={() => {
                                    setLoadingButton("online")
                                    handleOnlinePayment()
                                }}
                                className="h-44 hover:bg-white w-full hover:scale-105  flex flex-col rounded-3xl text-xl "
                                variant={"secondary"}
                            >
                                <div className="flex items-center gap-10">
                                    <img
                                        className="h-12 "
                                        alt=""
                                        src="/icons/master-card.png"
                                    />
                                    <img
                                        className="h-12 border rounded-xl p-1"
                                        alt=""
                                        src="/icons/visa.png"
                                    />
                                </div>
                                <p className="mt-5 text-2xl font-bold">
                                    {t["Online payment"]}
                                </p>
                            </Button>
                            <Button
                                isLoading={loadingButton == "e-dinar"}
                                className="h-44 hover:bg-white w-full hover:scale-105  rounded-3xl overflow-hidden text-xl flex flex-col "
                                variant={"secondary"}
                                onClick={() => {
                                    setLoadingButton("e-dinar")
                                    handleOnlinePayment()
                                }}
                            >
                                <div className=" ">
                                    <img
                                        className="h-32 -mt-20 translate-y-5 w-full  rounded-xl "
                                        alt=""
                                        src="/icons/edinar.png"
                                    />
                                </div>
                                <p className="z-50  text-2xl font-bold">
                                    {t["E-Dinar"]}
                                </p>
                            </Button>
                            <Link
                                href={`/offers/bank-payment?price=${selectedPrice}`}
                                className="flex h-44"
                            >
                                <Button
                                    className="h-44 w-full hover:bg-white hover:scale-105  flex flex-col rounded-3xl text-xl "
                                    variant={"secondary"}
                                >
                                    <img
                                        className="h-12 scale-180 -translate-y-1 rounded-xl p-1"
                                        alt=""
                                        src="/icons/banque-zitouna.png"
                                    />
                                    <p className="mt-5 text-2xl font-bold">
                                        {t["Bank transfer"]}
                                    </p>
                                </Button>
                            </Link>
                            <Button
                                className="h-44 w-full bg-neutral-200 hover:bg-white hover:scale-105  flex flex-col rounded-3xl text-xl "
                                variant={"secondary"}
                                disabled
                            >
                                <img
                                    className="h-12 scale-180 -translate-y-1 rounded-xl "
                                    alt=""
                                    src="/icons/tunisian-post.png"
                                />
                                <p className="mt-5 text-2xl font-bold">
                                    {t["Mandat post (soon..)"]}
                                </p>
                            </Button>
                        </div>
                    </div>
                )}
                <div>
                    <div
                        className={cn("text-center mt-4 ", {
                            "-mt-9": tab === "default",
                        })}
                    >
                        {t["Contact our support team :"]}
                    </div>
                    <div className="flex md:flex-row flex-col justify-center gap-3 mt-4 items-center">
                        <Link
                            className="w-full"
                            href={
                                "https://api.whatsapp.com/send/?phone=%2B21628348622&text&type=phone_number&app_absent=0"
                            }
                        >
                            <Button
                                className="text-lg h-16 w-full "
                                variant={"secondary"}
                            >
                                <WhatsAppIcon className=" !w-10 !h-10" />{" "}
                                {t.Whatsapp}
                            </Button>
                        </Link>
                        <Link
                            className="w-full"
                            href={"https://www.messenger.com/t/100016410070680"}
                        >
                            <Button
                                className="text-lg w-full h-16 "
                                variant={"secondary"}
                            >
                                <FacebookIcon className=" !w-10 scale-90 border rounded-full p-1 !h-10" />{" "}
                                {t.Facebook}
                            </Button>
                        </Link>
                    </div>
                </div>
                <DialogDescription className="text-center text-sm text-neutral-500"></DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

function Icon() {
    return (
        <svg
            width="217"
            height="217"
            viewBox="0 0 217 217"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_1208_51)">
                <mask
                    id="mask0_1208_51"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="217"
                    height="217"
                >
                    <path d="M217 0H0V217H217V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_1208_51)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M67.7479 25.9802C56.4006 31.1367 40.2041 46.2051 37.8211 53.8367C36.144 59.2053 37.7934 64.7 42.2419 67.815C45.5653 70.1429 48.0005 69.4213 51.7742 68.7561C55.7479 68.0555 57.773 67.137 62.0692 61.7804C67.3665 55.1758 71.3402 51.854 79.0515 47.5819C85.141 44.2079 85.746 41.3039 86.423 36.6454C86.799 34.0566 86.488 32.295 85.249 29.9902C81.896 23.7549 75.7472 22.3467 67.7479 25.9802Z"
                        fill="#F6C564"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M73.8271 5.97842C46.0873 15.4483 24.2183 34.7602 11.0216 61.4409C6.44966 70.6855 1.21447 90.046 0.556166 100.149C-1.16783 126.587 6.03386 151.169 21.726 172.404C65.0614 231.05 152.301 230.75 195.448 171.808C213.427 147.246 219.879 117.983 213.991 87.694C210.47 69.5764 204.244 55.7381 193.355 41.8247C171.333 13.6831 137.294 -1.61598 101.469 0.523425C88.8321 1.27852 85.9021 1.85562 73.8271 5.97842ZM66.1822 26.9139C54.9268 32.2668 40.0981 46.5681 37.8487 54.24C36.2654 59.6381 37.8225 64.1358 42.3246 67.1727C45.6882 69.4423 47.0077 69.7267 50.7695 68.9948C54.7303 68.2249 55.7548 67.447 59.9567 62.0172C65.1381 55.3202 69.0532 51.9295 76.6888 47.5235C82.7181 44.0447 84.4451 41.9213 85.0401 37.2516C85.3711 34.6556 85.0301 32.9007 83.7511 30.6179C80.2896 24.4421 74.117 23.1405 66.1822 26.9139Z"
                        fill="#FFB100"
                    />
                    <path
                        d="M65.9564 89.8115C60.6812 84.3643 60.6812 75.5327 65.9564 70.0855C71.2316 64.6382 79.7843 64.6382 85.0595 70.0855L150.044 137.189C155.319 142.636 155.319 151.468 150.044 156.915C144.769 162.362 136.216 162.362 130.941 156.915L65.9564 89.8115Z"
                        fill="white"
                    />
                    <path
                        d="M134.887 69.1255C140.388 63.6248 149.306 63.6248 154.807 69.1255C160.307 74.6261 160.307 83.5444 154.807 89.045L87.045 156.807C81.5444 162.307 72.6261 162.307 67.1255 156.807C61.6248 151.306 61.6248 142.388 67.1255 136.887L134.887 69.1255Z"
                        fill="white"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_1208_51">
                    <rect width="217" height="217" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
