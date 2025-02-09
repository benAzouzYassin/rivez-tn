import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { memo, useState } from "react"
import DeleteOption from "../delete-option"
import OptionText from "./option-text"
import useQuizStore from "../../store"

interface Props {
    questionLocalId: string
    optionLocalId: string
    text: string
}

function LeftOption(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const updateOption = useQuizStore((s) => s.updateMatchingPairsOption)
    const deleteOption = useQuizStore((s) => s.deleteMatchingPairsOption)
    return (
        <div
            className={cn(
                "bg-white hover:bg-neutral-50 min-h-20 flex items-center pl-6 shadow-[0px_4px_0px_0px] shadow-[#E5E5E5] rounded-2xl text-neutral-700 border-2 transition-colors",
                "relative group transform transition-all duration-300 ease-in-out",
                {
                    "opacity-0 scale-95 -translate-y-2": isDeleting,
                    "opacity-100 scale-100 translate-y-0": !isDeleting,
                }
            )}
        >
            <DeleteOption
                onClick={() => {
                    wait(250).then(() => {
                        deleteOption("left", props.optionLocalId)
                    })
                    setIsDeleting(true)
                }}
            />
            <div className="pr-3">
                <OptionText
                    text={props?.text || ""}
                    onChange={(value) => {
                        updateOption({
                            optionId: props.optionLocalId,
                            side: "left",
                            value,
                        })
                    }}
                />
            </div>
        </div>
    )
}

export default memo(LeftOption)
