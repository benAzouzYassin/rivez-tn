import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SparklesIcon } from "lucide-react"
import { ComponentProps, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/ui-utils"
import { generateCodeSnippets } from "@/data-access/quizzes/generate"
import { toastError } from "@/lib/toasts"
import CodeSnippets from "./code-snippets"
import { useIsAdmin } from "@/hooks/use-is-admin"

interface Props {
    setCodeSnippets: (
        value: ComponentProps<typeof CodeSnippets>["tabs"]
    ) => void
}
export default function GenerateSnippets(props: Props) {
    const isAdmin = useIsAdmin()
    const [open, setOpen] = useState(false)
    const formSchema = useMemo(
        () =>
            z.object({
                language: z
                    .string()
                    .min(
                        1,
                        "Please provide a programming language or framework."
                    )
                    .max(
                        50,
                        "Programming language must be less than 50 characters"
                    ),
                fileCount: z.coerce.number().min(1).max(5),
                framework: z
                    .string()
                    .max(50, "Framework must be less than 50 characters")
                    .optional(),
                concepts: z
                    .string()
                    .min(1, "Concepts are required")
                    .max(100, "Concepts must be less than 100 characters"),
                notes: z
                    .string()
                    .max(500, "Notes must be less than 500 characters")
                    .optional(),
            }),
        []
    )

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await generateCodeSnippets(data, (snippets) => {
                if (snippets) {
                    props.setCodeSnippets(
                        snippets?.map((item) => ({
                            code: item.code,
                            localId: crypto.randomUUID(),
                            name: item.filename,
                            type: item.programmingLanguage,
                        }))
                    )
                }
            })
            setOpen(false)
        } catch (error) {
            console.error("Error submitting form:", error)
            toastError("Something went wrong.")
        }
    }

    if (!isAdmin) {
        return null
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="blue"
                    className="text-lg h-14 mt-3 max-w-[650px] mx-auto w-full font-bold"
                >
                    Generate with AI
                    <SparklesIcon className="ml-2 w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogTitle className="text-2xl text-neutral-600 font-extrabold">
                    Generate Code Snippets
                </DialogTitle>
                <DialogDescription>
                    Fill in the details below to generate code snippets with AI.
                </DialogDescription>
                <form
                    className="flex flex-col  pt-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        id="language"
                        placeholder="Language OR Framework"
                        className=" w-full"
                        errorMessage={errors.language?.message}
                        {...register("language")}
                    />
                    <Input
                        id="fileCount"
                        placeholder="Number of files"
                        className=" w-full"
                        errorMessage={errors.fileCount?.message}
                        type="number"
                        {...register("fileCount")}
                    />

                    <Textarea
                        id="concepts"
                        placeholder="Concepts, Ex : Auth, API, State..."
                        className={cn("text-base w-full h-32 font-medium")}
                        {...register("concepts")}
                        errorMessage={errors.concepts?.message}
                    />

                    <Textarea
                        id="notes"
                        className={cn(
                            "text-base -mt-1 w-full h-32 font-medium"
                        )}
                        placeholder="Any additional details or requirements..."
                        {...register("notes")}
                        errorMessage={errors.notes?.message}
                    />

                    <Button
                        type="submit"
                        className="text-base ml-auto mt-4"
                        isLoading={isSubmitting}
                    >
                        Generate
                        <SparklesIcon className="ml-2 w-5 h-5" />
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
