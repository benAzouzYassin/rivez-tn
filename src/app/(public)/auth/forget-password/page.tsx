"use client"

import BackButton from "@/components/shared/back-button"
import { LanguageSelector } from "@/components/shared/language-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendResetPasswordMail } from "@/data-access/users/send-reset-password-mail"
import { toastError, toastSuccess } from "@/lib/toasts"
import { getLanguage } from "@/utils/get-language"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
    const router = useRouter()
    const [isSubmitted, setIsSubmitted] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                forgotPassword: "Forgot password",
                instructions:
                    "We will send you instructions on how to reset your password by email.",
                placeholder: "Email",
                submitting: "SUBMITTING...",
                submit: "SUBMIT",
                checkEmail: "Check your email",
                checkMessage:
                    "We've sent password reset instructions to your email address. Please check your inbox.",
                backToLogin: "Back to Login",
                emailRequired: "Email is required",
                emailValid: "Please enter a valid email address",
                resetSuccess:
                    "Password reset instructions have been sent to your email address",
                resetError:
                    "Failed to send reset instructions. Please try again.",
                login: "LOGIN",
            },
            fr: {
                forgotPassword: "Mot de passe oublié",
                instructions:
                    "Nous vous enverrons les instructions de réinitialisation de mot de passe par e-mail.",
                placeholder: "E-mail",
                submitting: "ENVOI...",
                submit: "ENVOYER",
                checkEmail: "Vérifiez votre e-mail",
                checkMessage:
                    "Nous avons envoyé les instructions de réinitialisation de mot de passe à votre adresse e-mail. Veuillez vérifier votre boîte de réception.",
                backToLogin: "Retour à la connexion",
                emailRequired: "L'e-mail est requis",
                emailValid: "Veuillez entrer une adresse e-mail valide",
                resetSuccess:
                    "Les instructions de réinitialisation du mot de passe ont été envoyées à votre e-mail",
                resetError:
                    "Échec de l'envoi des instructions. Veuillez réessayer.",
                login: "SE CONNECTER",
            },
            ar: {
                forgotPassword: "نسيت كلمة المرور",
                instructions:
                    "سنرسل إليك تعليمات إعادة تعيين كلمة المرور عبر البريد الإلكتروني.",
                placeholder: "البريد الإلكتروني",
                submitting: "جارٍ الإرسال...",
                submit: "إرسال",
                checkEmail: "تحقق من بريدك الإلكتروني",
                checkMessage:
                    "لقد أرسلنا تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.",
                backToLogin: "العودة لتسجيل الدخول",
                emailRequired: "البريد الإلكتروني مطلوب",
                emailValid: "يرجى إدخال بريد إلكتروني صالح",
                resetSuccess:
                    "تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
                resetError: "فشل إرسال التعليمات. حاول مرة أخرى.",
                login: "تسجيل الدخول",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const formSchema = useMemo(
        () =>
            z.object({
                email: z.string().min(1, t.emailRequired).email(t.emailValid),
            }),
        [t]
    )

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { error, success } = await sendResetPasswordMail({
            email: data.email,
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (success) {
            setIsSubmitted(true)
            toastSuccess(t.resetSuccess)
        } else {
            console.error("Password reset request error:", error)
            toastError(error instanceof Error ? error.message : t.resetError)
        }
    }

    if (isSubmitted) {
        return (
            <main className="flex min-h-[100vh] relative flex-col items-center justify-center p-4">
                <section className="text-center max-w-md">
                    <h1 className="text-xl md:text-2xl font-bold text-[#3C3C3C] mb-4">
                        {t.checkEmail}
                    </h1>
                    <p className="text-sm md:text-base text-[#3C3C3C] font-bold max-w-[400px] mx-auto">
                        {t.checkMessage}
                    </p>
                    <Button
                        onClick={() => router.push("/auth/login")}
                        className="mt-4 font-bold uppercase text-sm"
                        variant={"blue"}
                    >
                        {t.backToLogin}
                    </Button>
                </section>
            </main>
        )
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center p-4">
            <section className="w-full max-w-md">
                <div className="block">
                    <BackButton className="absolute top-8 left-4 md:left-16" />
                    <div className="flex absolute gap-2  items-center justify-center top-8 right-3 md:right-16">
                        <LanguageSelector defaultLang="en" />
                        <Button
                            onClick={() => router.push("/auth/login")}
                            className="w-fit! px-7! uppercase font-bold text-[#1CB0F6] "
                            variant={"secondary"}
                        >
                            {t.login}
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3 w-full"
                >
                    <h1 className="text-xl md:text-2xl font-bold text-center text-[#3C3C3C]">
                        {t.forgotPassword}
                    </h1>
                    <p className="text-sm md:text-base text-[#3C3C3C] font-bold max-w-[400px] text-center mx-auto">
                        {t.instructions}
                    </p>
                    <Input
                        {...register("email")}
                        type="email"
                        className="w-full"
                        placeholder={t.placeholder}
                        errorMessage={errors.email?.message}
                    />
                    <Button
                        type="submit"
                        className="font-bold -mt-3 uppercase text-sm w-full"
                        variant={"blue"}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? t.submitting : t.submit}
                    </Button>
                </form>
            </section>
        </main>
    )
}
