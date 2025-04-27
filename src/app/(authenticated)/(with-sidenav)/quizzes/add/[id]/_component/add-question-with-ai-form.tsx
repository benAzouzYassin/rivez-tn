import { POSSIBLE_QUESTIONS } from "@/app/api/quiz/generate-quiz/constants"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ChevronLeft, SparklesIcon } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { DifficultySelect } from "../../_components/difficulty-select"
import { getLanguage } from "@/utils/get-language"

const POSSIBLE_QUESTIONS_TYPES = Object.keys(POSSIBLE_QUESTIONS)

interface FormValues {
    mainTopic: string
    language?: string | null | undefined
    notes?: string | null | undefined
    difficulty?: string | null | undefined
}

interface Props {
    onSubmit: (data: FormValues) => void
    onBackClick: () => void
}

export default function AddQuestionWithAiForm(props: Props) {
    // Translation object
    const translation = useMemo(
        () => ({
            en: {
                back: "Back",
                subject: "Subject",
                subjectPlaceholder: "Enter the main topic (Be detailed !)",
                subjectRequired: "Main topic is required",
                subjectTooLong: "Input exceeds maximum length",
                difficulty: "Difficulty Level",
                language: "Language",
                selectLanguage: "Select language",
                english: "English",
                arabic: "Arabic",
                french: "French",
                comingSoon: "(coming soon)",
                notes: "Additional Notes",
                notesPlaceholder:
                    "Add any additional instructions for the AI...",
                generate: "Generate Question",
            },
            fr: {
                back: "Retour",
                subject: "Sujet",
                subjectPlaceholder:
                    "Entrez le sujet principal (Soyez précis !)",
                subjectRequired: "Le sujet principal est requis",
                subjectTooLong: "La saisie dépasse la longueur maximale",
                difficulty: "Niveau de difficulté",
                language: "Langue",
                selectLanguage: "Sélectionnez la langue",
                english: "Anglais",
                arabic: "Arabe",
                french: "Français",
                comingSoon: "(bientôt disponible)",
                notes: "Notes supplémentaires",
                notesPlaceholder:
                    "Ajoutez des instructions supplémentaires pour l'IA...",
                generate: "Générer la question",
            },
            ar: {
                back: "رجوع",
                subject: "الموضوع",
                subjectPlaceholder: "أدخل الموضوع الرئيسي (كن دقيقًا!)",
                subjectRequired: "الموضوع الرئيسي مطلوب",
                subjectTooLong: "النص يتجاوز الحد الأقصى للطول",
                difficulty: "مستوى الصعوبة",
                language: "اللغة",
                selectLanguage: "اختر اللغة",
                english: "الإنجليزية",
                arabic: "العربية",
                french: "الفرنسية",
                comingSoon: "(قريبًا)",
                notes: "ملاحظات إضافية",
                notesPlaceholder: "أضف أي تعليمات إضافية للذكاء الاصطناعي...",
                generate: "إنشاء سؤال",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const formSchema = useMemo(
        () =>
            z.object({
                mainTopic: z
                    .string()
                    .min(1, t.subjectRequired)
                    .max(100, t.subjectTooLong),
                language: z.string().nullable().optional(),
                notes: z.string().nullable().optional(),
                difficulty: z.string().nullable().optional(),
            }),
        [t.subjectRequired, t.subjectTooLong]
    )
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    return (
        <section className="flex flex-col w-full md:-mt-5 mx-auto gap-4 max-w-[900px] bg-white  rounded-3xl  ">
            <Button
                variant={"secondary"}
                className="absolute left-4 top-14"
                onClick={props.onBackClick}
            >
                <ArrowLeft className="!w-6 !h-6 text-neutral-400 stroke-[2.5]" />
            </Button>
            <div className="">
                {/* Main Topic */}
                <div>
                    <label
                        htmlFor="mainTopic"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        {t.subject}
                    </label>
                    <Textarea
                        id="mainTopic"
                        {...form.register("mainTopic")}
                        placeholder={t.subjectPlaceholder}
                        className="w-full -mb-2"
                        errorMessage={form.formState.errors.mainTopic?.message}
                    />
                </div>
                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {t.difficulty}
                    </label>
                    <Controller
                        control={form.control}
                        name="difficulty"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <DifficultySelect
                                selected={value as any}
                                setSelected={onChange}
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Notes */}
                <div>
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        {t.notes}
                    </label>
                    <Textarea
                        id="notes"
                        {...form.register("notes")}
                        placeholder={t.notesPlaceholder}
                        className="w-full"
                        errorMessage={form.formState.errors.notes?.message}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="button"
                onClick={() => {
                    form.handleSubmit((data) => props.onSubmit(data))()
                }}
                className="font-extrabold uppercase mt-4 py-6 text-base w-full md:w-auto"
            >
                {t.generate}
                <SparklesIcon className=" !w-6 !h-6" />
            </Button>
        </section>
    )
}
