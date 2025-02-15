"use client"

import CategorySelect from "@/components/shared/category-select"
import ImageUpload from "@/components/shared/image-upload"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

export default function AddQuizDialog(props: Props) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
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
                description: z.string().optional(),
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
            description: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: data.description,
                author_id: user.data?.id,
            })
            const quizId = result[0].id
            router.push(`/admin/quizzes/add/${quizId}`)
            reset()
            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[45vw] max-h-[97vh] overflow-y-auto py-10">
                <DialogTitle className="text-2xl font-bold text-center text-[#3C3C3C]">
                    Create New Quiz
                </DialogTitle>
                <DialogDescription></DialogDescription>
                <section className="flex flex-col gap-4">
                    <Input
                        {...register("name")}
                        placeholder="Quiz Name"
                        className="w-full"
                        errorMessage={errors.name?.message}
                    />
                    <Controller
                        control={control}
                        name="category"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <CategorySelect
                                enableAddButton
                                inputClassName="w-full "
                                selectedId={value}
                                errorMessage={errors.category?.message}
                                onSelect={({ id }) => {
                                    onChange(id)
                                    onBlur()
                                }}
                                onUnselect={() => {
                                    onChange(null)
                                    onBlur()
                                }}
                            />
                        )}
                    />

                    <Textarea
                        {...register("description")}
                        placeholder="Description (optional)"
                        className="min-h-[100px]"
                    />
                    <ImageUpload
                        displayCancelBtn
                        isLoading={isUploadingImage}
                        onLoadingChange={setIsUploadingImage}
                        className="-mt-3"
                        imageUrl={imageUrl}
                        onImageUrlChange={setImageUrl}
                    />
                    <Button
                        isLoading={isSubmitting || isLoading}
                        disabled={isUploadingImage}
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="font-extrabold uppercase text-sm"
                        variant="blue"
                    >
                        Create Quiz
                    </Button>
                </section>
            </DialogContent>
        </Dialog>
    )
}

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}
