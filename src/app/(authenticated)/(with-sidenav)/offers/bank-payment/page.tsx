"use client"

import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PhoneIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

export const dynamic = "force-static"

export default function Page() {
    const searchParams = useSearchParams()
    const price = searchParams.get("price")

    const translation = useMemo(
        () => ({
            en: {
                completePayment: "Complete Your Payment",
                followSteps:
                    "Follow these simple steps to finalize your subscription",
                step1: "Transfer Payment",
                pleaseTransfer: (amount: string | null) =>
                    `Please transfer ${
                        amount ?? ""
                    } TND to the following bank account:`,
                bankName: "Banque Zitouna",
                accountNameLabel: "Account Name",
                accountName: "YASSINE BEN AZOUZ",
                ribNumberLabel: "RIB Number",
                ribNumber: "25084000000122741190",
                step2: "Confirm Your Payment",
                afterTransfer:
                    "After completing the transfer, please contact us through one of these channels:",
                whatsapp: "WhatsApp",
                facebook: "Facebook",
                callUs: "Call Us",
                phoneLabel: "Phone:",
                phoneNumber: "+216 28 348 622",
                subscriptionInfo:
                    "Your subscription will be activated within 24 hours after payment confirmation.",
            },
            fr: {
                completePayment: "Complétez votre paiement",
                followSteps:
                    "Suivez ces étapes simples pour finaliser votre abonnement",
                step1: "Virement bancaire",
                pleaseTransfer: (amount: string | null) =>
                    `Veuillez transférer ${
                        amount ?? ""
                    } TND au compte bancaire suivant :`,
                bankName: "Banque Zitouna",
                accountNameLabel: "Nom du compte",
                accountName: "YASSINE BEN AZOUZ",
                ribNumberLabel: "Numéro RIB",
                ribNumber: "25084000000122741190",
                step2: "Confirmez votre paiement",
                afterTransfer:
                    "Après avoir effectué le virement, veuillez nous contacter via l'un de ces canaux :",
                whatsapp: "WhatsApp",
                facebook: "Facebook",
                callUs: "Appelez-nous",
                phoneLabel: "Téléphone :",
                phoneNumber: "+216 28 348 622",
                subscriptionInfo:
                    "Votre abonnement sera activé dans les 24 heures suivant la confirmation du paiement.",
            },
            ar: {
                completePayment: "أكمل الدفع الخاص بك",
                followSteps: "اتبع هذه الخطوات البسيطة لإتمام اشتراكك",
                step1: "تحويل المبلغ",
                pleaseTransfer: (amount: string | null) =>
                    `يرجى تحويل ${
                        amount ?? ""
                    } دينار تونسي إلى الحساب البنكي التالي:`,
                bankName: "",
                accountNameLabel: "اسم الحساب",
                accountName: "YASSINE BEN AZOUZ",
                ribNumberLabel: "رقم RIB",
                ribNumber: "25084000000122741190",
                step2: "أكد الدفع الخاص بك",
                afterTransfer: "بعد إتمام التحويل، يرجى التواصل معنا:",
                whatsapp: "واتساب",
                facebook: "فيسبوك",
                callUs: "اتصل بنا",
                phoneLabel: "الهاتف:",
                phoneNumber: "+216 28 348 622",
                subscriptionInfo:
                    "سيتم تفعيل اشتراكك خلال 24 ساعة بعد تأكيد الدفع.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    return (
        <section className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-700">
                    {t.completePayment}
                </h1>
                <p className="text-base sm:text-lg text-neutral-600 mt-2">
                    {t.followSteps}
                </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl overflow-hidden">
                {/* Step 1: Bank Transfer */}
                <div className="p-4 sm:p-6 border-b border-neutral-200">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <div className="bg-blue-100 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center rtl:ml-2 mr-2 sm:mr-3 flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm sm:text-base">
                                1
                            </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-700">
                            {t.step1}
                        </h2>
                    </div>

                    <div className="sm:ml-11">
                        <p className="text-neutral-700 mb-3 sm:mb-4 font-semibold text-sm sm:text-base">
                            {t.pleaseTransfer(price)}
                        </p>

                        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-3 sm:mb-4">
                                <img
                                    className="h-8 sm:h-12 mr-2 sm:mr-3 rounded"
                                    alt="Banque Zitouna Logo"
                                    src="/icons/banque-zitouna.png"
                                />
                                <span className="text-lg sm:text-xl font-semibold text-neutral-700">
                                    {t.bankName}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-neutral-500">
                                        {t.accountNameLabel}
                                    </p>
                                    <p className="font-bold text-neutral-700 text-sm sm:text-base">
                                        {t.accountName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-neutral-500">
                                        {t.ribNumberLabel}
                                    </p>
                                    <p className="font-bold text-neutral-700 font-mono text-sm sm:text-base break-all">
                                        {t.ribNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Contact Confirmation */}
                <div className="p-4 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <div className="bg-blue-100 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center rtl:ml-2 mr-2 sm:mr-3 flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm sm:text-base">
                                2
                            </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-700">
                            {t.step2}
                        </h2>
                    </div>

                    <div className="sm:ml-11">
                        <p className="text-neutral-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                            {t.afterTransfer}
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
                                    <WhatsAppIcon className="!w-8 !h-8" />
                                    {t.whatsapp}
                                </Button>
                            </Link>

                            <Link
                                className="w-full"
                                href="https://www.messenger.com/t/100016410070680"
                            >
                                <Button
                                    className="w-full h-14 text-base"
                                    variant="secondary"
                                >
                                    <FacebookIcon className="!w-9 border-2 rounded-full p-1 !h-9" />
                                    {t.facebook}
                                </Button>
                            </Link>

                            <Link className="w-full" href="tel:+21628348622">
                                <Button
                                    className="w-full h-14 text-base"
                                    variant="secondary"
                                >
                                    <PhoneIcon className="!w-5 stroke-neutral-500 fill-neutral-500 !h-5 mr-0" />
                                    {t.callUs}
                                </Button>
                            </Link>
                        </div>

                        <p className="text-center pt-2 sm:pt-3 font-medium text-neutral-600 text-sm sm:text-base">
                            {t.phoneLabel}{" "}
                            <span dir="ltr" className="font-semibold">
                                {t.phoneNumber}
                            </span>
                        </p>
                    </div>

                    <div className="text-center mt-4 sm:mt-6 text-neutral-700 font-semibold text-xs sm:text-sm">
                        <p>{t.subscriptionInfo}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
