export const readStream = async (
    streamReader: ReadableStreamDefaultReader,
    onRead: (chunk: string) => void,
    onFinish?: () => void
) => {
    const decoder = new TextDecoder()
    while (true) {
        const { done, value } = await streamReader?.read?.()
        if (done) {
            onFinish?.()
            break
        }
        onRead(decoder.decode(value, { stream: true }))
    }
}
