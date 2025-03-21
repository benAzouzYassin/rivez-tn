"use client"
import CodePlayground from "@/components/shared/code-playground/code-playground"
import { Button } from "@/components/ui/button"
import { SaveAll } from "lucide-react"
import GenerateSnippets from "./generate-snippets"
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
    onSave: (shouldClose: boolean) => void
}
export default function CodeSnippets({
    onSelectedTabChange,
    onThemeChange,
    selectedTabId,
    setTabs,
    tabs,
    theme,
    className,
    onSave,
}: Props) {
    return (
        <>
            <div className="  -mt-10 items-center">
                <div className="w-[700px] mx-auto">
                    <CodePlayground
                        onTabRename={(id, newName, fileType) => {
                            setTabs(
                                tabs.map((t) => {
                                    if (t.localId === id) {
                                        return {
                                            ...t,
                                            name: newName,
                                            type: fileType,
                                        }
                                    }
                                    return t
                                })
                            )
                        }}
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
                    <GenerateSnippets setCodeSnippets={setTabs} />
                    <Button
                        onClick={() => onSave(true)}
                        className="text-lg mt-3 max-w-[650px] mx-auto h-14 w-full font-bold"
                    >
                        Save Snippets
                        <SaveAll className="!w-5 !h-5" />
                    </Button>
                </div>
            </div>
        </>
    )
}
