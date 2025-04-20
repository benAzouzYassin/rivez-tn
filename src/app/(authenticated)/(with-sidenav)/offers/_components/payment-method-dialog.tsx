"use client"

import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SearchSelect from "@/components/ui/search-select"
import { generatePaymentLink } from "@/data-access/payments/handle-payment"
import Link from "next/link"
import { ReactNode, useState } from "react"
import { CREDITS_FOR_10_DINARS } from "@/app/api/buy-credits/generate-payment-link/constants"
import { toastError } from "@/lib/toasts"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { wait } from "@/utils/wait"

interface Props {
    children: ReactNode
}

export default function PaymentMethodDialog(props: Props) {
    const options = [10, 20, 30, 40, 50]
    const [selectedPrice, setSelectedPrice] = useState<string>("10")
    const [loadingButton, setLoadingButton] = useState<
        null | "online" | "e-dinar" | "bank" | "poste"
    >(null)

    const handleOnlinePayment = async () => {
        const price = Number(selectedPrice)
        if (!price || isNaN(price)) {
            setLoadingButton(null)
            return toastError("Something went wrong")
        }
        const creditCount = CREDITS_FOR_10_DINARS * (price / 10)
        const link = await generatePaymentLink({
            credits: creditCount,
        })
        if (!link) {
            setLoadingButton(null)
            return toastError("Something went wrong")
        }
        window.open(link)
        wait(10).then(() => {
            window.close()
        })
        setLoadingButton(null)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="md:min-h-[80vh] md:min-w-[700px] flex flex-col">
                <DialogTitle className="text-center  h-fit text-3xl  md:text-5xl pt-5 md:pt-2 text-neutral-600 font-bold">
                    Buy credits
                </DialogTitle>
                <div className="">
                    <label className="font-bold text-neutral-700 ml-1 text-lg">
                        Amount{" "}
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
                                            (Number(selectedPrice) / 10)}{" "}
                                        credit for {selectedPrice} Dinars{" "}
                                    </div>
                                ) : (
                                    <div className="">
                                        Please select a price
                                    </div>
                                )}
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((item) => {
                                return (
                                    <SelectItem key={item} value={String(item)}>
                                        {CREDITS_FOR_10_DINARS *
                                            (Number(item) / 10)}{" "}
                                        credit for {item} Dinars{" "}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>

                    <div className="md:grid md:gap-x-8 gap-y-3 flex flex-col md:gap-y-5 md:grid-cols-2 mt-2">
                        <div className="col-span-2 text-center font-bold text-neutral-700 text-2xl">
                            Payment Methods
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
                                Online payment
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
                            <p className="z-50  text-2xl font-bold">E-Dinar</p>
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
                                    Bank transfer
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
                                Mandat post (soon..)
                            </p>
                        </Button>
                    </div>
                    <p className="text-center mt-6 font-bold text-neutral-700 text-2xl">
                        Contact Methods :{" "}
                    </p>

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
                                Whatsapp
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
                                Facebook
                            </Button>
                        </Link>
                    </div>
                    <p className="text-center text-xl text-neutral-700 mt-6 font-bold">
                        Phone : +216 28 348 622
                    </p>
                </div>
                <DialogDescription></DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
