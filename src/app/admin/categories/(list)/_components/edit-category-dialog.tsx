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
import { readCategoryWithQuizzesFields } from "@/data-access/categories/read"
import { updateCategory } from "@/data-access/categories/update"
import { readQuizzesWithDetails } from "@/data-access/quizzes/read"
import { updateManyQuizzes, updateQuiz } from "@/data-access/quizzes/update"
import { PublishingStatusType } from "@/data-access/types"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import {
    ComponentProps,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    categoryId: number
}

export default function EditCategoryDialog(props: Props) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const initialSelectedQuizzes = useRef<string[]>([])

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
        formState: { errors },
        reset,
        setValue,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            quizzes: [],
            description: "",
            publishingStatus: "DRAFT" as PublishingStatusType,
        },
    })
    const loadData = useCallback(
        (categoryId: number) => {
            setIsLoading(true)
            readCategoryWithQuizzesFields(categoryId, {
                quizFields: ["id"],
            })
                .then((data) => {
                    setValue("description", data.description || "")
                    setValue("name", data.name || "")
                    setImageUrl(data.image)
                    setValue(
                        "publishingStatus",
                        data.publishing_status || "DRAFT"
                    )
                    const quizzesIds =
                        data.quizzes
                            .map((q) => q.id)
                            .filter((id) => id !== undefined)
                            .map((id) => String(id)) || []

                    setValue("quizzes", quizzesIds)
                    initialSelectedQuizzes.current = quizzesIds
                })
                .catch((err) => {
                    toastError("Something went wrong.")
                    console.error(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        },
        [setValue]
    )

    useEffect(() => {
        if (props.categoryId && props.isOpen) {
            loadData(props.categoryId)
        }
    }, [loadData, props.categoryId, props.isOpen])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const { data: updateResponse } = await updateCategory(
                props.categoryId,
                {
                    description: data.description,
                    name: data.name,
                    image: imageUrl,
                    publishing_status:
                        (data.publishingStatus as any) || "DRAFT",
                }
            )
            const id = updateResponse[0].id
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
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(val) => {
                props.onOpenChange(val)
                if (!val) {
                    queryClient.refetchQueries({
                        queryKey: ["quizzes_categories"],
                    })
                    queryClient.invalidateQueries({
                        queryKey: ["quizzes"],
                    })
                }
            }}
        >
            <DialogContent className="sm:max-w-[45vw] max-h-[97vh] overflow-y-auto py-10">
                <DialogTitle className="text-2xl font-bold text-center text-[#3C3C3C]">
                    Add New category
                </DialogTitle>
                <DialogDescription></DialogDescription>
                {isLoading ? (
                    <div className="w-full h-[70vh] flex items-center justify-center">
                        <Loader2 className="w-10 h-10   animate-spin duration-[animation-duration:350ms] text-blue-400" />
                    </div>
                ) : (
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
                            render={({
                                field: { onChange, value, onBlur },
                            }) => (
                                <QuizzesSelect
                                    categoryId={props.categoryId}
                                    inputClassName="w-full "
                                    selectedIds={value || []}
                                    errorMessage={errors.quizzes?.message}
                                    onSelect={async (quizzesIds) => {
                                        const copy = [...(value || [])]
                                        try {
                                            onChange(quizzesIds)
                                            toastLoading("Updating...")
                                            await updateManyQuizzes(
                                                quizzesIds.map((id) =>
                                                    Number(id)
                                                ),
                                                {
                                                    category: props.categoryId,
                                                }
                                            )

                                            toastSuccess(
                                                "Updated successfully."
                                            )
                                            onBlur()
                                        } catch (error) {
                                            console.error(error)
                                            toastError("Something went wrong.")
                                            onChange(copy)
                                            onChange(value)
                                        } finally {
                                            dismissToasts("loading")
                                        }
                                    }}
                                    onUnselect={async (quizId) => {
                                        const copy = [...(value || [])]
                                        try {
                                            onChange(
                                                value?.filter(
                                                    (item) => item !== quizId
                                                )
                                            )
                                            toastLoading("Updating...")
                                            await updateQuiz(Number(quizId), {
                                                category: null,
                                            })

                                            toastSuccess(
                                                "Updated successfully."
                                            )
                                            onBlur()
                                        } catch (error) {
                                            console.error(error)
                                            toastError("Something went wrong.")
                                            onChange(copy)
                                            onChange(value)
                                        } finally {
                                            dismissToasts("loading")
                                        }
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
                            isLoading={isSubmitting || isSubmitting}
                            disabled={isUploadingImage}
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            className="font-extrabold uppercase text-sm"
                            variant="blue"
                        >
                            Update category
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
type QuizzesSelectProps = Omit<
    ComponentProps<typeof SearchSelectMultiple>,
    "items"
> & { categoryId: number }

function QuizzesSelect({
    isLoading: isLoadingProp,
    categoryId,
    ...props
}: QuizzesSelectProps) {
    const { data: response, isLoading } = useQuery({
        queryKey: ["quizzes"],
        queryFn: () => readQuizzesWithDetails(),
    })

    return (
        <SearchSelectMultiple
            {...props}
            isLoading={isLoading}
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
