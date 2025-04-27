"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { useSidenav } from "@/providers/sidenav-provider"
import { getLanguage } from "@/utils/get-language"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Edit } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { DifficultySelect } from "../_components/difficulty-select"
import ImageUpload from "../_components/image-upload"

export default function Page() {
    const sideNav = useSidenav()

    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const user = useCurrentUser()

    // Translation object
    const translation = useMemo(
        () => ({
            en: {
                "Create custom quiz": "Create custom quiz",
                "Go back": "Go back",
                "Quiz Name": "Quiz Name",
                "Name is required": "Name is required",
                "Input exceeds maximum length": "Input exceeds maximum length",
                "Create Quiz": "Create Quiz",
                "Something wrong happened.": "Something wrong happened.",
            },
            fr: {
                "Create custom quiz": "Créer un quiz personnalisé",
                "Go back": "Retourner",
                "Quiz Name": "Nom du quiz",
                "Name is required": "Le nom est requis",
                "Input exceeds maximum length":
                    "La saisie dépasse la longueur maximale",
                "Create Quiz": "Créer le quiz",
                "Something wrong happened.": "Une erreur s'est produite.",
            },
            ar: {
                "Create custom quiz": "إنشاء اختبار مخصص",
                "Go back": "العودة",
                "Quiz Name": "اسم الاختبار",
                "Name is required": "الاسم مطلوب",
                "Input exceeds maximum length":
                    "تجاوز الإدخال الحد الأقصى للطول",
                "Create Quiz": "إنشاء اختبار",
                "Something wrong happened.": "حدث خطأ ما.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const formSchema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, t["Name is required"])
                    .max(100, t["Input exceeds maximum length"]),
                category: z.string().nullable(),
                difficulty: z.string().optional().nullable(),
            }),
        [t]
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
            setIsLoading(true)
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
                author_id: user.data?.id,
                difficulty: (data.difficulty as any) || "NORMAL",
            })
            const quizId = result[0].id
            if (sideNav.isSidenavOpen) {
                sideNav.toggleSidenav()
            }
            router.push(`/quizzes/add/${quizId}`)
            setImageUrl(null)
        } catch (error) {
            toastError(t["Something wrong happened."])
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <main className="flex relative items-center pb-10 flex-col">
            <h1 className="mt-10 text-neutral-600 text-3xl font-extrabold">
                {t["Create custom quiz"]}
            </h1>
            <div className="flex items-center h-0">
                <Button
                    onClick={router.back}
                    className="absolute font-bold text-neutral-500 top-2 left-2 md:top-4 md:left-4 px-6  "
                    variant={"secondary"}
                >
                    <ArrowLeft className="!w-5 !h-5 scale-125 -mr-1 stroke-[2.5]" />{" "}
                </Button>
            </div>
            <section className="flex flex-col w-full mt-8 gap-1 max-w-[900px]">
                <Input
                    {...register("name")}
                    placeholder={t["Quiz Name"]}
                    className="w-full"
                    errorMessage={errors.name?.message}
                />

                <Controller
                    control={control}
                    name="difficulty"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <DifficultySelect
                            selected={value as any}
                            setSelected={onChange}
                        />
                    )}
                />

                <ImageUpload
                    className=""
                    imageUrl={imageUrl}
                    onImageUrlChange={setImageUrl}
                />
                <Button
                    isLoading={isSubmitting || isLoading}
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="font-extrabold uppercase py-7 mt-5 text-sm"
                >
                    {t["Create Quiz"]} <Edit />
                </Button>
            </section>
        </main>
    )
}
