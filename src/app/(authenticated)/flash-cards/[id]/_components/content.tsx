import { cn } from "@/lib/ui-utils"
import { XIcon } from "lucide-react"
import { useState } from "react"

export default function Content() {
    const [isAnswerOpen, setIsAnswerOpen] = useState(false)
    const isWithImage = true
    return (
        <div className="w-full min-h-[24rem] overflow-hidden relative border-2 mt-4 rounded-2xl p-4">
            {isWithImage ? (
                <ContentWithImage onRevealClick={() => setIsAnswerOpen(true)} />
            ) : (
                <ContentWithoutImage
                    onRevealClick={() => setIsAnswerOpen(true)}
                />
            )}

            <div
                className={cn(
                    "absolute duration-200 ease-in-out transition-transform bg-neutral-50 bottom-0 w-full flex flex-col p-4  left-0   border-x border-t-2 rounded-2xl  ",
                    {
                        "h-[28rem]": isWithImage,
                        "h-[28.6rem]": !isWithImage,
                        "translate-y-0": isAnswerOpen,
                        "translate-y-[28.7rem]": !isAnswerOpen && !isWithImage,
                        "translate-y-[28.6rem]": !isAnswerOpen && isWithImage,
                    }
                )}
            >
                <button
                    onClick={() => setIsAnswerOpen(false)}
                    className="absolute top-6 right-5 text-neutral-400 hover:text-red-500 cursor-pointer transition-all active:scale-90 "
                >
                    <XIcon className="stroke-[2.5] " />
                </button>
                <button
                    onClick={() => setIsAnswerOpen(false)}
                    className="h-10 pb-10 active:scale-95 transition-all mt-auto cursor-pointer  text-neutral-500 text-center text-xl font-bold underline-offset-4 underline"
                >
                    Click here to close
                </button>
            </div>
        </div>
    )
}

function ContentWithImage(props: { onRevealClick: () => void }) {
    return (
        <div className="flex pb-5  flex-col h-[28.5rem]  ">
            <p className="w-full pt-4 text-xl font-semibold text-gray-400  text-center">
                Normal difficulty
            </p>
            <h2 className="text-center text-neutral-600 pt-7 font-extrabold text-5xl">
                What is react ?{" "}
            </h2>
            <div className="mt-8 h-64 mx-auto rounded-2xl border w-[60%]"></div>
            <button
                onClick={props.onRevealClick}
                className="h-10  active:scale-95 transition-all cursor-pointer mt-8 text-blue-600 text-center text-xl font-bold underline-offset-4 underline"
            >
                Click here to Reveal the Answer
            </button>
        </div>
    )
}
function ContentWithoutImage(props: { onRevealClick: () => void }) {
    return (
        <div className="flex pb-5  flex-col h-[28.5rem]  ">
            <p className="w-full pt-4 text-xl font-semibold text-gray-400  text-center">
                Normal difficulty
            </p>
            <h2 className="text-center text-neutral-600 pt-28 font-extrabold text-5xl">
                What is react ?{" "}
            </h2>
            <button
                onClick={props.onRevealClick}
                className="h-10 active:scale-95 transition-all mt-auto cursor-pointer  text-blue-600 text-center text-xl font-bold underline-offset-4 underline"
            >
                Click here to Reveal the Answer
            </button>
        </div>
    )
}
