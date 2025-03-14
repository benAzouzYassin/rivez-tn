export const readStream = async (
    streamReader: ReadableStreamDefaultReader,
    onRead: (chunk: string) => void
) => {
    const decoder = new TextDecoder()
    while (true) {
        const { done, value } = await streamReader?.read?.()
        if (done) break
        onRead(decoder.decode(value, { stream: true }))
    }
}
