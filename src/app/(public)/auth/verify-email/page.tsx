"use client"

import XIcon from "@/components/icons/xIcon"
import { LanguageSelector } from "@/components/shared/language-selector"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { getLanguage } from "@/utils/get-language"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"

export default function EmailVerificationNotice() {
    const router = useRouter()
    const [isResending, setIsResending] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                title: "Verify your email",
                description:
                    "We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.",
                notReceived: "Didn't receive the email?",
                checkSpam: "Be sure to check your spam folder too.",
                resend: "RESEND EMAIL",
                back: "BACK TO SIGN UP",
                emailSent: "Email sent successfully!",
            },
            fr: {
                title: "Vérifiez votre e-mail",
                description:
                    "Nous avons envoyé un lien de vérification à votre adresse e-mail. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.",
                notReceived: "Vous n'avez pas reçu l'e-mail ?",
                checkSpam: "N'oubliez pas de vérifier votre dossier spam.",
                resend: "RENVOYER L'E-MAIL",
                back: "RETOUR À LA CONNEXION",
                emailSent: "E-mail envoyé avec succès !",
            },
            ar: {
                title: "تحقق من بريدك الإلكتروني",
                description:
                    "لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد والنقر على الرابط لتفعيل حسابك.",
                notReceived: "لم يصلك البريد الإلكتروني؟",
                checkSpam: "تأكد من التحقق من مجلد البريد المزعج أيضًا.",
                resend: "إعادة إرسال البريد",
                back: "العودة لتسجيل الدخول",
                emailSent: "تم إرسال البريد الإلكتروني بنجاح!",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]
    const [resendSuccess, setResendSuccess] = useState(false)

    // Dummy resend handler
    const handleResend = async () => {
        setIsResending(true)
        setResendSuccess(false)
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500))
        setIsResending(false)
        setResendSuccess(true)
        // Reset success message after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000)
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center bg-white dark:bg-neutral-900">
            <Button
                onClick={() => router.replace("/landing-page")}
                className="absolute h-10 w-10 top-8 left-2 md:left-16 dark:text-neutral-300"
                variant={"ghost"}
            >
                <XIcon />
            </Button>
            <div className="flex absolute gap-2 items-center justify-center top-8 right-3 md:right-16">
                <ThemeToggle />
                <LanguageSelector defaultLang="en" />
            </div>

            <section className="flex flex-col items-center px-6 py-10 rounded-xl max-w-[95vw] md:max-w-[500px]">
                {/* Email Icon */}
                <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-[#1CB0F6] dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-center text-[#3C3C3C] dark:text-neutral-200 mb-4">
                    {t.title}
                </h1>

                <p className="text-center text-[#6B6B6B] dark:text-neutral-400 mb-8 max-w-[450px] text-lg">
                    {t.description}
                </p>

                <Link href="/auth/register" className="w-full max-w-[350px]">
                    <Button
                        className="w-full font-bold uppercase text-sm text-[#1CB0F6] dark:text-blue-400"
                        variant={"secondary"}
                        type="button"
                    >
                        {t.back}
                    </Button>
                </Link>
            </section>
        </main>
    )
}
