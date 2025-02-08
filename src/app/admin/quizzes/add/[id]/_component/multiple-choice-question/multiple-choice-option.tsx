import { cn } from "@/lib/ui-utils"
import { useMemo, useState } from "react"
import CorrectToggleButton from "./correct-toggle-button"
import DeleteOption from "./delete-option"
import EditableOptionContent from "./option-text"

interface Props {
    index: number
}

function MultipleChoiceOption(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const placeholder = "..........................."
    // fixes rerenders bug
    const oneTimeDeleteButton = useMemo(
        () => (
            <DeleteOption
                endDeleting={() => setIsDeleting(false)}
                index={props.index}
                startDeleting={() => setIsDeleting(true)}
            />
        ),
        [setIsDeleting, props.index]
    )

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
            {oneTimeDeleteButton}
            <EditableOptionContent
                placeholder={placeholder}
                index={props.index}
            />
            <div className="absolute top-0 right-0 h-full w-[15%] flex items-center justify-center border-l">
                <CorrectToggleButton
                    placeholder={placeholder}
                    index={props.index}
                />
            </div>
        </div>
    )
}

export default MultipleChoiceOption
