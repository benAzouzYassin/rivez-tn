"use client"

import LoginGetStartedTopBar from "@/components/shared/login-get-started-topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toastError, toastSuccess } from "@/lib/toasts"
import { sendResetPasswordMail } from "@/use-cases/users/send-reset-password-mail"
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
        const { error, success } = await sendResetPasswordMail(data)

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
            <main className="flex min-h-[100vh] relative flex-col items-center justify-center">
                <LoginGetStartedTopBar className="w-full absolute top-0 left-0" />
                <section className="text-center">
                    <h1 className="text-2xl font-bold text-[#3C3C3C] mb-4">
                        Check your email
                    </h1>
                    <p className="text-base text-[#3C3C3C] font-semibold max-w-[400px]">
                        We&apos;ve sent password reset instructions to your
                        email address. Please check your inbox.
                    </p>
                    <Button
                        onClick={() => router.push("/auth/login")}
                        className="mt-4 font-semibold uppercase text-sm"
                        variant={"blue"}
                    >
                        Back to Login
                    </Button>
                </section>
            </main>
        )
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center">
            <LoginGetStartedTopBar className="w-full absolute top-0 left-0" />
            <section>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <h1 className="text-2xl font-bold text-center text-[#3C3C3C]">
                        Forgot password
                    </h1>
                    <p className="text-base text-[#3C3C3C] font-semibold max-w-[400px] text-center">
                        We will send you instructions on how to reset your
                        password by email.
                    </p>
                    <Input
                        {...register("email")}
                        type="email"
                        className="min-w-96"
                        placeholder="Email"
                        errorMessage={errors.email?.message}
                    />
                    <Button
                        type="submit"
                        className="font-semibold -mt-3 uppercase text-sm"
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
