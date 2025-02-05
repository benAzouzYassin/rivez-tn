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
import { useForm } from "react-hook-form"
import { useMemo } from "react"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"

export default function AddQuizDialog(props: Props) {
    const formSchema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, "Name is required")
                    .max(100, "Input exceeds maximum length"),
                category: z
                    .string()
                    .min(1, "Category is required")
                    .max(100, "Input exceeds maximum length"),
                description: z.string().optional(),
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
                    <Input
                        {...register("category")}
                        placeholder="Category"
                        className="w-full"
                        errorMessage={errors.category?.message}
                    />
                    <Textarea
                        {...register("description")}
                        placeholder="Description (optional)"
                        className="min-h-[100px]"
                    />
                    <FileUpload onChange={() => {}} />
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
