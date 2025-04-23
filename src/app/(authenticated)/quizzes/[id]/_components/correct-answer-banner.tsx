import ReportQuiz from "@/components/shared/report-quiz"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { getLanguage } from "@/utils/get-language"
import { wait } from "@/utils/wait"
import { Check } from "lucide-react"
import { useMemo } from "react"

type Props = {
    isOpen: boolean
    onNextClick: () => void
}

export default function CorrectAnswerBanner(props: Props) {
    const translation = useMemo(
        () => ({
            en: { "Correct answer!": "Correct answer!", Continue: "Continue" },
            ar: { "Correct answer!": "إجابة صحيحة !", Continue: "استمر" },
            fr: {
                "Correct answer!": "Bonne réponse !",
                Continue: "Continuer",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    return (
        <div
            dir="ltr"
            className={cn(
                "border overflow-hidden opacity-0 translate-y-10 h-0 ease-in flex flex-col md:flex-row py-3 md:py-5 px-4 md:px-20 transition-all border-green-200 bg-[#D2FFCC] fixed w-full bottom-0",
                {
                    "h-auto md:h-[140px] translate-y-0 opacity-100":
                        props.isOpen,
                }
            )}
        >
            <div className="flex pb-2 md:pb-0 items-center">
                <div className="h-16 w-16 md:h-[90px] md:w-[90px] flex items-center justify-center bg-white border border-[#47cd35]/20 rounded-full">
                    <Check className="stroke-5 ml-1 h-8 w-8 md:h-14 md:w-14 stroke-[#58A700]/80" />
                </div>
                <div>
                    <p className="text-lg md:text-xl ml-4 font-bold text-[#58A700]">
                        {t["Correct answer!"]}
                    </p>
                    <ReportQuiz
                        quizId=""
                        quizType="question-answer"
                        disabled={!props.isOpen}
                        className="text-sm md:text-base active:scale-95 opacity-90 font-semibold flex items-center gap-1 w-fit mt-2 text-[#58A700]"
                    />
                </div>
            </div>

            <Button
                onClick={() => {
                    props.onNextClick()
                    wait(100).then(() =>
                        window.scroll({
                            behavior: "smooth",
                            top: 0,
                        })
                    )
                }}
                disabled={!props.isOpen}
                className="w-full md:w-auto mt-4  md:ml-auto h-10 md:h-12 px-5 md:px-7 text-base md:text-lg font-bold my-auto"
                variant={"green"}
            >
                {t["Continue"]}
            </Button>
        </div>
    )
}
