export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                const base64String = reader.result.split(",")[1]
                resolve(base64String)
            } else {
                reject(new Error("FileReader result is not a string."))
            }
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export function calculateBase64FileSize(base64String: string) {
    try {
        if (!base64String) {
            return 0
        }

        const base64Length = base64String.length

        let padding = 0
        if (base64String.endsWith("==")) {
            padding = 2
        } else if (base64String.endsWith("=")) {
            padding = 1
        }

        const approximateSize = base64Length * (3 / 4) - padding

        return approximateSize
    } catch (error) {
        console.error("Error calculating base64 image size:", error)
        return 0
    }
}
