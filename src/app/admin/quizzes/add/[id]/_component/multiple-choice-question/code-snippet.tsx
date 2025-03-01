import CodePlayground from "@/components/shared/code-playground/code-playground"
import { memo, useEffect, useState } from "react"
import useQuizStore from "../../store"

interface Props {
    selectedQuestionId: string
}
function CodeSnippets({ selectedQuestionId }: Props) {
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    const getQuestion = useQuizStore((s) => s.getQuestion)
    const [theme, setTheme] = useState("monokaiOneDarkVivid")
    const [selectedTab, setSelectedTab] = useState("1")
    const [codeSnippets, setCodeSnippets] = useState([
        {
            name: "hello.ts",
            code: 'console.log("hello world")',
            localId: "1",
            type: "typescript",
        },
    ])

    useEffect(() => {
        setCodeSnippets(getQuestion(selectedQuestionId)?.codeSnippets || [])
    }, [getQuestion, selectedQuestionId])

    return (
        <CodePlayground
            onTabRename={(id, newName) => {
                setCodeSnippets(
                    codeSnippets.map((t) => {
                        if (t.localId === id) {
                            return { ...t, name: newName }
                        }
                        return t
                    })
                )
            }}
            className={""}
            onAdd={(tab) => {
                const updated = [...codeSnippets, tab]
                setCodeSnippets(updated)
                updateQuestion({ codeSnippets: updated }, selectedQuestionId)
            }}
            theme={theme as any}
            onThemeChange={setTheme}
            onCodeChange={(code) => {
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
                const updated = codeSnippets.filter((t) => t.localId !== id)
                setCodeSnippets(updated)
                updateQuestion({ codeSnippets: updated }, selectedQuestionId)
            }}
            tabs={codeSnippets}
        />
    )
}
export default memo(CodeSnippets)
