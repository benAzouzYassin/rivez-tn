export const getRightOptionPairLocalId = (
    correctOptions: string[][],
    leftOptions: { text: string; localId: string }[],
    rightOpt: string
) => {
    const pair = correctOptions?.find((item) =>
        item.includes(rightOpt)
    ) as string[]
    const leftOption = pair?.filter((item) => item !== rightOpt)[0]
    if (!leftOption || !pair) {
        return null
    }
    return (
        leftOptions?.find((item) => item.text === leftOption)?.localId || null
    )
}
