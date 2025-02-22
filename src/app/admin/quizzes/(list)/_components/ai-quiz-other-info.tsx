"use client"

import PdfUpload from "@/components/shared/pdf-upload"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, FileTextIcon } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./ai-quiz-dialog-content"

type Props = {
    form: UseFormReturn<FormValues>
    onBackClick: () => void
    isLoading: boolean
    onSubmit: (data: FormValues) => void
    setIsUploadingPdf: (isLoading: boolean) => void
    isUploadingPdf: boolean
    pdfUrl: string | null
    setPdfUrl: (val: string | null) => void
}

export default function AiQuizOtherInfo({
    form,
    onBackClick,
    isLoading,
    onSubmit,
    isUploadingPdf,
    pdfUrl,
    setIsUploadingPdf,
    setPdfUrl,
}: Props) {
    const {
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
                    {...register("maxQuestions")}
                    placeholder="Max questions"
                    className="w-full"
                    type="number"
                    errorMessage={errors.maxQuestions?.message}
                />
                <Input
                    {...register("minQuestions")}
                    placeholder="Min questions"
                    className="w-full"
                    type="number"
                    errorMessage={errors.minQuestions?.message}
                />

                <Textarea
                    {...register("description")}
                    placeholder="Description"
                    className="min-h-[100px]"
                />
                <PdfUpload
                    fileName={form.watch("pdfName") || ""}
                    onFileNameChange={(name) => form.setValue("pdfName", name)}
                    renderEmptyContent={() => (
                        <>
                            <FileTextIcon className="w-10 h-10 mb-2 mx-auto text-red-400" />
                            <p className="text-base font-semibold text-neutral-500">
                                Drag or click to upload pdf.
                            </p>
                            <p className="text-xs text-neutral-400">
                                PDF document can help our system generate better
                                quiz content.
                            </p>
                            <p className="text-xs text-neutral-400">
                                Up to 10MB.
                            </p>
                        </>
                    )}
                    displayCancelBtn
                    isLoading={isUploadingPdf}
                    onLoadingChange={setIsUploadingPdf}
                    className="-mt-3"
                    pdfUrl={pdfUrl}
                    onPdfUrlChange={setPdfUrl}
                />

                <Button
                    isLoading={isLoading}
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
