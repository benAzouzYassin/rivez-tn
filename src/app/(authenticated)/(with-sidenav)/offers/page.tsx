"use client"
import { Check } from "lucide-react"
import PaymentMethodDialog from "./_components/payment-method-dialog"
import { CREDITS_FOR_10_DINARS } from "@/app/api/buy-credits/generate-payment-link/constants"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

export default function Page() {
    const translation = useMemo(
        () => ({
            en: {
                Trial: "Trial",
                Free: "Free",
                "Limited access": "Limited access",
                "Current Plan": "Current Plan",
                "Basic access to interactive learning and skill development tools...":
                    "Basic access to interactive learning and skill development tools...",
                "Unlimited custom quizzes.": "Unlimited custom quizzes.",
                "Limited Ai features": "Limited Ai features",
                "Supports: Text and PDFs": "Supports: Text and PDFs",
                Premium: "Premium",
                Dinars: "Dinars",
                "Pay as you go": "Pay as you go",
                "TND for": "TND for",
                credits: "credits",
                "All features from the trial plan plus :":
                    "All features from the trial plan plus :",
                "Access to AI Quiz Generation": "Access to AI Quiz Generation",
                "Access to AI Mind map generation":
                    "Access to AI Mind map generation",
                "Access to AI content summarizer .":
                    "Access to AI content summarizer .",
                "Supports: Text, Images, PDFs and youtube videos.":
                    "Supports: Text, Images, PDFs and youtube videos.",
            },
            ar: {
                Trial: "تجريبي",
                Free: "مجاني",
                "Limited access": "وصول محدود",
                "Current Plan": "الخطة الحالية",
                "Basic access to interactive learning and skill development tools...":
                    "وصول أساسي إلى أدوات التعلم التفاعلي وتطوير المهارات...",
                "Unlimited custom quizzes.": "اختبارات مخصصة غير محدودة.",
                "Limited Ai features": "ميزات الذكاء الاصطناعي محدودة",
                "Supports: Text and PDFs": "دعم: النصوص وملفات PDF",
                Premium: "متميز",
                Dinars: "دينار",
                "Pay as you go": "ادفع حسب الاستخدام",
                "TND for": "د.ت مقابل",
                credits: "رصيد",
                "All features from the trial plan plus :":
                    "جميع ميزات الخطة التجريبية بالإضافة إلى :",
                "Access to AI Quiz Generation":
                    "الوصول إلى إنشاء اختبارات بالذكاء الاصطناعي",
                "Access to AI Mind map generation":
                    "الوصول إلى إنشاء خرائط ذهنية بالذكاء الاصطناعي",
                "Access to AI content summarizer .":
                    "الوصول إلى ملخص المحتوى بالذكاء الاصطناعي.",
                "Supports: Text, Images, PDFs and youtube videos.":
                    "دعم: النصوص والصور وملفات PDF ومقاطع فيديو يوتيوب.",
            },
            fr: {
                Trial: "Essai",
                Free: "Gratuit",
                "Limited access": "Accès limité",
                "Current Plan": "Plan actuel",
                "Basic access to interactive learning and skill development tools...":
                    "Accès de base aux outils d'apprentissage interactif et de développement des compétences...",
                "Unlimited custom quizzes.": "Quiz personnalisés illimités.",
                "Limited Ai features": "Fonctionnalités IA limitées",
                "Supports: Text and PDFs": "Prend en charge : Texte et PDF",
                Premium: "Premium",
                Dinars: "Dinars",
                "Pay as you go": "Paiement à l'utilisation",
                "TND for": "TND pour",
                credits: "crédits",
                "All features from the trial plan plus :":
                    "Toutes les fonctionnalités du plan d'essai plus :",
                "Access to AI Quiz Generation":
                    "Accès à la génération de quiz par IA",
                "Access to AI Mind map generation":
                    "Accès à la génération de cartes mentales par IA",
                "Access to AI content summarizer .":
                    "Accès au résumé de contenu par IA.",
                "Supports: Text, Images, PDFs and youtube videos.":
                    "Prend en charge : Texte, images, PDF et vidéos YouTube.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]
    const isRTL = lang === "ar"

    return (
        <section
            className="flex min-h-[90vh] flex-col"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <section className="flex pb-32 mt-16 font-sans items-center justify-center">
                <div className="md:grid flex flex-col-reverse w-[1000px] gap-8 px-2 md:h-[600px] md:grid-cols-2">
                    <div className="border bg-[#f3f3f3] px-4 md:px-5 py-8 rounded-3xl">
                        <h2 className="text-neutral-600 text-xl font-medium">
                            {t["Trial"]}
                        </h2>
                        <p className="text-4xl font-extrabold mt-3 text-neutral-600">
                            {" "}
                            {t["Free"]}
                        </p>
                        <p className="mt-3 pl-1 text-lg text-neutral-600">
                            {t["Limited access"]}
                        </p>
                        <button className="h-20 rounded-2xl bg-neutral-400 w-full text-center text-[1.7rem] font-bold text-neutral-100">
                            {t["Current Plan"]}
                        </button>
                        <p className="mt-2 pl-1 pb-3 text-lg text-gray-400">
                            {
                                t[
                                    "Basic access to interactive learning and skill development tools..."
                                ]
                            }
                        </p>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className="text-neutral-700">
                                {t["Unlimited custom quizzes."]}
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className="text-neutral-700">
                                {t["Limited Ai features"]}
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className="text-neutral-700">
                                {t["Supports: Text and PDFs"]}
                            </p>
                        </div>
                    </div>
                    <div className="border bg-[#3a7ef4] px-4 md:px-5 py-8 rounded-3xl">
                        <h2 className="text-white text-xl font-medium">
                            {t["Premium"]}
                        </h2>
                        <p className="text-4xl font-extrabold mt-3 text-white">
                            {" "}
                            10 {t["Dinars"]}
                        </p>
                        <p className="mt-3 pl-1 text-lg text-neutral-100">
                            {t["Pay as you go"]}{" "}
                        </p>
                        <PaymentMethodDialog>
                            <button className="h-20 hover:scale-105 active:scale-100 transition-all cursor-pointer rounded-2xl hover:bg-[#FFDF46] w-full text-center text-[1.7rem] font-bold text-neutral-700 bg-[#ffcb46]">
                                10 {t["TND for"]} {CREDITS_FOR_10_DINARS}{" "}
                                {t["credits"]}
                            </button>
                        </PaymentMethodDialog>
                        <p className="mt-2 pb-3 pl-1 text-lg font-bold text-gray-50">
                            {t["All features from the trial plan plus :"]}
                        </p>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className="text-neutral-50 font-medium">
                                {t["Access to AI Quiz Generation"]}
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className="text-neutral-50 font-medium">
                                {t["Access to AI Mind map generation"]}
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className="text-neutral-50 font-medium">
                                {t["Access to AI content summarizer ."]}
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className="text-neutral-50 font-medium">
                                {
                                    t[
                                        "Supports: Text, Images, PDFs and youtube videos."
                                    ]
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}
