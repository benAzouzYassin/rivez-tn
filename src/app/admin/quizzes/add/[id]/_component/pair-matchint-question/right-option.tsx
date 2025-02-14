import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { memo, useState } from "react"
import useQuizStore, { MatchingPairsOptions } from "../../store"
import DeleteOption from "../delete-option"
import OptionText from "./option-text"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Props {
    questionLocalId: string
    optionLocalId: string
    text: string
    selectedLeftOption: string | null
    leftOptions: MatchingPairsOptions["leftOptions"] | undefined
    notSelectedLeftOptions: MatchingPairsOptions["leftOptions"] | undefined
}

function RightOption(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const deleteOption = useQuizStore((s) => s.deleteMatchingPairsOption)
    const updateOption = useQuizStore((s) => s.updateMatchingPairsOption)
    if (!selectedQuestionId) {
        return null
    }
    return (
        <div
            className={cn(
                "bg-white hover:bg-neutral-50 min-h-20 px-4 flex items-center pl-6 shadow-[0px_4px_0px_0px] shadow-[#E5E5E5] rounded-2xl text-neutral-700 border-2 transition-colors",
                "relative group transform transition-all duration-300 ease-in-out",
                {
                    "opacity-0 scale-95 -translate-y-2": isDeleting,
                    "opacity-100 scale-100 translate-y-0": !isDeleting,
                }
            )}
        >
            <div className="flex w-full  justify-between items-center ">
                <DeleteOption
                    onClick={() => {
                        wait(250).then(() => {
                            deleteOption("right", props.optionLocalId)
                        })
                        setIsDeleting(true)
                    }}
                />
                <OptionText
                    className=" grow pr-3"
                    text={props?.text || ""}
                    onChange={(value) => {
                        updateOption({
                            optionId: props.optionLocalId,
                            side: "right",
                            value,
                        })
                    }}
                />
                <div className="relative group ">
                    {props.selectedLeftOption && (
                        <button
                            onClick={() => {
                                updateOption({
                                    optionId: props.optionLocalId,
                                    side: "right",
                                    leftOptionLocalId: null,
                                })
                            }}
                            className="absolute rounded-full opacity-0 group-hover:opacity-100 top-1 bg-white cursor-pointer active:scale-90 transition-all -right-2"
                        >
                            <Badge className="  p-px " variant={"red"}>
                                <X className="h-4 scale-90 stroke-3 w-4" />
                            </Badge>
                        </button>
                    )}
                    <Select
                        value={props.selectedLeftOption || ""}
                        onValueChange={(value) => {
                            updateOption({
                                optionId: props.optionLocalId,
                                side: "right",
                                leftOptionLocalId: value,
                            })
                        }}
                    >
                        <SelectTrigger className="justify-end mt-3  ">
                            <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent align="center">
                            {props.leftOptions?.map((opt) => {
                                return (
                                    <SelectItem
                                        key={opt.localId}
                                        value={opt.localId}
                                        className={cn({
                                            hidden: !props.notSelectedLeftOptions
                                                ?.map((item) => item.localId)
                                                ?.includes(opt.localId),
                                        })}
                                    >
                                        {opt.text}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default memo(RightOption)
