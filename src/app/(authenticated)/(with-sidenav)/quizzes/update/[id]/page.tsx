"use client"
import { useEffect } from "react"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"
import useUpdateQuizStore from "./store"
import { useParams } from "next/navigation"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { ErrorDisplay } from "@/components/shared/error-display"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import UnsupportedScreen from "@/components/shared/unsuported-screen"
import { getLanguage } from "@/utils/get-language"

export default function Page() {
    const lang = getLanguage()
    const t = translation[lang]
    const isSmallScreen = useIsSmallScreen()
    const params = useParams()
    const quizId = Number(params["id"])
    const loadQuizData = useUpdateQuizStore((s) => s.loadQuizData)
    const isLoading = useUpdateQuizStore((s) => s.isLoadingData)
    const isError = useUpdateQuizStore((s) => s.isLoadingError)

    useEffect(() => {
        loadQuizData(quizId)
    }, [loadQuizData, quizId])

    if (isSmallScreen) {
        return <UnsupportedScreen />
    }

    return (
        <section className="min-h-[100vh] dark:bg-neutral-900  pb-[200px]">
            {isLoading && (
                <GeneralLoadingScreen text={t["Loading quiz data"]} />
            )}
            {isError && <ErrorDisplay />}
            {!isLoading && !isError && (
                <>
                    <SelectedQuestionContent />
                    <AllQuestionsPreviews />
                </>
            )}
        </section>
    )
}

const translation = {
    en: {
        "Loading quiz data": "Loading quiz data",
    },
    ar: {
        "Loading quiz data": "جارٍ تحميل بيانات الاختبار",
    },
    fr: {
        "Loading quiz data": "Chargement des données du quiz",
    },
}
