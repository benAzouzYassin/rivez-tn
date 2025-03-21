"use client"

import ImageUpload from "@/components/shared/image-upload"
import PublishingStatusSelect from "@/components/shared/publishing-status-select"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import SearchSelectMultiple from "@/components/ui/search-select-multiple"
import { Textarea } from "@/components/ui/textarea"
import { createCategoryWithQuizzes } from "@/data-access/categories/create"
import { readQuizzesWithEmptyCategory } from "@/data-access/quizzes/read"
import { PublishingStatusType } from "@/data-access/types"
import { toastError, toastSuccess } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ComponentProps, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export default function AddCategoryDialog(props: Props) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient()
    const formSchema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, "Name is required")
                    .max(100, "Input exceeds maximum length"),
                quizzes: z.array(z.string()).nullable(),
                description: z.string().optional(),
                publishingStatus: z.string(),
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
            quizzes: [],
            description: "",
            publishingStatus: "DRAFT" as PublishingStatusType,
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const id = await createCategoryWithQuizzes({
                category: {
                    description: data.description,
                    name: data.name,
                    image: imageUrl,
                    publishing_status: data.publishingStatus as any,
                },
                quizzes:
                    data.quizzes
                        ?.map((id) => {
                            if (!isNaN(Number(id))) {
                                return Number(id)
                            }
                            return null
                        })
                        .filter((item) => item !== null) || [],
            })
            if (id) {
                toastSuccess("Category created successfully")
                queryClient.refetchQueries({
                    queryKey: ["quizzes_categories"],
                })
                queryClient.invalidateQueries({
                    queryKey: ["quizzes"],
                })
                props.onOpenChange(false)
                reset()
                setImageUrl(null)
            }
        } catch (error) {
            toastError("Something went wrong.")
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[45vw] max-h-[97vh] overflow-y-auto py-10">
                <DialogTitle className="text-2xl font-bold text-center text-[#3C3C3C]">
                    Add New category
                </DialogTitle>
                <DialogDescription></DialogDescription>
                <form className="flex flex-col gap-4">
                    <Input
                        {...register("name")}
                        placeholder="Category Name"
                        className="w-full"
                        errorMessage={errors.name?.message}
                    />
                    <Controller
                        control={control}
                        name="quizzes"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <QuizzesSelect
                                placeholder="Quizzes"
                                inputClassName="w-full "
                                selectedIds={
                                    value?.map((id) => String(id)) || []
                                }
                                errorMessage={errors.quizzes?.message}
                                onSelect={(ids) => {
                                    onChange(ids)
                                    onBlur()
                                }}
                                onUnselect={(unselectedId) => {
                                    onChange(
                                        value?.filter(
                                            (id) => id !== unselectedId
                                        )
                                    )
                                    onBlur()
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="publishingStatus"
                        render={({ field: { onChange, value } }) => (
                            <PublishingStatusSelect
                                contentClassName="h-[100px]"
                                inputClassName="w-full"
                                selectedId={value}
                                onSelect={(data) => {
                                    onChange(data.id)
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
                        Create category
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
type QuizzesSelectProps = Omit<
    ComponentProps<typeof SearchSelectMultiple>,
    "items"
>

function QuizzesSelect({
    isLoading: isLoadingProp,
    ...props
}: QuizzesSelectProps) {
    const { data: response, isLoading } = useQuery({
        queryKey: ["quizzes"],
        queryFn: readQuizzesWithEmptyCategory,
    })

    return (
        <SearchSelectMultiple
            {...props}
            isLoading={isLoading || isLoadingProp}
            items={
                response?.data?.map((quiz) => {
                    return {
                        id: quiz.id.toString(),
                        label: quiz.name || "",
                        data: quiz,
                    }
                }) || []
            }
        />
    )
}
