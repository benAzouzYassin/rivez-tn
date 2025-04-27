import Markdown from "@/components/shared/markdown"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import {
    ChevronLeft,
    ChevronRight,
    DownloadIcon,
    HelpCircle,
} from "lucide-react"
import { useRef, useState, useMemo } from "react"
import { useReactToPrint } from "react-to-print"
import SideItem from "./side-item"
import GenerateQuizDialog from "../../_components/generate-quiz-dialog"
import { containsArabic } from "@/utils/is-arabic"
import { getLanguage } from "@/utils/get-language"

interface Props {
    files: {
        id: string
        name: string
        markdownPages: string[]
    }[]
    isStreaming: boolean
}

export default function PagesViewer(props: Props) {
    const translation = useMemo(
        () => ({
            en: {
                Previous: "Previous",
                Next: "Next",
                Save: "Save",
                "Convert into Quiz": "Convert into Quiz",
            },
            ar: {
                Previous: "السابق",
                Next: "التالي",
                Save: "حفظ",
                "Convert into Quiz": "تحويل إلى اختبار",
            },
            fr: {
                Previous: "Précédent",
                Next: "Suivant",
                Save: "Enregistrer",
                "Convert into Quiz": "Convertir en quiz",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]
    const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false)
    const [isPrinting, setIsPrinting] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const [activePage, setActivePage] = useState({
        fileId: props.files?.[0]?.id,
        pageIndex: 0,
    })

    const activeFileIndex = props.files.findIndex(
        (file) => file.id === activePage.fileId
    )
    const activeFile = props.files[activeFileIndex] || props.files[0]
    const nextFile = props.files[activeFileIndex + 1] || undefined
    const prevFile = props.files[activeFileIndex - 1] || undefined

    const isLastFile = activeFileIndex === props.files.length - 1
    const isLastPageOfFile =
        activePage.pageIndex === activeFile.markdownPages.length - 1
    const isNextDisabled = isLastFile && isLastPageOfFile

    const isFirstFile = activeFileIndex === 0
    const isFirstPageOfFile = activePage.pageIndex === 0
    const isPreviousDisabled = isFirstFile && isFirstPageOfFile

    const handleNextPage = () => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        })

        if (isLastPageOfFile && !isLastFile) {
            setActivePage({
                fileId: props.files[activeFileIndex + 1].id,
                pageIndex: 0,
            })
        } else {
            setActivePage({
                ...activePage,
                pageIndex: activePage.pageIndex + 1,
            })
        }
    }

    const handlePreviousPage = () => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        })

        if (isFirstPageOfFile && !isFirstFile) {
            const previousFile = props.files[activeFileIndex - 1]
            setActivePage({
                fileId: previousFile.id,
                pageIndex: previousFile.markdownPages.length - 1,
            })
        } else {
            setActivePage({
                ...activePage,
                pageIndex: activePage.pageIndex - 1,
            })
        }
    }

    function ShadowFileItem() {
        return (
            <div
                className={cn(
                    "h-16 mt-3    transition-all animate-pulse  cursor-not-allowed flex border border-neutral-200 text-lg  from-neutral-100 text-[#545454] hover:bg-neutral-100 font-extrabold rounded-xl shadow-none w-full justify-start px-4"
                )}
            >
                <p className="my-auto ml-3 rounded-sm h-3 w-[90%] bg-neutral-200"></p>
            </div>
        )
    }

    const markdownRef = useRef<HTMLDivElement>(null)

    const reactToPrintFn = useReactToPrint({
        contentRef: markdownRef,
        documentTitle: "summary-of-" + props.files.map((f) => f.name).join("+"),
        onAfterPrint: () => {
            setIsPrinting(false)
        },
    })

    const handleConvertToQuiz = async () => {
        setIsQuizDialogOpen(true)
    }

    const isRTL = containsArabic(activeFile.markdownPages.join(" "))

    return (
        <div dir={"ltr"} className="flex h-[89vh] overflow-hidden bg-gray-50">
            <div className="xl:w-[360px] w-0 h-[95vh] overflow-y-hidden fixed pb-20 bg-white">
                <ScrollArea className="w-full scale-x-[-1] xl:block hidden h-[95vh] -mt-1 border overflow-y-auto py-4">
                    <div className="scale-x-[-1] pl-5 pr-3 pb-20 pt-5">
                        {props.files.map((file) => (
                            <SideItem
                                key={file.id}
                                file={file}
                                setActivePage={setActivePage}
                                activePage={activePage}
                            />
                        ))}
                        {props.isStreaming && (
                            <>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <ShadowFileItem key={index} />
                                ))}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className={"xl:w-[21.5rem] xl:min-w-[21.5rem]"}></div>
            <div
                className={cn(
                    " md:max-w-[100%] max-w-screen flex-1 xl:max-w-[calc(100%-21.5rem)] xl:pl-4 relative"
                )}
            >
                <div className="w-screen"></div>

                <div
                    ref={contentRef}
                    className="bg-white md:p-5 p-2  rounded-lg h-[90vh]  overflow-y-auto pb-20 -mt-1 pt-8 border mx-auto"
                >
                    <div
                        className={cn(
                            "md:flex hidden print:hidden  -mb-6  justify-end gap-2",
                            {
                                "justify-start -mb-3": isRTL,
                            }
                        )}
                    >
                        <Button
                            variant={"secondary"}
                            isLoading={isPrinting}
                            onClick={() => {
                                setIsPrinting(true)
                                wait(100).then(() => {
                                    reactToPrintFn()
                                })
                            }}
                        >
                            {t["Save"]}{" "}
                            <DownloadIcon className={isRTL ? "mr-1" : "ml-1"} />
                        </Button>
                        <Button onClick={handleConvertToQuiz} variant={"blue"}>
                            {t["Convert into Quiz"]}{" "}
                            <HelpCircle className={isRTL ? "mr-1" : "ml-1"} />
                        </Button>
                    </div>
                    <div
                        ref={markdownRef}
                        className="print:px-10 md:mt-0 -mt-10  relative "
                    >
                        {isPrinting ? (
                            props.files.map((file) =>
                                file.markdownPages.map((page, i) => (
                                    <Markdown content={page} key={i} />
                                ))
                            )
                        ) : (
                            <Markdown
                                content={
                                    activeFile.markdownPages[
                                        activePage.pageIndex
                                    ]
                                }
                            />
                        )}

                        <div className="print:hidden flex border-t-2 pt-3 justify-between mb-4">
                            <Button
                                variant={"secondary"}
                                onClick={handlePreviousPage}
                                className="text-base h-11 px-4 rounded-xl"
                                disabled={isPreviousDisabled}
                            >
                                <ChevronLeft
                                    className={`min-w-5 min-h-5 ${
                                        isRTL ? "-ml-1" : "-mr-1"
                                    } stroke-3`}
                                />
                                {t["Previous"]}
                            </Button>

                            <Button
                                onClick={handleNextPage}
                                disabled={isNextDisabled}
                                className="text-base h-11 px-6 rounded-xl"
                            >
                                {t["Next"]}{" "}
                                <ChevronRight
                                    className={`min-w-5 min-h-5 ${
                                        isRTL ? "-mr-2" : "-ml-2"
                                    } stroke-3`}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <GenerateQuizDialog
                content={JSON.stringify(props.files)}
                isOpen={isQuizDialogOpen}
                onOpenChange={setIsQuizDialogOpen}
            />
        </div>
    )
}
