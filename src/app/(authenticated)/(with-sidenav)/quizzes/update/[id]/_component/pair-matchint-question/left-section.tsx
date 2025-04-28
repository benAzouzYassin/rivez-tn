import useUpdateQuizStore, { StateMatchingPairsOptions } from "../../store"
import AddOptionButton from "./add-question-button"
import LeftOption from "./left-option"

type Props = {
    leftOptions: StateMatchingPairsOptions["leftOptions"] | undefined
}
export default function LeftSection(props: Props) {
    const addOption = useUpdateQuizStore((s) => s.addMatchingPairsOption)
    const selectedQuestionId = useUpdateQuizStore(
        (s) => s.selectedQuestionLocalId
    )

    if (!selectedQuestionId) {
        return null
    }
    return (
        <div className="flex flex-col min-h-72 p-4 rounded-xl border-neutral-300 dark:border-neutral-700 border gap-5 min-w-[300px] bg-white dark:bg-neutral-800 transition-colors">
            {props.leftOptions?.map((opt) => {
                return (
                    <LeftOption
                        text={opt.text}
                        key={opt.localId}
                        optionLocalId={opt.localId}
                        questionLocalId={selectedQuestionId}
                    />
                )
            })}
            <AddOptionButton onClick={() => addOption("left")} />
        </div>
    )
}
