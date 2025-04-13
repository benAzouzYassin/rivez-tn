"use client"
import Google from "@/components/icons/google"
import XIcon from "@/components/icons/xIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import {
    registerUserWithGoogle,
    registerUserWithPassword,
} from "@/data-access/users/register"
import { dismissToasts, toastError } from "@/lib/toasts"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
    const queryClient = useQueryClient()
    const [isPasswordAuth, setIsPasswordAuth] = useState(false)
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)
    const formSchema = useMemo(
        () =>
            z.object({
                username: z
                    .string()
                    .min(2, "Name must be at least 2 characters")
                    .max(50, "Name must be less than 50 characters"),
                password: z
                    .string()
                    .min(6, "Password must be at least 6 characters"),
                email: z.string().email("Please enter a valid email address"),
                phone: z.string().nullable().optional(),
            }),
        []
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
            queryClient.refetchQueries({
                queryKey: ["current-user"],
            })
            const afterAuthRoute =
                (localStorage.getItem("afterAuthRedirect") || "/home") +
                "?is_new_user=true"
            router.replace(afterAuthRoute)
        } else {
            toastError("Error while creating your account.")
        }

        dismissToasts("loading")
        setIsPasswordAuth(false)
    }
    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center">
            <section>
                <Button
                    onClick={router.back}
                    className="absolute h-10 w-10 top-8 left-16"
                    variant={"ghost"}
                >
                    <XIcon />
                </Button>
                <Button
                    onClick={() => router.push("/auth/login")}
                    className="absolute w-fit! px-7! uppercase font-bold text-[#1CB0F6] top-8 right-16"
                    variant={"secondary"}
                >
                    LOGIN
                </Button>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                >
                    <h1 className="text-2xl first-letter:capitalize mb-5 font-bold text-center text-[#3C3C3C]">
                        create your profile
                    </h1>
                    <Input
                        {...register("username")}
                        type="text"
                        className="min-w-[450px]"
                        placeholder="Name"
                        errorMessage={errors.username?.message}
                    />
                    <Input
                        {...register("email")}
                        type="text"
                        className="min-w-[450px]"
                        placeholder="Email"
                        errorMessage={errors.email?.message}
                    />
                    <PhoneInput
                        onPhoneChange={(value) => {
                            setValue("phone", value)
                        }}
                        defaultCountry="TN"
                        type="tel"
                        className="min-w-[380px]"
                        placeholder="Phone (optional)"
                        containerClassName="mb-4    "
                    />
                    <Input
                        {...register("password")}
                        type="password"
                        className="min-w-[450px]"
                        placeholder="Password"
                        errorMessage={errors.password?.message}
                    />
                    <Button
                        isLoading={isPasswordAuth}
                        type="submit"
                        className="font-bold uppercase text-sm mt-4"
                        variant={"blue"}
                    >
                        CREATE ACCOUNT
                    </Button>
                </form>
                <div className="flex items-center mt-5 w-full">
                    <hr className="rounded-full w-full bg-[#E5E5E5] h-1" />
                    <p className="mx-2 font-bold text-[#AFAFAF]">OR</p>
                    <hr className="rounded-full w-full bg-[#E5E5E5] h-1" />
                </div>

                <Button
                    isLoading={isGoogleAuth}
                    onClick={async () => {
                        setIsGoogleAuth(true)
                        queryClient.invalidateQueries({
                            queryKey: ["current-user"],
                        })
                        const afterAuthUrl = new URL(
                            window.location.origin +
                                (localStorage.getItem("afterAuthRedirect") ||
                                    "/home")
                        )
                        afterAuthUrl.searchParams.append("is_new_user", "true")
                        await registerUserWithGoogle({
                            redirectTo: afterAuthUrl.href,
                        })
                    }}
                    type="button"
                    className="font-bold w-full mt-3 text-[#4285F4] uppercase text-sm"
                    variant={"secondary"}
                >
                    <Google className="w-4! scale-105 h-4!" /> GOOGLE
                </Button>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-[#AFAFAF] text-sm max-w-[350px] text-center font-medium">
                        By signing in to Fikr, you agree to our{" "}
                        <Link
                            className="font-bold hover:underline underline-offset-2"
                            href={""}
                        >
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                            className="font-bold hover:underline underline-offset-2"
                            href={""}
                        >
                            Privacy Policy.
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}
