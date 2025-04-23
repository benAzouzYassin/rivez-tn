import { cn } from "@/lib/ui-utils"
import useQuizStore from "../store"
import { getLanguage } from "@/utils/get-language"

interface Props {
    localId: string
    text: string
    className?: string
}
export function QuestionText(props: Props) {
    const lang = getLanguage()
    const t = translation[lang]
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    return (
        <div className=" w-fit">
            <input
                value={props.text}
                onChange={(e) => {
                    updateQuestion(
                        { questionText: e.target.value },
                        props.localId
                    )
                }}
                placeholder={t["Write your question..."]}
                className={cn(
                    "font-extrabold min-w-[800px] placeholder:opacity-50 text-neutral-800 focus-within:outline-none text-3xl",
                    props.className
                )}
            />
            <hr className="h-1 mt-1 w-full min-w-96 rounded-md bg-neutral-300" />
        </div>
    )
}
const translation = {
    en: { "Write your question...": "Write your question..." },
    fr: { "Write your question...": "Écrivez votre question..." },
    ar: { "Write your question...": "أكتب سؤالك..." },
}
