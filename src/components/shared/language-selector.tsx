/* eslint-disable @next/next/no-img-element */
"use client"

import { cn } from "@/lib/ui-utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

const languages = [
    { label: "English", value: "en", flag: "/flags/usa.svg" },
    { label: "العربية", value: "ar", flag: "/flags/palestine.svg" },
    { label: "Français", value: "fr", flag: "/flags/france.svg" },
]
type Props = {
    className?: string
}
export function LanguageSelector(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [language, setLanguage] = useState({
        label: "English",
        value: "en",
        flag: "/flags/usa.svg",
    })

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className={cn(
                        "px-3 font-bold text-neutral-400 h-10 text-sm",
                        props.className
                    )}
                >
                    {language.label}
                    <img
                        alt=""
                        className="rounded-sm h-5"
                        src={language.flag}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mt-0 rounded-none border-none overflow-visible shadow-none bg-transparent !p-0">
                <div className="rounded-2xl mt-1 overflow-hidden border-2 bg-white   pt-3">
                    <div className="font-semibold text-neutral-400 text-lg pb-3 px-6">
                        Languages
                    </div>
                    <div className="border-t">
                        {languages.map((lang) => (
                            <button
                                key={lang.value}
                                className={cn(
                                    "flex items-center active:scale-95 transition-all  h-12 border-t px-6 w-full cursor-pointer   hover:bg-blue-100/70 "
                                )}
                                onClick={() => {
                                    setLanguage(lang)
                                    setIsOpen(false)
                                }}
                            >
                                <img
                                    alt={lang.label}
                                    className="rounded-sm h-5 w-5 mr-2"
                                    src={lang.flag}
                                />
                                <span
                                    className={cn(
                                        "text-sm font-semibold text-neutral-600 ml-1"
                                    )}
                                >
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
