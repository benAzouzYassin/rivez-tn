"use client"

import BackButton from "@/components/shared/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendResetPasswordMail } from "@/data-access/users/send-reset-password-mail"
import { toastError, toastSuccess } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
    const router = useRouter()
    const [isSubmitted, setIsSubmitted] = useState(false)

    const formSchema = useMemo(
        () =>
            z.object({
                email: z
                    .string()
                    .min(1, "Email is required")
                    .email("Please enter a valid email address"),
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
            toastSuccess(
                "Password reset instructions have been sent to your email address"
            )
        } else {
            console.error("Password reset request error:", error)
            toastError(
                error instanceof Error
                    ? error.message
                    : "Failed to send reset instructions. Please try again."
            )
        }
    }

    if (isSubmitted) {
        return (
            <main className="flex min-h-[100vh] relative flex-col items-center justify-center p-4">
                <section className="text-center max-w-md">
                    <h1 className="text-xl md:text-2xl font-bold text-[#3C3C3C] mb-4">
                        Check your email
                    </h1>
                    <p className="text-sm md:text-base text-[#3C3C3C] font-bold max-w-[400px] mx-auto">
                        We&apos;ve sent password reset instructions to your
                        email address. Please check your inbox.
                    </p>
                    <Button
                        onClick={() => router.push("/auth/login")}
                        className="mt-4 font-bold uppercase text-sm"
                        variant={"blue"}
                    >
                        Back to Login
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
                    <Button
                        onClick={() => router.push("/auth/login")}
                        className="absolute w-fit uppercase font-bold text-[#1CB0F6] top-8 right-4 md:right-16"
                        variant={"secondary"}
                    >
                        LOGIN
                    </Button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3 w-full"
                >
                    <h1 className="text-xl md:text-2xl font-bold text-center text-[#3C3C3C]">
                        Forgot password
                    </h1>
                    <p className="text-sm md:text-base text-[#3C3C3C] font-bold max-w-[400px] text-center mx-auto">
                        We will send you instructions on how to reset your
                        password by email.
                    </p>
                    <Input
                        {...register("email")}
                        type="email"
                        className="w-full"
                        placeholder="Email"
                        errorMessage={errors.email?.message}
                    />
                    <Button
                        type="submit"
                        className="font-bold -mt-3 uppercase text-sm w-full"
                        variant={"blue"}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                    </Button>
                </form>
            </section>
        </main>
    )
}
