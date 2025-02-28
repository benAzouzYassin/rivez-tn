"use client"
import CodePlayground from "@/components/shared/code-playground/code-playground"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { SaveAll, SparklesIcon } from "lucide-react"
type Props = {
    theme: string
    onThemeChange: (theme: string) => void
    selectedTabId: string
    onSelectedTabChange: (id: string) => void
    tabs: {
        name: string
        code: string
        localId: string
        type: string
    }[]
    setTabs: (tabs: Props["tabs"]) => void
    className?: string
}
export default function CodeSnippets({
    onSelectedTabChange,
    onThemeChange,
    selectedTabId,
    setTabs,
    tabs,
    theme,
    className,
}: Props) {
    return (
        <>
            <div className="  -mt-10 items-center">
                <div className="w-[700px] mx-auto">
                    <CodePlayground
                        className={className}
                        onAdd={(tab) => {
                            setTabs([...tabs, tab])
                        }}
                        theme={theme as any}
                        onThemeChange={onThemeChange}
                        onCodeChange={(code) => {
                            setTabs(
                                tabs.map((t) => {
                                    if (t.localId === selectedTabId) {
                                        return { ...t, code }
                                    }
                                    return t
                                })
                            )
                        }}
                        onSelectedTabChange={onSelectedTabChange}
                        selectedTabId={selectedTabId}
                        onTabRemove={(id) =>
                            setTabs(tabs.filter((t) => t.localId !== id))
                        }
                        tabs={tabs}
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 px-10">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant={"blue"}
                                className="text-lg h-14 mt-3 max-w-[650px] mx-auto w-full font-bold"
                            >
                                Generate with ai
                                <SparklesIcon className="!w-5 !h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <DialogDescription></DialogDescription>
                            <DialogContent className="gap-0 p-7 sm:min-w-[600px]">
                                <form
                                    className="flex flex-col"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <Textarea
                                        className="text-lg h-32 placeholder:font-semibold font-bold "
                                        placeholder="What code you want the ai to write for you..."
                                    />
                                    <Button className="text-base ml-auto">
                                        Generate
                                        <SparklesIcon className="!w-5 !h-5" />
                                    </Button>
                                </form>
                            </DialogContent>
                        </DialogContent>
                    </Dialog>
                    <Button className="text-lg mt-3 max-w-[650px] mx-auto h-14 w-full font-bold">
                        Save Snippets
                        <SaveAll className="!w-5 !h-5" />
                    </Button>
                </div>
            </div>
        </>
    )
}
