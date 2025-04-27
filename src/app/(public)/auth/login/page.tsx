"use client"

import Google from "@/components/icons/google"
import BackButton from "@/components/shared/back-button"
import AnimatedLoader from "@/components/ui/animated-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    loginUserWithGoogle,
    loginUserWithPassword,
} from "@/data-access/users/login"
import { useCurrentUser } from "@/hooks/use-current-user"
import { dismissToasts, toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getLanguage } from "@/utils/get-language"
import { LanguageSelector } from "@/components/shared/language-selector"
import { ThemeToggle } from "@/components/shared/theme-toggle" // <-- Add this import

export default function Page() {
    const { isLoading: isFetchingCurrentUser, refetch: refetchUser } =
        useCurrentUser()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isPasswordAuth, setIsPasswordAuth] = useState(false)
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                loginTitle: "login to your profile",
                emailOrPhone: "Email or phone",
                password: "Password",
                forgot: "FORGOT ?",
                login: "LOGIN",
                register: "REGISTER",
                or: "OR",
                google: "GOOGLE",
                terms: "Terms",
                privacy: "Privacy Policy",
                agreement: "by signing in, you agree to our",
                emailRequired: "Email or phone is required",
                emailMax: "Input exceeds maximum length",
                passwordRequired: "Password is required",
                passwordMin: "Password must be at least 6 characters",
                loginError: "Wrong email or password.",
                and: "and",
            },
            fr: {
                loginTitle: "connectez-vous à votre profil",
                emailOrPhone: "E-mail ou téléphone",
                password: "Mot de passe",
                forgot: "MOT DE PASSE OUBLIÉ ?",
                login: "SE CONNECTER",
                register: "S'INSCRIRE",
                or: "OU",
                google: "GOOGLE",
                terms: "Conditions",
                privacy: "Politique de confidentialité",
                agreement: "en vous connectant, vous acceptez nos",
                emailRequired: "L'e-mail ou le téléphone est requis",
                emailMax: "L'entrée dépasse la longueur maximale",
                passwordRequired: "Le mot de passe est requis",
                passwordMin:
                    "Le mot de passe doit comporter au moins 6 caractères",
                loginError: "E-mail ou mot de passe incorrect.",
                and: "et",
            },
            ar: {
                and: "و",
                loginTitle: "تسجيل الدخول إلى حسابك",
                emailOrPhone: "البريد الإلكتروني أو الهاتف",
                password: "كلمة المرور",
                forgot: "نسيت؟",
                login: "تسجيل الدخول",
                register: "تسجيل",
                or: "أو",
                google: "جوجل",
                terms: "الشروط",
                privacy: "سياسة الخصوصية",
                agreement: "بتسجيلك ، فإنك توافق على",
                emailRequired: "البريد الإلكتروني",
                emailMax: " يتجاوز الحد الأقصى للطول",
                passwordRequired: "كلمة المرور مطلوبة",
                passwordMin: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                loginError: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const formSchema = useMemo(
        () =>
            z.object({
                identifier: z
                    .string()
                    .min(1, t.emailRequired)
                    .max(100, t.emailMax),
                password: z
                    .string()
                    .min(1, t.passwordRequired)
                    .min(6, t.passwordMin),
            }),
        [t]
    )

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })
    const passwordInput = watch("password")
    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        setIsPasswordAuth(true)
        const { success } = await loginUserWithPassword({
            email: formData.identifier,
            password: formData.password,
        })
        if (success) {
            refetchUser().then(() => {
                router.replace(
                    localStorage.getItem("afterAuthRedirect") || "/home"
                )
            })
        } else {
            toastError(t.loginError)
        }
        dismissToasts("loading")
        setIsPasswordAuth(false)
    }

    if (isFetchingCurrentUser || isGoogleAuth || isPasswordAuth) {
        return (
            <main className="flex min-h-[100vh] relative flex-col items-center justify-center bg-white dark:bg-neutral-900">
                <AnimatedLoader />
            </main>
        )
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center bg-white dark:bg-neutral-900">
            <section>
                <BackButton className="absolute top-8 left-2 md:left-16 dark:text-neutral-300" />
                <div className="absolute top-8 right-3 gap-2 md:right-16 flex items-center justify-center">
                    <ThemeToggle /> {/* Add this for theme switching */}
                    <LanguageSelector defaultLang="en" />
                    <Button
                        onClick={() => router.push("/auth/register")}
                        className="w-fit! px-7! uppercase font-bold text-[#1CB0F6] dark:text-blue-400"
                        variant={"secondary"}
                    >
                        {t.register}
                    </Button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col px-2 max-w-[95vw] md:pt-0 pt-32"
                >
                    <h1 className="text-2xl first-letter:capitalize mb-5 font-bold text-center text-[#3C3C3C] dark:text-neutral-200">
                        {t.loginTitle}
                    </h1>
                    <Input
                        {...register("identifier")}
                        type="text"
                        className="md:min-w-96 w-full"
                        placeholder={t.emailOrPhone}
                        errorMessage={errors.identifier?.message}
                    />
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type="password"
                            className="md:min-w-96 w-full"
                            placeholder={t.password}
                            errorMessage={errors.password?.message}
                        />
                        {passwordInput.length < 1 && (
                            <div className="absolute rtl:left-3 ltr:right-3 top-[12px]">
                                <Link
                                    href="/auth/forget-password"
                                    className="font-bold hover:underline underline-offset-2 text-[#AFAFAF] dark:text-neutral-400 text-sm"
                                >
                                    {t.forgot}
                                </Link>
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="font-bold uppercase text-sm mt-4 dark:hover:bg-blue-600"
                        variant={"blue"}
                        isLoading={isSubmitting || isPasswordAuth}
                    >
                        {t.login}
                    </Button>
                </form>
                <div className="flex items-center mt-5 w-full">
                    <hr className="rounded-full w-full bg-[#E5E5E5] dark:bg-neutral-700 h-1" />
                    <p className="mx-2 font-bold text-[#AFAFAF] dark:text-neutral-400">
                        {t.or}
                    </p>
                    <hr className="rounded-full w-full bg-[#E5E5E5] dark:bg-neutral-700 h-1" />
                </div>
                <div className="px-2">
                    <Button
                        isLoading={isGoogleAuth}
                        onClick={async () => {
                            setIsGoogleAuth(true)
                            queryClient.invalidateQueries({
                                queryKey: ["current-user"],
                            })
                            await loginUserWithGoogle({
                                redirectTo:
                                    window.location.origin +
                                    (localStorage.getItem(
                                        "afterAuthRedirect"
                                    ) || "/home"),
                            })
                        }}
                        type="button"
                        className="font-bold w-full mt-3 text-[#4285F4] dark:text-blue-400 dark:bg-neutral-800 dark:hover:bg-neutral-700 uppercase text-sm"
                        variant={"secondary"}
                    >
                        <Google className="w-4! scale-105 h-4!" /> {t.google}
                    </Button>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-[#AFAFAF] dark:text-neutral-400 first-letter:capitalize text-sm max-w-[350px] text-center font-medium">
                        {t.agreement}{" "}
                        <Link
                            className="font-bold hover:underline underline-offset-2 dark:text-neutral-300"
                            href=""
                        >
                            {t.terms}
                        </Link>{" "}
                        {t["and"]}{" "}
                        <Link
                            className="font-bold hover:underline underline-offset-2 dark:text-neutral-300"
                            href=""
                        >
                            {t.privacy}
                        </Link>
                        .
                    </p>
                </div>
            </section>
        </main>
    )
}
