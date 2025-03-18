import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { Editor } from "@tiptap/react"
import { useState, useEffect } from "react"

interface Props {
    editor: Editor
}

export default function TextTypeSelector({ editor }: Props) {
    const [selectedLevel, setSelectedLevel] = useState("")

    const items = [
        {
            name: "Normal Text",
            value: "paragraph",
            className: "font-semibold text-base",
        },
        {
            name: "Heading 1",
            value: "heading-1",
            className:
                "font-extrabold text-3xl flex items-center justify-center !h-8",
        },
        {
            name: "Heading 2",
            value: "heading-2",
            className:
                "font-extrabold text-2xl flex items-center justify-center !h-8",
        },
        {
            name: "Heading 3",
            value: "heading-3",
            className:
                "font-bold text-xl flex items-center justify-center !h-8",
        },
        {
            name: "Heading 4",
            value: "heading-4",
            className:
                "font-bold text-lg flex items-center justify-center !h-8",
        },
        {
            name: "Heading 5",
            value: "heading-5",
            className:
                "font-semibold text-base flex items-center justify-center !h-8",
        },
        {
            name: "Heading 6",
            value: "heading-6",
            className:
                "font-semibold text-sm flex items-center justify-center !h-8",
        },
    ]

    const handleValueChange = (value: string) => {
        setSelectedLevel(items.find((item) => item.value === value)?.name || "")

        if (value === "paragraph") {
            editor.chain().focus().setParagraph().run()
        } else if (value.startsWith("heading-")) {
            const level = parseInt(value.split("-")[1]) as 1 | 2 | 3 | 4 | 5 | 6
            editor.chain().focus().toggleHeading({ level }).run()
        }
    }

    const getCurrentValue = () => {
        if (editor.isActive("heading", { level: 1 })) return "heading-1"
        if (editor.isActive("heading", { level: 2 })) return "heading-2"
        if (editor.isActive("heading", { level: 3 })) return "heading-3"
        if (editor.isActive("heading", { level: 4 })) return "heading-4"
        if (editor.isActive("heading", { level: 5 })) return "heading-5"
        if (editor.isActive("heading", { level: 6 })) return "heading-6"
        return "paragraph"
    }

    // useEffect to sync selectedLevel with editor state
    useEffect(() => {
        const updateSelectedLevel = () => {
            const currentValue = getCurrentValue()
            const currentItem = items.find(
                (item) => item.value === currentValue
            )
            if (currentItem) {
                setSelectedLevel(currentItem.name)
            }
        }

        updateSelectedLevel()
        if (editor) {
            editor.on("selectionUpdate", updateSelectedLevel)
            editor.on("update", updateSelectedLevel)
        }

        return () => {
            if (editor) {
                editor.off("selectionUpdate", updateSelectedLevel)
                editor.off("update", updateSelectedLevel)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor])

    return (
        <div className="h-8">
            <Select value={getCurrentValue()} onValueChange={handleValueChange}>
                <SelectTrigger className="h-8 w-36 focus:border-neutral-300 focus:ring-neutral-200/50 rounded-md hover:bg-neutral-100 border-1">
                    {selectedLevel ? selectedLevel : "Aa"}
                </SelectTrigger>
                <SelectContent className="p-2" align="center">
                    {items.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                            className="rounded-xl h-fit"
                        >
                            <div className={item.className}>{item.name}</div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
