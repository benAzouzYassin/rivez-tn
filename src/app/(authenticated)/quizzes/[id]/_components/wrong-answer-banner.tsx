import ReportQuiz from "@/components/shared/report-quiz"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { X } from "lucide-react"

type Props = {
    isOpen: boolean
    onNextClick: () => void
}

export default function WrongAnswerBanner(props: Props) {
    return (
        <div
            className={cn(
                "border overflow-hidden opacity-0 h-0 translate-y-10 ease-in flex flex-col md:flex-row py-3 md:py-5 px-4 md:px-20 transition-all border-red-200 bg-[#FFE5E5] fixed w-full bottom-0",
                {
                    "h-auto md:h-[140px] opacity-100 translate-y-0":
                        props.isOpen,
                }
            )}
        >
            <div className="flex items-center">
                <div className="h-16 w-16 md:h-[90px] md:w-[90px] flex items-center justify-center bg-white border border-[#FF4B4B]/20 rounded-full">
                    <X className="stroke-5 ml-1 h-8 w-8 md:h-14 md:w-14 stroke-[#FF4B4B]/80" />
                </div>
                <div>
                    <p className="text-lg md:text-xl ml-4 font-bold text-[#FF4B4B]">
                        Wrong answer!
                    </p>
                    <ReportQuiz
                        quizId={""}
                        quizType="question-answer"
                        disabled={!props.isOpen}
                        className="text-sm md:text-base active:scale-95 opacity-90 font-semibold flex items-center gap-1 w-fit mt-2 text-[#FF4B4B]"
                    />
                </div>
            </div>
            <div className="flex mt-4 md:mt-0 md:ml-auto flex-col gap-4">
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
                    className="w-full z-50 md:w-auto md:ml-auto h-10 md:h-12 px-5 md:px-7 text-base md:text-lg font-bold my-auto"
                    variant={"red"}
                >
                    Continue
                </Button>
                {/* <Button
                disabled={!props.isOpen}
                className="w-full md:w-auto md:ml-auto h-10 md:h-12 px-5 md:px-7 text-base md:text-lg font-bold my-auto"
                variant={"blue"}
            >
                Why ?
            </Button> */}
            </div>
        </div>
    )
}
