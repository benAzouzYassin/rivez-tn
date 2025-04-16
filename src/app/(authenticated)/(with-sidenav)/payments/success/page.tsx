"use client"
import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, PhoneIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const credits = searchParams.get("credits")

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-50">
            <Card className="w-full max-w-[550px] -mt-20  font-medium">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <h1 className="text-2xl font-bold text-center">
                        Payment Successful!
                    </h1>
                </CardHeader>
                <CardContent className="text-center space-y-4 pt-4">
                    <p className="text-neutral-600 ">
                        Thank you for your purchase. Your payment has been
                        processed successfully.
                    </p>

                    {credits && (
                        <div className="bg-green-100/20 border-green-300 border p-4 rounded-lg">
                            <p className="text-stone-900  font-bold ">
                                <span className="font-extrabold">
                                    {credits}
                                </span>{" "}
                                credits have been added to your account.
                            </p>
                        </div>
                    )}
                </CardContent>
                <div className="flex flex-col space-y-2 px-2">
                    <Button asChild className="w-full">
                        <Link href="/home">Go to Home page</Link>
                    </Button>

                    <div className=" pb-4">
                        <p className="text-neutral-700 text-center mt-4 font-semibold mb-4">
                            If you think there is something wrong contact us.
                        </p>

                        <div className="grid grid-cols-1 w-fll md:grid-cols-3 px-2 gap-3 mb-4">
                            <Link href="https://api.whatsapp.com/send/?phone=%2B21628348622&text&type=phone_number&app_absent=0">
                                <Button
                                    className="w-full h-14 text-base"
                                    variant="secondary"
                                >
                                    <WhatsAppIcon className="!w-8 !h-8 " />
                                    WhatsApp
                                </Button>
                            </Link>

                            <Link href="https://www.messenger.com/t/100016410070680">
                                <Button
                                    className="w-full  h-14 text-base"
                                    variant="secondary"
                                >
                                    <FacebookIcon className="!w-9 border-2 rounded-full p-1  !h-9 " />
                                    Facebook
                                </Button>
                            </Link>

                            <Link href="tel:+21628348622">
                                <Button
                                    className="w-full h-14 text-base"
                                    variant="secondary"
                                >
                                    <PhoneIcon className="!w-5 stroke-neutral-500 fill-neutral-500 !h-5  mr-0" />
                                    Call Us
                                </Button>
                            </Link>
                        </div>

                        <p className="text-center pt-3 font-medium text-neutral-600">
                            Phone:{" "}
                            <span className="font-semibold">
                                +216 28 348 622
                            </span>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
