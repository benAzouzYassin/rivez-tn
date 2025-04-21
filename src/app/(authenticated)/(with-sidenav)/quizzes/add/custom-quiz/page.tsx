"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { useSidenav } from "@/providers/sidenav-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Edit } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { DifficultySelect } from "../_components/difficulty-select"
import ImageUpload from "../_components/image-upload"

export default function Page() {
    const sideNav = useSidenav()

    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const user = useCurrentUser()
    const formSchema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, "Name is required")
                    .max(100, "Input exceeds maximum length"),
                category: z.string().nullable(),
                difficulty: z.string().optional().nullable(),
            }),
        []
    )

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
                author_id: user.data?.id,
                difficulty: (data.difficulty as any) || "NORMAL",
            })
            const quizId = result[0].id
            if (sideNav.isSidenavOpen) {
                sideNav.toggleSidenav()
            }
            router.push(`/quizzes/add/${quizId}`)
            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsLoading(false)
        }
    }
    return (
        <main className="flex relative items-center pb-10  flex-col">
            <h1 className="mt-10 text-neutral-600 text-3xl font-extrabold">
                Create custom quiz
            </h1>
            <div className="flex items-center  h-0">
                <Button
                    onClick={() => router.back()}
                    className=" text-sm gap-1   absolute top-4 left-5"
                    variant="secondary"
                >
                    <ChevronLeft className="stroke-3 -ml-1 text-neutral-500 !w-4 !h-4" />
                    Go back
                </Button>
            </div>
            <section className="flex flex-col w-full mt-8 gap-1 max-w-[900px]">
                <Input
                    {...register("name")}
                    placeholder="Quiz Name"
                    className="w-full"
                    errorMessage={errors.name?.message}
                />

                <Controller
                    control={control}
                    name="difficulty"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <DifficultySelect
                            selected={value as any}
                            setSelected={onChange}
                        />
                    )}
                />

                {/* <ImageUpload
                    className=""
                    imageUrl={imageUrl}
                    onImageUrlChange={setImageUrl}
                /> */}
                <Button
                    isLoading={isSubmitting || isLoading}
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="font-extrabold uppercase py-7 mt-5 text-sm"
                >
                    Create Quiz <Edit />
                </Button>
            </section>
        </main>
    )
}
