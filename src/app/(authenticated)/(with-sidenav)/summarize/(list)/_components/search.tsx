"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    onSearchChange: (value: string) => void
    searchValue: string
}

export default function Search(props: Props) {
    const [inputValue, setInputValue] = useState("")

    const translation = useMemo(
        () => ({
            en: {
                Search: "Search",
            },
            fr: {
                Search: "Rechercher",
            },
            ar: {
                Search: "بحث",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    useEffect(() => {
        if (props.searchValue) {
            setInputValue((prev) => {
                if (prev !== props.searchValue) {
                    return props.searchValue
                }
                return prev
            })
        }
    }, [props.searchValue])

    return (
        <form
            className="relative"
            onSubmit={(e) => {
                e.preventDefault()
                props.onSearchChange(inputValue)
            }}
        >
            <SearchIcon className="absolute text-neutral-300 top-3 left-3" />
            <Input
                name="search"
                onChange={(e) => {
                    if (!e.target.value) {
                        props.onSearchChange("")
                    }
                    setInputValue(e.target.value)
                }}
                value={inputValue}
                placeholder={t["Search"]}
                type="text"
                className="min-w-[350px] pl-10 text-base font-semibold"
            />
        </form>
    )
}
