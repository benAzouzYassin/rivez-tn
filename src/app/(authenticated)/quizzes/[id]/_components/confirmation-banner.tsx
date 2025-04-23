import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { getLanguage } from "@/utils/get-language"
import { wait } from "@/utils/wait"
import { useMemo } from "react"

type Props = {
    isOpen: boolean
    onSkip: () => void
    onConfirm: () => void
    actionType: "confirm" | "skip"
}

export default function ConfirmationBanner(props: Props) {
    const translation = useMemo(
        () => ({
            en: { "Skip question": "Skip question", Confirm: "Confirm" },
            ar: { "Skip question": "تخطي السؤال", Confirm: "تأكيد" },
            fr: { "Skip question": "Passer la question", Confirm: "Confirmer" },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    return (
        <div
            className={cn(
                "border-2 overflow-hidden opacity-0 h-0 ease-in flex py-5 px-2 md:px-20 translate-y-10 transition-all border-neutral-200/80 bg-white fixed w-full bottom-0",
                { "h-[100px] opacity-100 translate-y-0": props.isOpen }
            )}
        >
            {" "}
            <div className="ml-auto relative">
                <Button
                    onClick={() => {
                        wait(100).then(() =>
                            window.scroll({
                                behavior: "smooth",
                                top: 0,
                            })
                        )
                        props.onSkip()
                    }}
                    disabled={!props.isOpen}
                    className={cn(
                        "h-12 px-7 opacity-0 translate-y-20 text-neutral-500 font-extrabold! my-auto",
                        {
                            "opacity-100 -translate-y-0":
                                props.actionType === "skip",
                        }
                    )}
                    variant={"secondary"}
                >
                    {t["Skip question"]}
                </Button>
                <Button
                    onClick={() => {
                        props.onConfirm()
                    }}
                    disabled={!props.isOpen}
                    className={cn(
                        "h-12 translate-y-20 absolute right-0 opacity-100 px-12 text-base font-extrabold! my-auto",
                        {
                            "translate-y-0 opacity-100":
                                props.actionType === "confirm",
                        }
                    )}
                    variant={"blue"}
                >
                    {t["Confirm"]}
                </Button>
            </div>
        </div>
    )
}
