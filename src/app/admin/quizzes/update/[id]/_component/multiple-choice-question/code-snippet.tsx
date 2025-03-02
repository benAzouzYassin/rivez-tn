import CodePlayground from "@/components/shared/code-playground/code-playground"
import { memo, useEffect, useState } from "react"
import useQuizStore from "../../store"

interface Props {
    selectedQuestionId: string
    isReadonly?: boolean
}
function CodeSnippets({ selectedQuestionId, isReadonly }: Props) {
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    const getQuestion = useQuizStore((s) => s.getQuestion)
    const [theme, setTheme] = useState("monokaiOneDarkVivid")
    const [selectedTab, setSelectedTab] = useState("1")
    const [codeSnippets, setCodeSnippets] = useState<
        {
            name: string
            code: string
            localId: string
            type: string
        }[]
    >([])

    useEffect(() => {
        setCodeSnippets(getQuestion(selectedQuestionId)?.codeSnippets || [])
    }, [getQuestion, selectedQuestionId])

    return (
        <CodePlayground
            onTabRename={(id, newName, filetype) => {
                if (isReadonly) {
                    return
                }
                setCodeSnippets(
                    codeSnippets.map((t) => {
                        if (t.localId === id) {
                            return { ...t, name: newName, type: filetype }
                        }
                        return t
                    })
                )
            }}
            className={""}
            onAdd={(tab) => {
                if (isReadonly) {
                    return
                }
                const updated = [...codeSnippets, tab]
                setCodeSnippets(updated)
                updateQuestion({ codeSnippets: updated }, selectedQuestionId)
            }}
            theme={theme as any}
            onThemeChange={setTheme}
            onCodeChange={(code) => {
                if (isReadonly) {
                    return
                }
                const updated = codeSnippets.map((t) => {
                    if (t.localId === selectedTab) {
                        return {
                            ...t,
                            code,
                        }
                    }
                    return t
                })
                setCodeSnippets(updated)
                updateQuestion({ codeSnippets: updated }, selectedQuestionId)
            }}
            onSelectedTabChange={setSelectedTab}
            selectedTabId={selectedTab}
            onTabRemove={(id) => {
                if (isReadonly) {
                    return
                }
                const updated = codeSnippets.filter((t) => t.localId !== id)
                setCodeSnippets(updated)
                updateQuestion({ codeSnippets: updated }, selectedQuestionId)
            }}
            tabs={codeSnippets}
            isReadonly={isReadonly}
        />
    )
}
export default memo(CodeSnippets)
