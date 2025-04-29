import { Button } from "@/components/ui/button"
import WarningDialog from "@/components/ui/warning-dialog"
import { deleteQuizQuestions } from "@/data-access/quizzes/delete"
import {
    addQuestionsToQuiz,
    updateQuizQuestions,
} from "@/data-access/quizzes/update"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError, toastSuccess } from "@/lib/toasts"
import { shuffleArray } from "@/utils/array"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useState, useMemo } from "react"
import useUpdateQuizStore, {
    FillInTheBlankStoreContent,
    StateMatchingPairsOptions,
    StateMultipleChoiceOptions,
} from "../store"
import { getLanguage } from "@/utils/get-language"

export default function Buttons() {
    // Translation object
    const translation = useMemo(
        () => ({
            en: {
                cancel: "Cancel",
                save: "Save changes",
                saved: "Changes saved successfully.",
                errorUpdate: "Error while updating some questions...",
                errorDelete: "Error while deleting some questions...",
                errorSave: "Error while saving some of the new questions...",
                warningTitle: "Warning: Proceed with caution",
                warningDesc:
                    "You have left some options empty. Any empty option will be ignored.",
                continue: "Continue",
            },
            fr: {
                cancel: "Annuler",
                save: "Enregistrer les modifications",
                saved: "Modifications enregistrées avec succès.",
                errorUpdate:
                    "Erreur lors de la mise à jour de certaines questions...",
                errorDelete:
                    "Erreur lors de la suppression de certaines questions...",
                errorSave:
                    "Erreur lors de l'enregistrement de certaines nouvelles questions...",
                warningTitle: "Avertissement : Procédez avec prudence",
                warningDesc:
                    "Vous avez laissé certaines options vides. Toute option vide sera ignorée.",
                continue: "Continuer",
            },
            ar: {
                cancel: "إلغاء",
                save: "حفظ التغييرات",
                saved: "تم حفظ التغييرات بنجاح.",
                errorUpdate: "حدث خطأ أثناء تحديث بعض الأسئلة...",
                errorDelete: "حدث خطأ أثناء حذف بعض الأسئلة...",
                errorSave: "حدث خطأ أثناء حفظ بعض الأسئلة الجديدة...",
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

    const params = useParams()
    const quizId = parseInt(params["id"] as string)
    const reset = useUpdateQuizStore((s) => s.reset)
    const questions = useUpdateQuizStore((s) => s.allQuestions)
    const removedQuestionsIds = useUpdateQuizStore((s) => s.deletedQuestionsIds)
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [isWarning, setIsWarning] = useState(false)
    const queryClient = useQueryClient()
    const { data: userData } = useCurrentUser()

    const handleSave = async () => {
        try {
            if (isNaN(quizId) === false && quizId) {
                setIsSaving(true)

                // TODO make this implemented inside a transaction
                const isUpdatedOldSuccess = await updateOldQuestions()
                const isQuestionDeleteSuccess = await deleteRemovedQuestions()
                const isSavedNewQuestionsSuccess = await saveNewQuestions()

                if (!isUpdatedOldSuccess) {
                    toastError(t.errorUpdate)
                    throw new Error(t.errorUpdate)
                }
                if (!isQuestionDeleteSuccess) {
                    toastError(t.errorDelete)
                    throw new Error(t.errorDelete)
                }
                if (!isSavedNewQuestionsSuccess) {
                    toastError(t.errorSave)
                    throw new Error(t.errorSave)
                }
                toastSuccess(t.saved)
                queryClient.invalidateQueries({
                    queryKey: ["quizzes"],
                })
                router.replace("/quizzes")
                reset()
            }
        } catch (error) {
            console.error(error)
            // wait(200).then(() => window.location.reload())
        } finally {
            setIsSaving(false)
        }
    }

    const updateOldQuestions = async () => {
        try {
            const oldQuestions = questions
                .filter((q) => !!q.questionId)
                .map((q, index) => {
                    if (q.type === "MULTIPLE_CHOICE") {
                        const content = q.content as StateMultipleChoiceOptions
                        const filteredOptions = content.options.filter(
                            (opt) => !!opt.text
                        )
                        return {
                            displayOrder: index,
                            quizId,
                            id: Number(q.questionId),
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

                    if (q.type === "MATCHING_PAIRS") {
                        const content = q.content as StateMatchingPairsOptions
                        const filteredRightOptions =
                            content.rightOptions.filter((opt) => !!opt.text)

                        const filteredLeftOptions = content.leftOptions.filter(
                            (opt) => !!opt.text
                        )

                        return {
                            displayOrder: index,
                            quizId,
                            id: Number(q.questionId),
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
                    if (q.type === "FILL_IN_THE_BLANK") {
                        const content = q.content as FillInTheBlankStoreContent
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
                            id: Number(q.questionId),
                            quizId,
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
                    return null
                })
                .filter((q) => !!q)
            const result = await updateQuizQuestions(oldQuestions)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    const saveNewQuestions = async () => {
        const newQuestions = questions.filter(
            (q) => q.questionId === undefined || q.questionId === null
        )
        const oldQuestionsLength = questions.length - newQuestions.length
        try {
            const formattedNewQuestions = newQuestions
                .map((q, index) => {
                    if (q.type === "MULTIPLE_CHOICE") {
                        const content = q.content as StateMultipleChoiceOptions
                        const filteredOptions = content.options.filter(
                            (opt) => !!opt.text
                        )
                        return {
                            displayOrder: index + oldQuestionsLength,
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
                        const content = q.content as FillInTheBlankStoreContent
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
                        const content = q.content as StateMatchingPairsOptions
                        const filteredRightOptions =
                            content.rightOptions.filter((opt) => !!opt.text)

                        const filteredLeftOptions = content.leftOptions.filter(
                            (opt) => !!opt.text
                        )

                        return {
                            displayOrder: index + oldQuestionsLength,
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
            const result = await addQuestionsToQuiz(
                quizId,
                formattedNewQuestions
            )
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
    const deleteRemovedQuestions = async () => {
        try {
            await deleteQuizQuestions({ questionIds: removedQuestionsIds })
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
    const handleSubmit = async () => {
        const isAllOptionsFilled = questions.every((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
                const content = q.content as
                    | StateMultipleChoiceOptions
                    | undefined

                if (!content || !content.options.length) {
                    return false
                }
                const isOptionsValid =
                    content.options.every((opt) => !!opt.text) &&
                    content.options.length > 0
                return isOptionsValid
            }
            if (q.type === "MATCHING_PAIRS") {
                const content = q.content as
                    | StateMatchingPairsOptions
                    | undefined
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
        await handleSave()
    }
    return (
        <div className="flex z-50 items-center justify-end h-10 fixed bg-transparent rtl:-right-5 right-10 top-24 w-full bg-none gap-2">
            <div className="bg-white dark:bg-neutral-900 p-2 flex items-center justify-center gap-2 rounded-2xl  shadow-none">
                <Button
                    onClick={() => {
                        reset()
                        router.back()
                    }}
                    className="text-base font-extrabold"
                    variant="red"
                >
                    {t.cancel}
                </Button>

                <Button
                    onClick={handleSubmit}
                    isLoading={isSaving}
                    className="text-base font-extrabold"
                    variant="blue"
                >
                    {t.save}
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
                        handleSave()
                        reset()
                        router.back()
                    }}
                />
            </div>
        </div>
    )
}
