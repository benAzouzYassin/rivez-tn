import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/ui-utils"
import { ChevronDown, Files, FileText, FolderOpen } from "lucide-react"
import { useState } from "react"

export default function SideItem(props: {
    setActivePage: (active: { fileId: string; pageIndex: number }) => void
    activePage: { fileId: string; pageIndex: number }
    file: {
        id: string
        name: string
        markdownPages: string[]
    }
}) {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger
                className={cn(
                    "group relative overflow-hidden max-w-82 bg-white border border-neutral-200 mt-4 cursor-pointer w-full flex mb-2 items-center justify-between rounded-xl px-4 py-4 transition-all ",
                    {
                        "bg-neutral-300/40 border-neutral-400/50 border-2":
                            isOpen,
                    }
                )}
            >
                <div className="flex gap-3 items-center  max-w-[90%]">
                    <div
                        className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-300 text-neutral-500 transition-colors",
                            { "bg-neutral-200": isOpen }
                        )}
                    >
                        <Files size={18} />
                    </div>
                    <h2
                        className={cn(
                            "text-lg first-letter:uppercase max-w-[80%] relative truncate font-semibold text-neutral-500",
                            {
                                "  font-bold": isOpen,
                            }
                        )}
                    >
                        {props.file.name}
                        <span className="w-full h-[1px] rounded-full bg-neutral-300 absolute bottom-0 left-0"></span>
                    </h2>
                </div>
                <ChevronDown
                    size={18}
                    className={cn(
                        "text-neutral-500 transition-transform duration-300",
                        {
                            "rotate-180": !isOpen,
                        }
                    )}
                />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <ul className="space-y-2">
                    {props.file.markdownPages.map((page, index) => {
                        const shortTitle = generateShortTitle(
                            page,
                            index
                        ).replace("#", "")

                        return (
                            <li key={index}>
                                <Button
                                    onClick={() =>
                                        props.setActivePage({
                                            fileId: props.file.id,
                                            pageIndex: index,
                                        })
                                    }
                                    className={cn(
                                        "py-7 transition-all border border-neutral-300 text-lg bg-white text-[#545454] hover:bg-neutral-100 font-extrabold rounded-xl shadow-none w-full justify-start px-4",
                                        {
                                            "bg-[#D3EEFA]/50 text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2":
                                                props.activePage.fileId ===
                                                    props.file.id &&
                                                index ===
                                                    props.activePage.pageIndex,
                                        }
                                    )}
                                >
                                    <FileText className="min-w-6 text-neutral-400 min-h-6" />
                                    <span className="mr-2">{index + 1}.</span>{" "}
                                    {shortTitle}
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}
function generateShortTitle(page: string, index: number): string {
    const title =
        page?.split("\n")?.[0]?.replace?.("# ", "") || `Page ${index + 1}`

    if (index === 0) {
        return "Overview"
    } else if (title.includes(":")) {
        return title.split(":")[1].trim()
    } else if (title.length > 20) {
        return title.substring(0, 20) + "..."
    } else {
        return title
    }
}
