"use client"

import { TGeneratedMindmap } from "@/data-access/mindmaps/constants"
import { generateMindMapFromText } from "@/data-access/mindmaps/generate"
import { toastError } from "@/lib/toasts"
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs"
import { useEffect, useState } from "react"

export default function Page() {
    const [items, setItems] = useState<TGeneratedMindmap | null>(null)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [topic] = useQueryState("topic", parseAsString)
    const [language] = useQueryState("language", parseAsString)
    const [additionalInstructions] = useQueryState(
        "additionalInstructions",
        parseAsString
    )
    const [shouldGenerate, setShouldGenerate] = useQueryState(
        "shouldGenerate",
        parseAsBoolean.withDefault(false)
    )
    const [contentType] = useQueryState("contentType")

    useEffect(() => {
        if (!shouldGenerate) return
        if (!contentType) return setIsError(true)
        if (!topic) return setIsError(true)
        if (shouldGenerate === true) {
            let didGenerate = false
            setShouldGenerate(false)
            setIsLoading(true)
            const onChange = (data: TGeneratedMindmap) => {
                if (!didGenerate) didGenerate = true
                try {
                    setItems(data)
                } catch {}
            }

            const onStreamEnd = () => {
                setIsLoading(false)
                if (!didGenerate) {
                    setIsError(true)
                    toastError("Something went wrong")

                    // handleRefund().catch(console.error)
                }
            }
            generateMindMapFromText(
                {
                    topic,
                    language,
                    additionalInstructions,
                },
                onChange,
                onStreamEnd
            ).catch((err) => {
                toastError("Something went wrong")
            })
        }
    }, [
        topic,
        language,
        additionalInstructions,
        shouldGenerate,
        setShouldGenerate,
        contentType,
    ])
    console.log(items)
    return <section>{isLoading ? "Loading..." : "Finished loading."}</section>
}
