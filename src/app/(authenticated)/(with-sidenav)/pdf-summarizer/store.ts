import { PDFDocumentProxy } from "pdfjs-dist"
import { create } from "zustand"

interface State {
    files: {
        localId: string
        file: PDFDocumentProxy
        name: string
        pages: { content: string; localId: string }[]
    }[]
    selectedFileLocalId: string | null
    selectedPagesLocalIds: string[]
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
}

type Store = Actions & State
const initialState: State = {
    files: [],
    selectedFileLocalId: null,
    selectedPagesLocalIds: [],
}

export const usePdfSummarizerStore = create<Store>((set, get) => ({
    ...initialState,
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
    addFile: (file) =>
        set((state) => ({
            files: [...state.files, file],
        })),
    setSelectedFileLocalId: (selectedFileLocalId) =>
        set({ selectedFileLocalId }),
    reset: () => set(initialState),
}))
