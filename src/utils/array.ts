export const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)

    if (set1.size !== set2.size) return false
    return Array.from(set1).every((item) => set2.has(item))
}
export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ]
    }
    return shuffledArray
}
