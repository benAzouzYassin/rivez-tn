import ReportQuiz from "@/components/shared/report-quiz"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { Check } from "lucide-react"
type Props = {
    isOpen: boolean
    onNextClick: () => void
}
export default function CorrectAnswerBanner(props: Props) {
    return (
        <div
            className={cn(
                " border overflow-hidden opacity-0  h-0 ease-in  flex py-5 px-20  transition-all border-green-200 bg-[#D2FFCC] fixed w-full  bottom-0",
                { "h-[140px] opacity-100": props.isOpen }
            )}
        >
            {" "}
            <div className="flex items-center">
                <div className="h-[90px] flex items-center justify-center w-[90px] bg-white  border border-[#47cd35]/20  rounded-full">
                    <Check className="stroke-5 ml-1 h-14 w-14 stroke-[#58A700]/80" />
                </div>
                <div>
                    <p className="text-xl ml-4 font-bold text-[#58A700]">
                        Correct answer !{" "}
                    </p>
                    <ReportQuiz
                        quizId="" //TODO change this
                        quizType="question-answer"
                        disabled={!props.isOpen}
                        className="text-base   active:scale-95 opacity-90  font-semibold flex items-center gap-1  w-fit  mt-2 text-[#58A700]"
                    />
                </div>
            </div>
            <Button
                onClick={props.onNextClick}
                disabled={!props.isOpen}
                className="ml-auto h-12 px-7 text-lg font-bold!   my-auto "
                variant={"green"}
            >
                Continue
            </Button>
        </div>
    )
}
