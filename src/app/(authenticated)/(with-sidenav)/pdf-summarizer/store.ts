import { PDFDocumentProxy } from "pdfjs-dist"
import { create } from "zustand"

interface State {
    files: {
        localId: string
        file: PDFDocumentProxy
        name: string
        pages: {
            content: string
            localId: string
            index: number
            imageInBase64: string | null
        }[]
    }[]
    selectedFileLocalId: string | null
    selectedPagesLocalIds: string[]
    openPageLocalId: string | null
}

interface Actions {
    reset: () => void
    addFile: (file: State["files"][number]) => void
    deleteFile: (localId: string) => void
    setFiles: (data: State["files"]) => void
    setSelectedFileLocalId: (localId: string) => void
    getSelectedFile: () => State["files"][number] | undefined
    getFileByLocalId: (localId: string) => State["files"][number] | undefined
    selectPages: (localIds: string[]) => void
    unSelectPages: (localIds: string[]) => void
    setOpenPageLocalId: (localId: string | null) => void
    getPageContent: (localId: string) => string | undefined
    getSelectedPages: () => {
        name: string
        pages: { textContent: string; imageInBase64: string | null }[]
        id: string
    }[]
}

interface Store extends Actions, State {}
const initialState: State = {
    files: [],
    selectedFileLocalId: null,
    selectedPagesLocalIds: [],
    openPageLocalId: null,
}

export const usePdfSummarizerStore = create<Store>((set, get) => ({
    ...initialState,
    getPageContent: (localId) =>
        get()
            .files.flatMap((file) => file.pages)
            .find((page) => page.localId === localId)?.content,
    setOpenPageLocalId: (openPageLocalId) => set({ openPageLocalId }),
    selectPages: (localIds) =>
        set((s) => ({
            selectedPagesLocalIds: [...s.selectedPagesLocalIds, ...localIds],
        })),
    unSelectPages: (localIds) =>
        set((s) => ({
            selectedPagesLocalIds: s.selectedPagesLocalIds.filter(
                (currentId) => !localIds.includes(currentId)
            ),
        })),
    setFiles: (files) => set({ files }),
    getFileByLocalId: (localId) =>
        get().files.find((f) => f.localId === localId),
    getSelectedFile: () =>
        get().files.find((f) => f.localId === get().selectedFileLocalId),
    deleteFile: (localId) => {
        set((state) => {
            const updated = state.files.filter((f) => f.localId !== localId)
            return {
                files: updated,
                selectedFileLocalId:
                    state.selectedFileLocalId === localId
                        ? updated.at(0)?.localId
                        : state.selectedFileLocalId,
            }
        })
    },
    addFile: (file) => {
        set((state) => ({
            files: [...state.files, file],
        }))
    },
    setSelectedFileLocalId: (selectedFileLocalId) =>
        set({ selectedFileLocalId }),
    getSelectedPages: () => {
        const selectedPagesIds = get().selectedPagesLocalIds
        return get().files.reduce(
            (acc, current) => {
                const fileSelectedPages = current.pages.filter((page) =>
                    selectedPagesIds.includes(page.localId)
                )

                return [
                    ...acc,
                    {
                        id: current.localId,
                        name: current.name,
                        pages: fileSelectedPages.map((p) => ({
                            textContent: p.content,
                            imageInBase64: p.imageInBase64,
                        })),
                    },
                ]
            },
            [] as {
                name: string
                pages: {
                    imageInBase64: string | null
                    textContent: string
                }[]
                id: string
            }[]
        )
    },
    reset: () => set(initialState),
}))
