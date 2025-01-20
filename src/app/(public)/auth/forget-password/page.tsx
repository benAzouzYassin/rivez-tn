"use client"
import { z } from "zod"
import LoginGetStartedTopBar from "@/components/shared/login-get-started-topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"

export default function Page() {
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
        try {
            // Handle password reset logic here
            console.log("Reset password request for:", data.email)
            // You might want to:
            // 1. Call your API endpoint
            // 2. Show success message
            // 3. Redirect to login page or confirmation page
        } catch (error) {
            console.error("Password reset request error:", error)
        }
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
                        className="font-semibold uppercase text-sm"
                        variant={"blue"}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                    </Button>
                </form>
            </section>
        </main>
    )
}
