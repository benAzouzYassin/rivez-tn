import Dexie, { type EntityTable } from "dexie"

interface TContent {
    id: number
    pdfPages: string[]
    imagesInBase64: string[]
}

const mindmapsContentDb = new Dexie("content-for-mindmaps") as Dexie & {
    content: EntityTable<TContent, "id">
}

mindmapsContentDb.version(1).stores({
    content: "++id, pdfPages, imagesInBase64",
})

export type { TContent as PdfContent }
export { mindmapsContentDb }
