import ReportQuiz from "@/components/shared/quizzes/report-quiz"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { X } from "lucide-react"

type Props = {
    isOpen: boolean
    onNextClick: () => void
}

export default function WrongAnswerBanner(props: Props) {
    return (
        <div
            className={cn(
                "border overflow-hidden opacity-0 h-0 ease-in flex py-5 px-20 transition-all border-red-200 bg-[#FFE5E5] fixed w-full bottom-0",
                { "h-[140px] opacity-100": props.isOpen }
            )}
        >
            <div className="flex items-center">
                <div className="h-[90px] flex items-center justify-center w-[90px] bg-white border border-[#FF4B4B]/20 rounded-full">
                    <X className="stroke-[5] ml-1 h-14 w-14 stroke-[#FF4B4B]/80" />
                </div>
                <div>
                    <p className="text-xl ml-4 font-bold text-[#FF4B4B]">
                        Wrong answer!
                    </p>
                    <ReportQuiz
                        quizId={""} //TODO change this
                        quizType="question-answer"
                        disabled={!props.isOpen}
                        className="text-base active:scale-95 opacity-90 font-semibold flex items-center gap-1 w-fit mt-2 text-[#FF4B4B]"
                    />
                </div>
            </div>
            <div className="flex ml-auto flex-col gap-4">
                <Button
                    onClick={props.onNextClick}
                    disabled={!props.isOpen}
                    className="ml-auto h-12 px-7 text-lg !font-bold my-auto"
                    variant={"red"}
                >
                    Continue
                </Button>
                <Button
                    disabled={!props.isOpen}
                    className="ml-auto  w-full  h-12 px-7 text-lg !font-bold my-auto"
                    variant={"blue"}
                >
                    Why ?
                </Button>
            </div>
        </div>
    )
}
