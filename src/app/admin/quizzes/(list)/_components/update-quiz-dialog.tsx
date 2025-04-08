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
import { readQuizById } from "@/data-access/quizzes/read"
import { updateQuiz } from "@/data-access/quizzes/update"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import StatusButton from "./status-button"
import { PublishingStatusType } from "@/data-access/types"

export default function UpdateQuizDialog(props: Props) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [createdAt, setCreatedAt] = useState<string>("")
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const queryClient = useQueryClient()
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
        formState: { errors },
        reset,
        setValue,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
            description: "",
        },
    })

    useEffect(() => {
        if (props.isOpen) {
            readQuizById(props.quizId)
                .then((data) => {
                    setValue("name", data.name)
                    setValue("description", data.description || "")
                    if (data.category)
                        setValue("category", String(data.category))
                    setImageUrl(data.image)
                    setCreatedAt(data.created_at)
                })
                .catch((err) => {
                    console.error(err)
                    toastError("Something went wrong.")
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [props.quizId, setValue, props.isOpen])
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateQuiz(props.quizId, {
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: data.description,
                author_id: user.data?.id,
                created_at: createdAt,
            })
            queryClient.refetchQueries({
                queryKey: ["quizzes"],
            })
            props.onOpenChange(false)
            reset()
            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[45vw] max-h-[97vh] overflow-y-auto py-10">
                <DialogTitle className="text-2xl font-bold text-center text-[#3C3C3C]">
                    Update Quiz
                </DialogTitle>
                <DialogDescription></DialogDescription>
                {isLoading ? (
                    <div className="w-full h-[70vh] flex items-center justify-center">
                        <Loader2 className="w-10 h-10   animate-spin duration-[animation-duration:350ms] text-blue-400" />
                    </div>
                ) : (
                    <section className="flex relative  flex-col gap-4">
                        <div className="w-fit flex items-center justify-start h-10">
                            <p className="text-nowrap mr-2 text-lg font-semibold">
                                Status :{" "}
                            </p>
                            <StatusButton
                                itemId={props.quizId}
                                status={props.status}
                            />
                        </div>
                        <Input
                            {...register("name")}
                            placeholder="Quiz Name"
                            className="w-full"
                            errorMessage={errors.name?.message}
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
                            Save changes
                        </Button>
                    </section>
                )}
            </DialogContent>
        </Dialog>
    )
}

interface Props {
    status: PublishingStatusType
    quizId: number
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}
