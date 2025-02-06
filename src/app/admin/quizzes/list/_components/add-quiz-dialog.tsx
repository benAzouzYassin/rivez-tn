"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMemo, useState } from "react"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import CategorySelect from "@/components/shared/category-select"
import ImageUpload from "@/components/shared/image-upload"

export default function AddQuizDialog(props: Props) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const formSchema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, "Name is required")
                    .max(100, "Input exceeds maximum length"),
                category: z
                    .string({ message: "Category is required" })
                    .min(1, "Category is required")
                    .max(100, "Input exceeds maximum length"),
                description: z.string().optional(),
            }),
        []
    )

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
            description: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // Handle form submission
        console.log(data)
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[45vw] max-h-[97vh] overflow-y-auto py-10">
                <DialogTitle className="text-2xl font-bold text-center text-[#3C3C3C]">
                    Create New Quiz
                </DialogTitle>
                <DialogDescription></DialogDescription>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
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
                                inputClassName="w-full"
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
                        imageUrl={imageUrl}
                        onImageUrlChange={setImageUrl}
                    />
                    <Button
                        isLoading={isSubmitting}
                        type="submit"
                        className="font-bold uppercase text-sm"
                        variant="blue"
                    >
                        Create Quiz
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}
