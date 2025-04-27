"use client"

import { Button } from "@/components/ui/button"
import WarningDialog from "@/components/ui/warning-dialog"
import { softDeleteQuizById } from "@/data-access/quizzes/delete"
import { addQuestionsToQuiz } from "@/data-access/quizzes/update"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError, toastSuccess } from "@/lib/toasts"
import { shuffleArray } from "@/utils/array"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useState, useMemo } from "react"
import useQuizStore, {
    FillInTheBlankStoreContent,
    MatchingPairsOptions,
    MultipleChoiceOptions,
} from "../store"
import { getLanguage } from "@/utils/get-language"

export default function Buttons() {
    const translation = useMemo(
        () => ({
            en: {
                removeQuiz: "Remove the quiz",
                cancel: "Cancel",
                saveQuiz: "Save Quiz",
                saved: "Saved successfully.",
                errorSaving: "Error while saving...",
                warningTitle: "Warning: Proceed with caution",
                warningDesc:
                    "You have left some options empty. Any empty option will be ignored.",
                continue: "Continue",
            },
            fr: {
                removeQuiz: "Supprimer le quiz",
                cancel: "Annuler",
                saveQuiz: "Enregistrer le quiz",
                saved: "Enregistré avec succès.",
                errorSaving: "Erreur lors de l'enregistrement...",
                warningTitle: "Avertissement : Procédez avec prudence",
                warningDesc:
                    "Vous avez laissé certaines options vides. Toute option vide sera ignorée.",
                continue: "Continuer",
            },
            ar: {
                removeQuiz: "حذف الاختبار",
                cancel: "إلغاء",
                saveQuiz: "حفظ الاختبار",
                saved: "تم الحفظ بنجاح.",
                errorSaving: "حدث خطأ أثناء الحفظ...",
                warningTitle: "تحذير: تابع بحذر",
                warningDesc:
                    "لقد تركت بعض الخيارات فارغة. سيتم تجاهل أي خيار فارغ.",
                continue: "متابعة",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const { data: userData } = useCurrentUser()
    const isGenerating = useQuizStore((s) => s.isGeneratingQuizWithAi)
    const shadowQuestionsCount = useQuizStore((s) => s.shadowQuestionsCount)
    const params = useParams()
    const quizId = parseInt(params["id"] as string)
    const reset = useQuizStore((s) => s.reset)
    const questions = useQuizStore((s) => s.allQuestions)
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)
    const [isWarning, setIsWarning] = useState(false)
    const queryClient = useQueryClient()

    const handleSave = async ({ shouldTake }: { shouldTake: boolean }) => {
        try {
            if (isNaN(quizId) === false && quizId) {
                setIsSaving(true)
                const addedQuestions = await addQuestionsToQuiz(
                    quizId,
                    questions
                        .map((q, index) => {
                            if (q.type === "MULTIPLE_CHOICE") {
                                const content =
                                    q.content as MultipleChoiceOptions
                                const filteredOptions = content.options.filter(
                                    (opt) => !!opt.text
                                )
                                return {
                                    displayOrder: index,
                                    content: {
                                        options: filteredOptions,
                                        codeSnippets: q.codeSnippets,
                                    },
                                    type: q.type as any,
                                    image: q.imageUrl || "",
                                    question: q.questionText,
                                    layout: q.layout,
                                    imageType: q.imageType,
                                }
                            }
                            if (q.type === "FILL_IN_THE_BLANK") {
                                const content =
                                    q.content as FillInTheBlankStoreContent
                                const notSelectedOptions = content.options.map(
                                    (opt) => opt.text
                                )
                                const selectedOptions = content.correct.map(
                                    (opt) => opt.option
                                )
                                const allOptions = [
                                    ...notSelectedOptions,
                                    ...selectedOptions,
                                ]
                                return {
                                    displayOrder: index,
                                    content: {
                                        options: shuffleArray(allOptions),
                                        correct: content.correct,
                                        parts: content.parts,
                                    },
                                    type: q.type as any,
                                    image: "",
                                    question: q.questionText,
                                    layout: q.layout,
                                    imageType: q.imageType,
                                }
                            }
                            if (q.type === "MATCHING_PAIRS") {
                                const content =
                                    q.content as MatchingPairsOptions
                                const filteredRightOptions =
                                    content.rightOptions.filter(
                                        (opt) => !!opt.text
                                    )

                                const filteredLeftOptions =
                                    content.leftOptions.filter(
                                        (opt) => !!opt.text
                                    )

                                return {
                                    displayOrder: index,
                                    content: {
                                        leftOptions: filteredLeftOptions,
                                        rightOptions: filteredRightOptions,
                                    },
                                    type: q.type as any,
                                    image: q.imageUrl || "",
                                    question: q.questionText,
                                    layout: q.layout,
                                    imageType: q.imageType,
                                }
                            }
                            return null
                        })
                        .filter((q) => !!q)
                )
                toastSuccess(t.saved)

                queryClient.invalidateQueries({
                    queryKey: ["quizzes"],
                })
                if (shouldTake) {
                    router.replace(`/quizzes/${quizId}`)
                } else {
                    router.replace("/quizzes")
                }
                reset(shouldTake)
            }
        } catch (error) {
            console.error(error)
            toastError(t.errorSaving)
        } finally {
            setIsSaving(false)
        }
    }
    const handleSubmit = ({ shouldTake }: { shouldTake: boolean }) => {
        const isAllOptionsFilled = questions.every((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
                const content = q.content as MultipleChoiceOptions | undefined

                if (!content || !content.options.length) {
                    return false
                }
                const isOptionsValid =
                    content.options.every((opt) => !!opt.text) &&
                    content.options.length > 0
                return isOptionsValid
            }
            if (q.type === "MATCHING_PAIRS") {
                const content = q.content as MatchingPairsOptions | undefined
                if (
                    !content ||
                    !content.leftOptions.length ||
                    !content.rightOptions.length
                ) {
                    return false
                }
                const isRightOptionsValid =
                    content.rightOptions.every((opt) => !!opt.text) &&
                    content.rightOptions.length > 0

                const isLeftOptionsValid =
                    content.leftOptions.every((opt) => !!opt.text) &&
                    content.leftOptions.length > 0

                return isLeftOptionsValid && isRightOptionsValid
            }
            if (q.type === "FILL_IN_THE_BLANK") {
                return true
            }
            return false
        })
        const isQuestionsFilled = questions.every((q) => !!q.content)
        if (!isAllOptionsFilled || !isQuestionsFilled) {
            return setIsWarning(true)
        }
        handleSave({ shouldTake })
    }
    return (
        <div className=" w-full z-50  rtl:pl-5  fixed flex items-center justify-end right-0 top-24 ">
            <div className="flex z-50   items-center gap-2 bg-white p-2 rounded-2xl">
                <WarningDialog
                    isOpen={isCanceling}
                    onOpenChange={setIsCanceling}
                    confirmText={t.removeQuiz}
                    onConfirm={async () => {
                        await softDeleteQuizById(quizId)
                        reset()
                        router.replace("/quizzes")
                    }}
                >
                    <Button
                        disabled={isGenerating || shadowQuestionsCount > 2}
                        className="text-base font-extrabold"
                        variant="red"
                    >
                        {t.cancel}
                    </Button>
                </WarningDialog>
                <Button
                    isLoading={isSaving}
                    disabled={isGenerating || shadowQuestionsCount > 2}
                    onClick={() => handleSubmit({ shouldTake: false })}
                    className="text-base font-extrabold"
                    variant={"blue"}
                >
                    {t.saveQuiz}
                </Button>
                <Button
                    id="save-and-take-quiz-button"
                    isLoading={isSaving}
                    disabled={isGenerating || shadowQuestionsCount > 2}
                    onClick={() => handleSubmit({ shouldTake: true })}
                    className="text-base hidden font-extrabold"
                    variant={"blue"}
                >
                    {t.saveQuiz}
                </Button>

                <WarningDialog
                    titleClassName="text-[#EF9C07]"
                    isOpen={isWarning}
                    onOpenChange={setIsWarning}
                    description={t.warningDesc}
                    title={t.warningTitle}
                    confirmText={t.continue}
                    confirmBtnClassName="bg-amber-400 shadow-amber-400"
                    onConfirm={async () => {
                        setIsWarning(false)
                        handleSave({ shouldTake: false })
                        reset()
                        router.back()
                    }}
                />
            </div>
        </div>
    )
}
