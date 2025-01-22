"use client"

import BackButton from "@/components/shared/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { dismissToasts, toastError, toastSuccess } from "@/lib/toasts"
import { updatePassword } from "@/use-cases/users/update-password"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
    const router = useRouter()
    const [isResetting, setIsResetting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const formSchema = useMemo(
        () =>
            z
                .object({
                    newPassword: z
                        .string()
                        .min(1, "Password is required")
                        .min(6, "Password must be at least 6 characters"),
                    confirmPassword: z
                        .string()
                        .min(1, "Password confirmation is required"),
                })
                .refine((data) => data.newPassword === data.confirmPassword, {
                    message: "Passwords don't match",
                    path: ["confirmPassword"],
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
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        setIsResetting(true)

        const { success, error } = await updatePassword(formData)

        if (success) {
            toastSuccess("Password reset successful!")
            router.replace("/dashboard")
        } else {
            console.error("Password reset error:", error)
            toastError(
                error instanceof Error
                    ? error.message
                    : "Failed to reset password. Please try again."
            )
        }

        dismissToasts("loading")
        setIsResetting(false)
    }

    return (
        <main className="flex min-h-[100vh] relative flex-col items-center justify-center">
            <section>
                <BackButton className="absolute top-8 left-16" />

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
                        Reset Your Password
                    </h1>

                    <div className="relative">
                        <Input
                            {...register("newPassword")}
                            type={showPassword ? "text" : "password"}
                            className="min-w-96"
                            placeholder="New password"
                            errorMessage={errors.newPassword?.message}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-500"
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
                            className="min-w-96"
                            placeholder="Confirm new password"
                            errorMessage={errors.confirmPassword?.message}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-500"
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
                        className="font-semibold uppercase text-sm"
                        variant={"blue"}
                        isLoading={isSubmitting || isResetting}
                    >
                        RESET PASSWORD
                    </Button>
                </form>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-[#AFAFAF] first-letter:capitalize text-sm max-w-[350px] text-center font-medium">
                        Remember your password?{" "}
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="font-semibold text-[#1CB0F6] hover:underline underline-offset-2"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </section>
        </main>
    )
}
