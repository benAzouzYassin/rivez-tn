export function negativeToZero(n: number) {
    if (n < 0) {
        return 0
    }
    return n
}

export function customToFixed(num: number | undefined, digits = 0) {
    if (num === undefined) return undefined
    digits = Math.floor(digits)

    if (digits < 0 || digits > 20) {
        throw new RangeError("digits must be between 0 and 20")
    }
    const [firstPart, secondPart] = num.toString().split(".")
    const second = secondPart ? `.${secondPart?.substring?.(0, digits)}` : ""
    return firstPart + second
}
