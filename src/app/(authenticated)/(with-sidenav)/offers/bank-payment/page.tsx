"use client"

import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PhoneIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
export const dynamic = "force-static"
export default function Page() {
    const searchParams = useSearchParams()
    const price = searchParams.get("price")
    return (
        <section className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-700">
                    Complete Your Payment
                </h1>
                <p className="text-base sm:text-lg text-neutral-600 mt-2">
                    Follow these simple steps to finalize your subscription
                </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl overflow-hidden">
                {/* Step 1: Bank Transfer */}
                <div className="p-4 sm:p-6 border-b border-neutral-200">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <div className="bg-blue-100 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm sm:text-base">
                                1
                            </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-700">
                            Transfer Payment
                        </h2>
                    </div>

                    <div className="sm:ml-11">
                        <p className="text-neutral-700 mb-3 sm:mb-4 font-semibold text-sm sm:text-base">
                            Please transfer{" "}
                            <span className="font-bold text-blue-600">
                                {price} TND
                            </span>{" "}
                            to the following bank account:
                        </p>

                        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-3 sm:mb-4">
                                <img
                                    className="h-8 sm:h-12 mr-2 sm:mr-3 rounded"
                                    alt="Banque Zitouna Logo"
                                    src="/icons/banque-zitouna.png"
                                />
                                <span className="text-lg sm:text-xl font-semibold text-neutral-700">
                                    Banque Zitouna
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-neutral-500">
                                        Account Name
                                    </p>
                                    <p className="font-bold text-neutral-700 text-sm sm:text-base">
                                        YASSINE BEN AZOUZ
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-neutral-500">
                                        RIB Number
                                    </p>
                                    <p className="font-bold text-neutral-700 font-mono text-sm sm:text-base break-all">
                                        25084000000122741190
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Contact Confirmation */}
                <div className="p-4 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <div className="bg-blue-100 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm sm:text-base">
                                2
                            </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-700">
                            Confirm Your Payment
                        </h2>
                    </div>

                    <div className="sm:ml-11">
                        <p className="text-neutral-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                            After completing the transfer, please contact us
                            through one of these channels:
                        </p>
                        <div className="grid grid-cols-1 w-full md:grid-cols-3 md:px-10 gap-3 mb-4">
                            <Link
                                className="w-full"
                                href="https://api.whatsapp.com/send/?phone=%2B21628348622&text&type=phone_number&app_absent=0"
                            >
                                <Button
                                    className="w-full h-14 text-base"
                                    variant="secondary"
                                >
                                    <WhatsAppIcon className="!w-8 !h-8 " />
                                    WhatsApp
                                </Button>
                            </Link>

                            <Link
                                className="w-full"
                                href="https://www.messenger.com/t/100016410070680"
                            >
                                <Button
                                    className="w-full  h-14 text-base"
                                    variant="secondary"
                                >
                                    <FacebookIcon className="!w-9 border-2 rounded-full p-1  !h-9 " />
                                    Facebook
                                </Button>
                            </Link>

                            <Link className="w-full" href="tel:+21628348622">
                                <Button
                                    className="w-full h-14 text-base"
                                    variant="secondary"
                                >
                                    <PhoneIcon className="!w-5 stroke-neutral-500 fill-neutral-500 !h-5  mr-0" />
                                    Call Us
                                </Button>
                            </Link>
                        </div>

                        <p className="text-center pt-2 sm:pt-3 font-medium text-neutral-600 text-sm sm:text-base">
                            Phone:{" "}
                            <span className="font-semibold">
                                +216 28 348 622
                            </span>
                        </p>
                    </div>

                    <div className="text-center mt-4 sm:mt-6 text-neutral-700 font-semibold text-xs sm:text-sm">
                        <p>
                            Your subscription will be activated within 24 hours
                            after payment confirmation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
