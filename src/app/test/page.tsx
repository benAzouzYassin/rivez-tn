"use client"
const RichTextEditor = dynamic(
    () => import("@/components/shared/rich-text-editor"),
    {
        ssr: false,
    }
)
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { JSONContent } from "@tiptap/react"
import dynamic from "next/dynamic"
export default function Page() {
    const [content, setContent] = useState<JSONContent | null>(null)
    const handleContent = () => {
        console.log(content)
    }
    return (
        <div>
            <div className="h-96 mb-12 p-10">
                <RichTextEditor
                    contentClassName="h-full"
                    containerClassName="h-full"
                    onChange={(c) => setContent(c)}
                />
            </div>

            <Button onClick={handleContent}>Click me</Button>
        </div>
    )
}
