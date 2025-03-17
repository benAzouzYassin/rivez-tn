"use client"
import Google from "@/components/icons/google"
import BackButton from "@/components/shared/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    loginUserWithGoogle,
    loginUserWithPassword,
} from "@/data-access/users/login"
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
    const router = useRouter()
    const [isPasswordAuth, setIsPasswordAuth] = useState(false)
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)

    const formSchema = useMemo(
        () =>
            z.object({
                identifier: z
                    .string()
                    .min(1, "Email or phone is required")
                    .max(100, "Input exceeds maximum length"),
                password: z
                    .string()
                    .min(1, "Password is required")
                    .min(6, "Password must be at least 6 characters"),
            }),
        []
    )

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        setIsPasswordAuth(true)
        const { success } = await loginUserWithPassword({
            email: formData.identifier,
            password: formData.password,
        })
        if (success) {
            queryClient.refetchQueries({
                queryKey: ["current-user"],
            })
            window.location.replace(
                localStorage.getItem("afterAuthRedirect") ||
                    process.env.NEXT_PUBLIC_SITE_URL!
            )
        } else {
            toastError("Wrong email or password.")
        }

        dismissToasts("loading")
        setIsPasswordAuth(false)
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center">
            <section>
                <BackButton className="absolute top-8 left-16" />

                <Button
                    onClick={() => router.push("/auth/register")}
                    className="absolute w-fit! px-7! uppercase font-bold text-[#1CB0F6] top-8 right-16"
                    variant={"secondary"}
                >
                    REGISTER
                </Button>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col "
                >
                    <h1 className="text-2xl first-letter:capitalize mb-5 font-bold text-center text-[#3C3C3C]">
                        login to your profile
                    </h1>
                    <Input
                        {...register("identifier")}
                        type="text"
                        className="min-w-96"
                        placeholder="Email or phone"
                        errorMessage={errors.identifier?.message}
                    />
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type="password"
                            className="min-w-96"
                            placeholder="Password"
                            errorMessage={errors.password?.message}
                        />
                        <div className="absolute right-3 top-[12px] ">
                            <Link
                                href={"/auth/forget-password"}
                                className="font-bold hover:underline underline-offset-2 text-[#AFAFAF] text-sm"
                            >
                                FORGOT ?
                            </Link>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="font-bold uppercase text-sm"
                        variant={"blue"}
                        isLoading={isSubmitting || isPasswordAuth}
                    >
                        LOGIN
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
                        queryClient.refetchQueries({
                            queryKey: ["current-user"],
                        })
                        await loginUserWithGoogle({
                            redirectTo:
                                localStorage.getItem("afterAuthRedirect") ||
                                process.env.NEXT_PUBLIC_SITE_URL,
                        })
                    }}
                    type="button"
                    className="font-bold w-full mt-3 text-[#4285F4] uppercase text-sm"
                    variant={"secondary"}
                >
                    <Google className="w-4! scale-105 h-4!" /> GOOGLE
                </Button>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-[#AFAFAF] first-letter:capitalize text-sm max-w-[350px] text-center font-medium">
                        by signing in to Fikr, you agree to our{" "}
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
