import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { memo, useState } from "react"
import DeleteOption from "../delete-option"
import OptionText from "./option-text"
import useUpdateQuizStore from "../../store"

interface Props {
    questionLocalId: string
    optionLocalId: string
    text: string
}

function LeftOption(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const updateOption = useUpdateQuizStore((s) => s.updateMatchingPairsOption)
    const deleteOption = useUpdateQuizStore((s) => s.deleteMatchingPairsOption)
    return (
        <div
            className={cn(
                "bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 min-h-20 flex items-center pl-6 shadow-[0px_4px_0px_0px] shadow-[#E5E5E5] dark:shadow-none rounded-2xl text-neutral-700 dark:text-neutral-200 border-2 border-neutral-200 dark:border-neutral-700 transition-colors",
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
