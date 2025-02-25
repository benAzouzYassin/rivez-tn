"use client"

import CategorySelect from "@/components/shared/category-select"
import ImageUpload from "@/components/shared/image-upload"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ImageIcon } from "lucide-react"
import { Controller, UseFormReturn } from "react-hook-form"
import { FormValues } from "./ai-quiz-dialog-content"

type Props = {
    form: UseFormReturn<FormValues>
    onBackClick: () => void
    imageUrl: string | null
    setImageUrl: (url: string | null) => void
    isUploadingImage: boolean
    setIsUploadingImage: (isLoading: boolean) => void
    isLoading: boolean
    onSubmit: () => void
}

export default function AiQuizBasicInfo({
    form,
    onBackClick,
    imageUrl,
    setImageUrl,
    isUploadingImage,
    setIsUploadingImage,
    isLoading,
    onSubmit,
}: Props) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = form
    return (
        <>
            <div className="flex items-center  h-0">
                <Button
                    onClick={onBackClick}
                    className="rounded-full w-10 h-10 p-0 absolute top-4"
                    variant="outline"
                >
                    <ChevronLeft className="stroke-3 text-neutral-500 !w-5 !h-5" />
                </Button>

                <DialogTitle className="text-2xl font-bold text-center grow text-[#3C3C3C]"></DialogTitle>
            </div>
            <DialogDescription />
            <section className="flex flex-col gap-4 -mt-4">
                <Input
                    {...register("name")}
                    placeholder="Quiz Name"
                    className="w-full"
                    errorMessage={errors.name?.message}
                />
                <Input
                    {...register("mainTopic")}
                    placeholder="Main topic"
                    className="w-full"
                    errorMessage={errors.mainTopic?.message}
                />
                <Select
                    defaultValue={form.getValues().language || undefined}
                    onValueChange={(val) => form.setValue("language", val)}
                >
                    <SelectTrigger className="data-[placeholder]:text-neutral-400">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EN">English</SelectItem>
                        <SelectItem disabled value="AR">
                            Arabic{" "}
                            <span className="text-sm italic">(soon...)</span>
                        </SelectItem>
                        <SelectItem disabled value="FR">
                            French{" "}
                            <span className="text-sm italic">(soon...)</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <CategorySelect
                            placeholder="Category"
                            enableAddButton
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

                <ImageUpload
                    renderEmptyContent={() => (
                        <>
                            <ImageIcon className="w-10 h-10 mb-2 mx-auto text-neutral-400" />
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
                    )}
                    displayCancelBtn
                    isLoading={isUploadingImage}
                    onLoadingChange={setIsUploadingImage}
                    className="-mt-3"
                    imageUrl={imageUrl}
                    onImageUrlChange={setImageUrl}
                />
                <Button
                    isLoading={isLoading}
                    disabled={isUploadingImage}
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="font-extrabold uppercase text-sm"
                    variant="blue"
                >
                    Generate Quiz
                </Button>
            </section>
        </>
    )
}
