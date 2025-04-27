"use client"

import BackButton from "@/components/shared/back-button"
import { LanguageSelector } from "@/components/shared/language-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateUserPassword } from "@/data-access/users/update"
import { dismissToasts, toastError, toastSuccess } from "@/lib/toasts"
import { getLanguage } from "@/utils/get-language"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ThemeToggle } from "@/components/shared/theme-toggle" // Add this import

export default function Page() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isResetting, setIsResetting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                title: "Reset Your Password",
                newPassword: "New password",
                confirmPassword: "Confirm new password",
                login: "LOGIN",
                submit: "RESET PASSWORD",
                backToLogin: "Login here",
                remember: "Remember your password?",
                passwordRequired: "Password is required",
                confirmPasswordRequired: "Password confirmation is required",
                minPassword: "Password must be at least 6 characters",
                mismatch: "Passwords don't match",
                resetSuccess: "Password reset successful!",
                resetError: "Failed to reset password. Please try again.",
            },
            fr: {
                title: "Réinitialiser votre mot de passe",
                newPassword: "Nouveau mot de passe",
                confirmPassword: "Confirmer le mot de passe",
                login: "SE CONNECTER",
                submit: "RÉINITIALISER LE MOT DE PASSE",
                backToLogin: "Connectez-vous ici",
                remember: "Vous vous souvenez de votre mot de passe ?",
                passwordRequired: "Le mot de passe est requis",
                confirmPasswordRequired:
                    "La confirmation du mot de passe est requise",
                minPassword:
                    "Le mot de passe doit comporter au moins 6 caractères",
                mismatch: "Les mots de passe ne correspondent pas",
                resetSuccess: "Réinitialisation du mot de passe réussie !",
                resetError:
                    "Échec de la réinitialisation du mot de passe. Veuillez réessayer.",
            },
            ar: {
                title: "إعادة تعيين كلمة المرور",
                newPassword: "كلمة المرور الجديدة",
                confirmPassword: "تأكيد كلمة المرور الجديدة",
                login: "تسجيل الدخول",
                submit: "إعادة تعيين كلمة المرور",
                backToLogin: "سجّل الدخول هنا",
                remember: "هل تتذكر كلمة المرور؟",
                passwordRequired: "كلمة المرور مطلوبة",
                confirmPasswordRequired: "تأكيد كلمة المرور مطلوب",
                minPassword: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                mismatch: "كلمتا المرور غير متطابقتين",
                resetSuccess: "تمت إعادة تعيين كلمة المرور بنجاح!",
                resetError: "فشل في إعادة تعيين كلمة المرور. حاول مرة أخرى.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const formSchema = useMemo(
        () =>
            z
                .object({
                    newPassword: z
                        .string()
                        .min(1, t.passwordRequired)
                        .min(6, t.minPassword),
                    confirmPassword: z
                        .string()
                        .min(1, t.confirmPasswordRequired),
                })
                .refine((data) => data.newPassword === data.confirmPassword, {
                    message: t.mismatch,
                    path: ["confirmPassword"],
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
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        setIsResetting(true)

        const { success, error } = await updateUserPassword({
            password: formData.newPassword,
        })

        if (success) {
            toastSuccess(t.resetSuccess)
            router.replace("/home")
        } else {
            console.error("Password reset error:", error)
            toastError(error instanceof Error ? error.message : t.resetError)
        }

        dismissToasts("loading")
        setIsResetting(false)
        queryClient.invalidateQueries({ queryKey: ["current-user"] })
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center bg-white dark:bg-neutral-900">
            <section>
                <BackButton className="absolute top-8 left-2 md:left-16 dark:text-neutral-300" />
                <div className="flex absolute gap-2 items-center justify-center top-8 right-3 md:right-16">
                    <ThemeToggle /> {/* Add this for theme switching */}
                    <LanguageSelector defaultLang="en" />
                    <Button
                        onClick={() => router.push("/auth/login")}
                        className="w-fit! px-7! uppercase font-bold text-[#1CB0F6] dark:text-blue-400"
                        variant={"secondary"}
                    >
                        {t.login}
                    </Button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-[95vw] md:w-auto"
                >
                    <h1 className="text-2xl first-letter:capitalize mb-5 font-bold text-center text-[#3C3C3C] dark:text-neutral-200">
                        {t.title}
                    </h1>

                    <div className="relative w-full">
                        <Input
                            {...register("newPassword")}
                            type={showPassword ? "text" : "password"}
                            className="w-full md:min-w-96"
                            placeholder={t.newPassword}
                            errorMessage={errors.newPassword?.message}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute rtl:left-3 ltr:right-3 top-3 text-neutral-400 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff className="h-6 w-6" />
                            ) : (
                                <Eye className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full md:min-w-96"
                            placeholder={t.confirmPassword}
                            errorMessage={errors.confirmPassword?.message}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute rtl:left-3 ltr:right-3 top-3 text-neutral-400 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-6 w-6" />
                            ) : (
                                <Eye className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        className="font-bold uppercase text-sm mt-4 dark:hover:bg-blue-600"
                        variant={"blue"}
                        isLoading={isSubmitting || isResetting}
                    >
                        {t.submit}
                    </Button>
                </form>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-[#AFAFAF] dark:text-neutral-400 first-letter:capitalize text-sm max-w-[350px] text-center font-medium">
                        {t.remember}{" "}
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="font-bold text-[#1CB0F6] dark:text-blue-400 cursor-pointer hover:underline underline-offset-2"
                        >
                            {t.backToLogin}
                        </button>
                    </p>
                </div>
            </section>
        </main>
    )
}
