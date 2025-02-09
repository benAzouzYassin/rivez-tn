import useQuizStore, { MatchingPairsOptions } from "../../store"
import AddOptionButton from "./add-question-button"
import RightOption from "./right-option"

type Props = {
    rightOptions: MatchingPairsOptions["rightOptions"] | undefined
    leftOptions: MatchingPairsOptions["leftOptions"] | undefined
}
export default function RightSection(props: Props) {
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const addOption = useQuizStore((s) => s.addMatchingPairsOption)

    if (!selectedQuestionId) {
        return null
    }
    return (
        <div className=" gap-5 flex flex-col min-w-[600px] p-4 rounded-xl border-neutral-300 border min-h-72">
            {props.rightOptions?.map((opt) => {
                return (
                    <RightOption
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
