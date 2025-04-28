"use client"

import Google from "@/components/icons/google"
import XIcon from "@/components/icons/xIcon"
import { LanguageSelector } from "@/components/shared/language-selector"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import AnimatedLoader from "@/components/ui/animated-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import {
    registerUserWithGoogle,
    registerUserWithPassword,
} from "@/data-access/users/register"
import { useCurrentUser } from "@/hooks/use-current-user"
import { dismissToasts, toastError } from "@/lib/toasts"
import { getLanguage } from "@/utils/get-language"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
    const queryClient = useQueryClient()
    const { isLoading: isFetchingCurrentUser, refetch: refetchUser } =
        useCurrentUser()
    const [isPasswordAuth, setIsPasswordAuth] = useState(false)
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                createTitle: "create your profile",
                name: "Name",
                email: "Email",
                phone: "Phone (optional)",
                password: "Password",
                create: "CREATE ACCOUNT",
                or: "OR",
                google: "GOOGLE",
                login: "LOGIN",
                agreement: "By signing in to, you agree to our",
                terms: "Terms",
                privacy: "Privacy Policy",
                and: "and",
                nameMin: "Name must be at least 2 characters",
                nameMax: "Name must be less than 50 characters",
                passwordMin: "Password must be at least 6 characters",
                emailValid: "Please enter a valid email address",
                error: "Error while creating your account.",
            },
            fr: {
                createTitle: "créez votre profil",
                name: "Nom",
                email: "E-mail",
                phone: "Téléphone (optionnel)",
                password: "Mot de passe",
                create: "CRÉER UN COMPTE",
                or: "OU",
                google: "GOOGLE",
                login: "SE CONNECTER",
                agreement: "En vous connectant à, vous acceptez nos",
                terms: "Conditions",
                privacy: "Politique de confidentialité",
                and: "et",
                nameMin: "Le nom doit comporter au moins 2 caractères",
                nameMax: "Le nom doit comporter moins de 50 caractères",
                passwordMin:
                    "Le mot de passe doit comporter au moins 6 caractères",
                emailValid: "Veuillez entrer une adresse e-mail valide",
                error: "Erreur lors de la création de votre compte.",
            },
            ar: {
                createTitle: "أنشئ حسابك",
                name: "الاسم",
                email: "البريد الإلكتروني",
                phone: "الهاتف (اختياري)",
                password: "كلمة المرور",
                create: "إنشاء حساب",
                or: "أو",
                google: "جوجل",
                login: "تسجيل الدخول",
                agreement: "من خلال تسجيلك فإنك توافق على",
                terms: "الشروط",
                privacy: "سياسة الخصوصية",
                and: "و",
                nameMin: "يجب أن يتكون الاسم من  2 أحرف على الأقل",
                nameMax: "يجب أن يكون الاسم أقل من 50 حرفًا",
                passwordMin: "يجب أن تتكون كلمة المرور من  6 أحرف على الأقل",
                emailValid: "يرجى إدخال بريد إلكتروني صالح",
                error: "حدث خطأ أثناء إنشاء حسابك.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const formSchema = useMemo(
        () =>
            z.object({
                username: z.string().min(2, t.nameMin).max(50, t.nameMax),
                password: z.string().min(6, t.passwordMin),
                email: z.string().email(t.emailValid),
                phone: z.string().nullable().optional(),
            }),
        [t]
    )

    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            phone: null,
        },
    })

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        setIsPasswordAuth(true)

        const { success } = await registerUserWithPassword({
            email: formData.email,
            password: formData.password,
            username: formData.username,
            phone: formData.phone || undefined,
        })
        if (success) {
            refetchUser().then(() => {
                const afterAuthRoute =
                    (localStorage.getItem("afterAuthRedirect") || "/home") +
                    "?is_new_user=true"
                router.replace(afterAuthRoute)
            })
        } else {
            toastError(t.error)
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
                    className="flex px-2 flex-col md:pt-0 pt-32"
                >
                    <h1 className="text-2xl first-letter:capitalize mb-5 font-bold text-center text-[#3C3C3C] dark:text-neutral-200">
                        {t.createTitle}
                    </h1>
                    <Input
                        {...register("username")}
                        type="text"
                        className="w-full md:min-w-[450px] "
                        placeholder={t.name}
                        errorMessage={errors.username?.message}
                    />
                    <Input
                        {...register("email")}
                        type="text"
                        className="w-full md:min-w-[450px] "
                        placeholder={t.email}
                        errorMessage={errors.email?.message}
                    />
                    <PhoneInput
                        onPhoneChange={(value) => setValue("phone", value)}
                        defaultCountry="TN"
                        type="tel"
                        className="w-full md:min-w-[380px] "
                        placeholder={t.phone}
                        containerClassName="mb-4"
                    />
                    <Input
                        {...register("password")}
                        type="password"
                        className="w-full md:min-w-[450px] "
                        placeholder={t.password}
                        errorMessage={errors.password?.message}
                    />
                    <Button
                        isLoading={isPasswordAuth}
                        type="submit"
                        className="font-bold uppercase text-sm mt-4 dark:hover:bg-blue-600"
                        variant={"blue"}
                    >
                        {t.create}
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
                            const afterAuthUrl = new URL(
                                window.location.origin +
                                    (localStorage.getItem(
                                        "afterAuthRedirect"
                                    ) || "/home")
                            )
                            afterAuthUrl.searchParams.append(
                                "is_new_user",
                                "true"
                            )
                            await registerUserWithGoogle({
                                redirectTo: afterAuthUrl.href,
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
                    <p className="text-[#AFAFAF] dark:text-neutral-400 text-sm max-w-[350px] text-center font-medium">
                        {t.agreement}{" "}
                        <Link
                            className="font-bold hover:underline underline-offset-2 dark:text-neutral-300"
                            href=""
                        >
                            {t.terms}
                        </Link>{" "}
                        {t.and}{" "}
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
