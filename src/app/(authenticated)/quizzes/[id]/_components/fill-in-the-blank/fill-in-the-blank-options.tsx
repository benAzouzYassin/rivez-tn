import { memo } from "react"
import FillInTheBlankItem from "./fill-in-the-blank-item"

interface Props {
    options: { text: string; id: number }[]
}

function FillInTheBlankOptions(props: Props) {
    return (
        <>
            {props.options.map((opt, index) => (
                <FillInTheBlankItem
                    id={opt.id}
                    text={opt.text}
                    key={opt + String(index)}
                />
            ))}
        </>
    )
}

export default memo(FillInTheBlankOptions)
