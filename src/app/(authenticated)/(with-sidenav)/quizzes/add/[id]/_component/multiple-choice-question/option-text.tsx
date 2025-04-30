import { memo } from "react"
import useQuizStore from "../../store"

interface Props {
    optionLocalId: string
    questionLocalId: string
    text: string
}

function OptionText(props: Props) {
    const updateOption = useQuizStore(
        (s) => s.updateMultipleChoiceQuestionOption
    )

    return (
        <input
            onChange={(e) => {
                updateOption(
                    { text: e.target.value || "" },
                    props.questionLocalId,
                    props.optionLocalId
                )
            }}
            value={props?.text || ""}
            placeholder={"........"}
            className={
                "font-extrabold grow max-w-[calc(100%-80px)] focus-within:outline-none text-xl"
            }
        />
    )
}

export default memo(OptionText)
