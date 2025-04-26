import { OPS, PDFDocumentProxy } from "pdfjs-dist"

export async function getImageData(
    file: PDFDocumentProxy,
    pageIndex: number,
    timeoutMs: number = 2000
) {
    return Promise.race([
        (async () => {
            try {
                const page = await file.getPage(pageIndex)
                const ops = await page.getOperatorList()
                let result = null as {
                    width: number
                    height: number
                    bitmap: ImageBitmap
                } | null
                for (let i = 0; i < ops.fnArray.length; i++) {
                    if (ops.fnArray[i] === OPS.paintImageXObject) {
                        const imageName = ops.argsArray[i][0]
                        const imageData = (await new Promise(
                            (resolve, reject) => {
                                page.objs.get(
                                    imageName,
                                    (data: {
                                        width: number
                                        height: number
                                        bitmap: ImageBitmap
                                    }) => {
                                        if (
                                            data.width > 500 &&
                                            data.height > 500
                                        ) {
                                            resolve(data)
                                        } else {
                                            resolve(null)
                                        }
                                    }
                                )
                            }
                        )) as {
                            width: number
                            height: number
                            bitmap: ImageBitmap
                        } | null
                        if (imageData) {
                            result = imageData
                            break
                        }
                    }
                }

                return result as {
                    width: number
                    height: number
                    bitmap: ImageBitmap
                }
            } catch (err) {
                console.error(err)
                return null
            }
        })(),

        new Promise<null>((resolve) => {
            setTimeout(() => {
                resolve(null)
            }, timeoutMs)
        }),
    ])
}
