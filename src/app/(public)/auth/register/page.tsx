"use client"
import { supabase } from "@/backend/config/supbase-client"
import Facebook from "@/components/icons/facebook"
import Google from "@/components/icons/google"
import XIcon from "@/components/icons/xIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
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
                phone: z
                    .string()
                    .nullable()
                    .optional()
                    .refine(
                        (value) => {
                            if (
                                value !== undefined &&
                                value !== null &&
                                value !== ""
                            ) {
                                return /^\d+$/.test(value)
                            } else {
                                return true
                            }
                        },
                        {
                            message:
                                "Phone number must contain only numeric values",
                        }
                    ),
            }),
        []
    )

    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
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
        toastLoading("Creating your account")
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            phone: formData.phone || undefined,

            options: {
                data: {
                    displayName: formData.username,
                },
            },
        })

        if (error) {
            toastError("Error while creating your account.")
        } else {
            //success
            router.replace("/")
            toastSuccess("You are logged in now.")
        }

        dismissToasts("loading")
        setIsPasswordAuth(false)
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center">
            <section>
                <Button
                    className="absolute h-10 w-10 top-8 left-16"
                    variant={"ghost"}
                >
                    <XIcon />
                </Button>
                <Button
                    onClick={() => router.push("/auth/login")}
                    className="absolute !w-fit !px-7 uppercase font-bold text-[#1CB0F6] top-8 right-16"
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
                    <Input
                        {...register("phone")}
                        type="tel"
                        className="min-w-[450px]"
                        placeholder="Phone (optional)"
                        errorMessage={errors.phone?.message}
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
                        className="font-semibold uppercase text-sm mt-4"
                        variant={"blue"}
                    >
                        CREATE ACCOUNT
                    </Button>
                </form>
                <div className="flex items-center mt-5 w-full">
                    <hr className="rounded-full w-full bg-[#E5E5E5] h-1" />
                    <p className="mx-2 font-semibold text-[#AFAFAF]">OR</p>
                    <hr className="rounded-full w-full bg-[#E5E5E5] h-1" />
                </div>
                <div className="grid gap-5 mt-2 grid-cols-2">
                    <Button
                        disabled
                        type="button"
                        className="font-bold text-[#3B5998] uppercase text-sm"
                        variant={"secondary"}
                    >
                        <Facebook className="!w-4 scale-105 !h-4" /> FACEBOOK
                    </Button>
                    <Button
                        isLoading={isGoogleAuth}
                        onClick={async () => {
                            setIsGoogleAuth(true)
                            await supabase.auth.signInWithOAuth({
                                provider: "google",
                            })
                        }}
                        type="button"
                        className="font-bold text-[#4285F4] uppercase text-sm"
                        variant={"secondary"}
                    >
                        <Google className="!w-4 scale-105 !h-4" /> GOOGLE
                    </Button>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-[#AFAFAF] text-sm max-w-[350px] text-center font-medium">
                        By signing in to Fikr, you agree to our{" "}
                        <Link
                            className="font-semibold hover:underline underline-offset-2"
                            href={""}
                        >
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                            className="font-semibold hover:underline underline-offset-2"
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
