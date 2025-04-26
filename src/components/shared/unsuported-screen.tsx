"use client"

import {
    ChevronRight,
    Info,
    Monitor,
    Smartphone,
    ChevronLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { useRouter } from "nextjs-toploader/app"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

export default function UnsupportedScreen() {
    const router = useRouter()

    const translation = useMemo(
        () => ({
            en: {
                title: "Screen Not Supported Yet",
                sorry: "We're sorry, but this feature is not yet available on smaller screens.",
                advice: "Please access this page using a desktop computer or larger device for the best experience.",
                working:
                    "We're working on making this feature available on all devices soon.",
                goBack: "Go back",
            },
            fr: {
                title: "Écran non pris en charge pour le moment",
                sorry: "Nous sommes désolés, mais cette fonctionnalité n'est pas encore disponible sur les petits écrans.",
                advice: "Veuillez accéder à cette page depuis un ordinateur de bureau ou un appareil plus grand pour une meilleure expérience.",
                working:
                    "Nous travaillons à rendre cette fonctionnalité disponible sur tous les appareils bientôt.",
                goBack: "Retourner",
            },
            ar: {
                title: "الشاشة غير مدعومة بعد",
                sorry: "نأسف، لكن هذه الميزة غير متوفرة بعد على الشاشات الصغيرة.",
                advice: "يرجى الوصول إلى هذه الصفحة باستخدام جهاز كمبيوتر مكتبي أو جهاز أكبر للحصول على أفضل تجربة.",
                working:
                    "نعمل على جعل هذه الميزة متاحة على جميع الأجهزة قريبًا.",
                goBack: "العودة",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    return (
        <div className="flex px-1 items-center justify-center min-h-screen ">
            <Card className="w-full max-w-[550px] border-none shadow-none -mt-20">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                    <Info className="h-16 w-16 text-blue-400/90" />
                    <h1 className="text-2xl text-neutral-700 font-bold text-center">
                        {t.title}
                    </h1>
                </CardHeader>
                <CardContent className="text-center font-medium space-y-4 pt-4">
                    <p className="text-neutral-600 font-semibold">{t.sorry}</p>

                    <div className="bg-blue-100/70 border border-blue-200 p-4 rounded-lg">
                        <p className="text-blue-500/70 font-bold">{t.advice}</p>
                    </div>

                    <div className="flex justify-center items-center space-x-3 py-4">
                        <Smartphone className="h-10 w-10 text-red-400" />
                        <div className="text-neutral-400 font-bold">➔</div>
                        <Monitor className="h-12 w-12 text-green-500/80" />
                    </div>

                    <p className="text-sm text-neutral-500">{t.working}</p>
                </CardContent>
                <div className="flex flex-col px-3 pb-6">
                    <Button onClick={router.back} className="text-sm w-full">
                        <ChevronLeft className="!w-5 !h-5 -mr-1" />
                        {t.goBack}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
