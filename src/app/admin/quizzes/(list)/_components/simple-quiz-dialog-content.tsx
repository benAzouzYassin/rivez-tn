"use client"

import CategorySelect from "@/components/shared/category-select"
import ImageUpload from "@/components/shared/image-upload"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Upload } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
    onBackClick: () => void
}
export default function SimpleQuizDialogContent(props: Props) {
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
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
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
        <>
            <div className="flex items-center">
                <Button
                    onClick={props.onBackClick}
                    className="rounded-full w-10 h-10 p-0 absolute top-4"
                    variant={"outline"}
                >
                    <ChevronLeft className="stroke-3 text-neutral-500 !w-5 !h-5" />
                </Button>
                <DialogTitle className="text-2xl font-bold text-center grow text-[#3C3C3C]">
                    Create New Quiz
                </DialogTitle>
            </div>
            <DialogDescription></DialogDescription>
            <section className="flex flex-col  gap-4">
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
                            placeholder="Category"
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

                <ImageUpload
                    renderEmptyContent={() => {
                        return (
                            <>
                                <Upload className="w-10 h-10 mb-2 mx-auto text-neutral-400" />
                                <p className="text-base font-semibold text-neutral-500">
                                    Drag or click to upload quiz image.
                                </p>

                                <p className="text-xs text-neutral-400 mt-0">
                                    Images (PNG, JPG, GIF)
                                </p>
                                <p className="text-xs text-neutral-400">
                                    up to 10MB
                                </p>
                            </>
                        )
                    }}
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
        </>
    )
}
