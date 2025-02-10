import useQuizStore, { MatchingPairsOptions } from "../../store"
import AddOptionButton from "./add-question-button"
import LeftOption from "./left-option"

type Props = {
    leftOptions: MatchingPairsOptions["leftOptions"] | undefined
}
export default function LeftSection(props: Props) {
    const addOption = useQuizStore((s) => s.addMatchingPairsOption)
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)

    if (!selectedQuestionId) {
        return null
    }
    return (
        <div className="flex  flex-col min-h-72 p-4 rounded-xl border-neutral-300 border gap-5 min-w-[300px] ">
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
