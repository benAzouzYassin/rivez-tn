"use client"

import AnimatedLoader from "@/components/ui/animated-loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import { cn } from "@/lib/ui-utils"
import { SearchIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { usePdfSummarizerStore } from "../store"
import FileItem from "./file-item"
import PageCard from "./page-card"
import SummarizeSelectedBtn from "./summarize-selected-btn"
import { getLanguage } from "@/utils/get-language"

export default function PagesSelection() {
    const isSmallScreen = useIsSmallScreen()
    const files = usePdfSummarizerStore((s) => s.files)

    const reset = usePdfSummarizerStore((s) => s.reset)
    const selectedLocalId = usePdfSummarizerStore((s) => s.selectedFileLocalId)
    const setSelected = usePdfSummarizerStore((s) => s.setSelectedFileLocalId)
    const selectedPages = usePdfSummarizerStore((s) => s.selectedPagesLocalIds)
    const selectPages = usePdfSummarizerStore((s) => s.selectPages)
    const unSelectPages = usePdfSummarizerStore((s) => s.unSelectPages)
    const [searchQuery, setSearchQuery] = useState("")
    const translation = useMemo(
        () => ({
            en: {
                "selected page": "selected page",
                Cancel: "Cancel",
                Search: "Search",
                "No file selected": "No file selected",
            },
            ar: {
                "selected page": "صفحة مختارة",
                Cancel: "إلغاء",
                Search: "بحث",
                "No file selected": "لم يتم اختيار ملف",
            },
            fr: {
                "selected page": "page sélectionnée",
                Cancel: "Annuler",
                Search: "Rechercher",
                "No file selected": "Aucun fichier sélectionné",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang] || translation.en

    const selectedFile = useMemo(() => {
        return files.find((f) => f.localId === selectedLocalId)
    }, [files, selectedLocalId])

    const isFilePagesSelected = useMemo(() => {
        const currentFilePages = selectedFile?.pages.map((p) => p.localId)
        const isAllSelected = currentFilePages?.every((pageId) =>
            selectedPages?.includes(pageId)
        )
        return isAllSelected
    }, [selectedFile?.pages, selectedPages])

    const filteredPages = useMemo(() => {
        if (!selectedFile) return []
        if (!searchQuery.trim()) return selectedFile.pages
        return selectedFile.pages.filter((page) => {
            return page.content
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        })
    }, [selectedFile, searchQuery])

    useEffect(() => {
        const firstFileLocalId = files?.[0]?.localId
        if (!selectedLocalId && firstFileLocalId) {
            setSelected(firstFileLocalId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSelected, files])

    const numColumns = files.length > 1 ? 3 : 4
    const totalItems = filteredPages.length
    const totalRows = Math.ceil(totalItems / numColumns)

    const handlePageSelection = (isPageSelected: boolean, localId: string) => {
        if (isPageSelected) {
            selectPages([localId])
        } else {
            unSelectPages([localId])
        }
    }

    const handleCheckbox = (value: boolean) => {
        if (value) {
            selectPages(
                selectedFile?.pages
                    .filter((p) => !selectedPages.includes(p.localId))
                    .map((p) => p.localId) || []
            )
        } else {
            unSelectPages(selectedFile?.pages.map((p) => p.localId) || [])
        }
    }

    const isRtl = lang === "ar"
    if (isSmallScreen) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <AnimatedLoader />
            </div>
        )
    }

    return (
        <div dir="ltr" className="rounded-2xl relative !overflow-y-hidden">
            <div
                className={cn(
                    "relative !overflow-y-hidden h-[calc(103vh-110px)] p-2 min-w-[70vw]",
                    {
                        "grid grid-cols-18": files.length > 1,
                    }
                )}
            >
                {files.length > 1 && (
                    <div className="pr-2 relative border-r h-[calc(103vh-120px)] pb-20 pt-10 col-span-6 xl:col-span-4">
                        <div className="relative !h-[calc(103vh-160px)]">
                            <ScrollArea className="gap-2 !h-[calc(90vh-130px)] overflow-y-auto scale-x-[-1]">
                                <div className="flex flex-col py-2 gap-3 scale-x-[-1]">
                                    {files.map((f) => (
                                        <FileItem
                                            isSelected={
                                                f.localId === selectedLocalId
                                            }
                                            pagesIds={f.pages.map(
                                                (p) => p.localId
                                            )}
                                            localId={f.localId}
                                            name={f.name}
                                            key={f.localId}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                )}
                <div
                    dir={isRtl ? "rtl" : "ltr"}
                    className="col-span-12 xl:col-span-14"
                >
                    <div
                        className={cn(
                            "px-4 mt-5 overflow-y-hidden transition-all h-24"
                        )}
                    >
                        <div className="h-20 text-lg text-neutral-600 border-neutral-200 font-bold flex items-center justify-between px-4 border rounded-2xl w-full">
                            <div className="flex items-center">
                                <Checkbox
                                    id="selected-pages-checkbox"
                                    checked={isFilePagesSelected}
                                    onCheckedChange={handleCheckbox}
                                    className="ltr:mr-2 rtl:ml-2 w-6 h-6"
                                />{" "}
                                <label
                                    className="cursor-pointer"
                                    htmlFor="selected-pages-checkbox"
                                >
                                    {selectedPages.length} {t["selected page"]}
                                </label>
                            </div>
                            <div className="xl:scale-100 scale-90 flex flex-nowrap items-center">
                                <Button
                                    onClick={reset}
                                    className="text-lg text-neutral-600 font-bold ltr:mr-2 rtl:ml-2 h-[44px]"
                                    variant={"secondary"}
                                >
                                    {t.Cancel}
                                </Button>
                                <SummarizeSelectedBtn
                                    selectedPagesCount={selectedPages.length}
                                    disabled={selectedPages.length < 1}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pl-4 rtl:-translate-x-3 relative -mt-1 h-fit w-[350px]">
                        <SearchIcon className="absolute text-neutral-300 top-3 left-6" />
                        <Input
                            className="pl-9 font-semibold text-lg w-[350px]"
                            placeholder={t.Search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="pl-4 pr-2 pb-10 pt-1 border-t h-[calc(103vh-283px)]">
                        {selectedFile ? (
                            <Virtuoso
                                className="pb-20"
                                style={{ height: "calc(95vh - 250px)" }}
                                totalCount={totalRows}
                                overscan={10}
                                itemContent={(rowIndex) => (
                                    <div
                                        className={cn(
                                            "grid grid-cols-2 2xl:grid-cols-4  gap-5 py-2",
                                            {
                                                "2xl:grid-cols-3 ":
                                                    files.length > 1,
                                            }
                                        )}
                                    >
                                        {Array.from({ length: numColumns }).map(
                                            (_, colIndex) => {
                                                const pageIndex =
                                                    rowIndex * numColumns +
                                                    colIndex
                                                const page =
                                                    filteredPages[pageIndex]
                                                if (!page) return null

                                                return (
                                                    <PageCard
                                                        isSelected={selectedPages.includes(
                                                            page.localId
                                                        )}
                                                        onSelectChange={(
                                                            value
                                                        ) =>
                                                            handlePageSelection(
                                                                value,
                                                                page.localId
                                                            )
                                                        }
                                                        index={page.index}
                                                        pageLocalId={
                                                            page.localId
                                                        }
                                                        pdfLocalId={
                                                            selectedFile.localId
                                                        }
                                                        key={page.localId}
                                                    />
                                                )
                                            }
                                        )}
                                    </div>
                                )}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-neutral-500">
                                    {t["No file selected"]}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
