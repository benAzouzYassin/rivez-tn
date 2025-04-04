import Dexie, { type EntityTable } from "dexie"

interface TContent {
    id: number
    pdfPages: string[]
}

const mindmapsContentDb = new Dexie("content-for-mindmaps") as Dexie & {
    content: EntityTable<TContent, "id">
}

mindmapsContentDb.version(1).stores({
    content: "++id, pdfPages",
})

export type { TContent as PdfContent }
export { mindmapsContentDb }
