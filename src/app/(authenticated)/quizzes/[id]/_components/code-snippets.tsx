import CodePlayground from "@/components/shared/code-playground/code-playground"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import { memo, useState } from "react"

interface Props {
    snippets: MultipleChoiceContent["codeSnippets"]
}
function CodeSnippets({ snippets }: Props) {
    const [theme, setTheme] = useState("monokaiOneDarkVivid")
    const [selectedTab, setSelectedTab] = useState(snippets?.[0].localId)

    return (
        <CodePlayground
            onTabRename={() => {}}
            className={""}
            onAdd={() => {}}
            theme={theme as any}
            onThemeChange={setTheme}
            onCodeChange={() => {}}
            onSelectedTabChange={setSelectedTab}
            selectedTabId={selectedTab || ""}
            onTabRemove={(id) => {}}
            tabs={snippets || []}
        />
    )
}
export default memo(CodeSnippets)
