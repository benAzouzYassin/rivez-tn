import Markdown from "@/components/shared/markdown"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/ui-utils"
import {
    ChevronLeft,
    ChevronRight,
    Download,
    DownloadIcon,
    Loader2,
} from "lucide-react"
import { useRef, useState } from "react"
import SideItem from "./side-item"
import { useReactToPrint } from "react-to-print"
import { wait } from "@/utils/wait"

interface Props {
    files: {
        id: string
        name: string
        markdownPages: string[]
    }[]
    isStreaming: boolean
}

export default function PagesViewer(props: Props) {
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
    return (
        <div className="flex h-[89vh] overflow-hidden bg-gray-50">
            <div className="w-[360px] h-[95vh] overflow-y-hidden fixed pb-20 bg-white">
                <ScrollArea className="w-full scale-x-[-1] h-[95vh] -mt-1 border overflow-y-auto py-4">
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
            <div className="w-[21.5rem] min-w-[21.5rem]"></div>
            <div className="flex-1 max-w-[calc(100%-21.5rem)] pl-4 relative">
                <div className="w-screen"></div>
                <div
                    ref={contentRef}
                    className="bg-white p-5 rounded-lg h-[90vh]  overflow-y-auto pb-20 -mt-1 pt-8 border mx-auto"
                >
                    <div ref={markdownRef} className="print:px-10  relative ">
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
                    </div>
                    <div className="flex border-t-2 pt-3 justify-between mb-4">
                        <Button
                            variant={"secondary"}
                            onClick={handlePreviousPage}
                            className="text-base h-12 px-4 rounded-xl"
                            disabled={isPreviousDisabled}
                        >
                            <ChevronLeft className="min-w-5 min-h-5 -mr-1 stroke-3" />
                            Previous
                        </Button>

                        <Button
                            variant={"secondary"}
                            onClick={handleNextPage}
                            disabled={isNextDisabled}
                            className="text-base h-12 px-4 rounded-xl"
                        >
                            Next{" "}
                            <ChevronRight className="min-w-5 min-h-5 -ml-2 stroke-3" />
                        </Button>
                    </div>
                    <Button
                        isLoading={isPrinting}
                        onClick={() => {
                            setIsPrinting(true)
                            wait(100).then(() => {
                                reactToPrintFn()
                            })
                        }}
                        className=" "
                        variant={"secondary"}
                    >
                        Save <DownloadIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}
