import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { cn } from "@/lib/ui-utils"
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react"
import { useState } from "react"

interface CodeBlockComponentProps {
    node: {
        attrs: {
            language: string
        }
    }
    updateAttributes: (attrs: { language: string }) => void
    extension: {
        options: {
            lowlight: {
                listLanguages: () => string[]
            }
        }
    }
}

const CodeBlockComponent = ({
    node,
    updateAttributes,
    extension,
}: CodeBlockComponentProps) => {
    const [selectedLanguage, setSelectedLanguage] = useState(
        node.attrs.language || "TS"
    )

    const languages = extension.options.lowlight.listLanguages()

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value)
        updateAttributes({ language: value })
    }

    return (
        <NodeViewWrapper className="code-block relative group">
            <div
                contentEditable={false}
                className="absolute right-2 top-2 z-10 opacity-100 transition-opacity"
            >
                <Select
                    defaultValue="TS"
                    value={selectedLanguage || "TS"}
                    onValueChange={handleLanguageChange}
                >
                    <SelectTrigger
                        isDarkMode
                        className="h-10 w-20 uppercase 100 !opacity-100 text-xs"
                    >
                        {selectedLanguage}
                    </SelectTrigger>
                    <SelectContent isDarkMode className="">
                        {languages.map((language) => (
                            <SelectItem
                                isDarkMode
                                key={language}
                                value={language}
                                className=""
                            >
                                {language}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <pre
                className={cn(
                    `language-${selectedLanguage}`,
                    "rounded-md bg-gray-900 py-4 px-4 pt-8"
                )}
            >
                <NodeViewContent as="code" className="text-gray-300" />
            </pre>
        </NodeViewWrapper>
    )
}

export default CodeBlockComponent
