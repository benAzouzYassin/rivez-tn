import useUpdateQuizStore, { StateMatchingPairsOptions } from "../../store"
import AddOptionButton from "./add-question-button"
import RightOption from "./right-option"

type Props = {
    rightOptions: StateMatchingPairsOptions["rightOptions"] | undefined
    notSelectedLeftOptions: StateMatchingPairsOptions["leftOptions"] | undefined
    leftOptions: StateMatchingPairsOptions["leftOptions"] | undefined
}

export default function RightSection(props: Props) {
    const selectedQuestionId = useUpdateQuizStore(
        (s) => s.selectedQuestionLocalId
    )
    const addOption = useUpdateQuizStore((s) => s.addMatchingPairsOption)

    if (!selectedQuestionId) {
        return null
    }
    return (
        <div
            className="
                gap-5 flex flex-col min-w-[600px] p-4 rounded-xl
                border border-neutral-300 dark:border-neutral-700
                bg-white dark:bg-neutral-800
                min-h-72
            "
        >
            {props.rightOptions?.map((opt) => {
                return (
                    <RightOption
                        notSelectedLeftOptions={
                            props.notSelectedLeftOptions || []
                        }
                        leftOptions={props.leftOptions || []}
                        selectedLeftOption={opt.leftOptionLocalId}
                        text={opt.text}
                        key={opt.localId}
                        optionLocalId={opt.localId}
                        questionLocalId={selectedQuestionId}
                    />
                )
            })}
            <AddOptionButton
                onClick={() => addOption("right")}
                className="w-full"
            />
        </div>
    )
}
