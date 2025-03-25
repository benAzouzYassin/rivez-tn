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
                    "group relative overflow-hidden  bg-white  border-neutral-200 mt-4 cursor-pointer w-full flex  items-center justify-between rounded-xl px-4 py-4 transition-all "
                )}
            >
                <h2
                    className={cn(
                        "text-lg font-bold -ml-3  flex   relative truncate  text-neutral-500"
                    )}
                >
                    <span className="max-w-[270px] truncate first-letter:uppercase">
                        {props.file.name}
                    </span>
                </h2>
                <ChevronDown
                    size={18}
                    className={cn(
                        "text-neutral-500 transition-transform min-w-5 stroke-[2.5]  min-h-5 duration-300",
                        {
                            "rotate-180": !isOpen,
                        }
                    )}
                />
                <div className="w-[95%] left-1  absolute bottom-4 bg-neutral-300 h-[2px]"></div>
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
                                        "py-7 transition-all max-w-[20rem]  border border-neutral-300 text-lg bg-white text-[#545454] hover:bg-neutral-100 font-extrabold rounded-xl shadow-none w-full justify-start px-4",
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
                                    <span className="max-w-[18rem] truncate">
                                        {shortTitle}
                                    </span>
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
