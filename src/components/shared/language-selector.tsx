"use client"

import { cn } from "@/lib/ui-utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

const languages = [
    { label: "العربية", value: "ar", flag: "/flags/palestine.svg" },
    { label: "English", value: "en", flag: "/flags/usa.svg" },
    { label: "Français", value: "fr", flag: "/flags/france.svg" },
]
type Props = {
    className?: string
}
export function LanguageSelector(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [language, setLanguage] = useState<(typeof languages)[number]>()
    useEffect(() => {
        const selected = Cookies.get("selected-language")
        const lang = languages.find((l) => l.value === selected)
        if (lang) {
            setLanguage(lang)
        }
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className={cn(
                        "px-3 font-bold rounded-xl text-neutral-400 h-10 text-sm",
                        props.className
                    )}
                >
                    {language?.label ? (
                        <img
                            alt=""
                            className="rounded-sm h-5"
                            src={language.flag}
                        />
                    ) : (
                        <div className="w-7 h-5 bg-neutral-200" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mt-0 rounded-none border-none overflow-visible shadow-none bg-transparent p-0!">
                <div className="rounded-2xl mt-1 overflow-hidden border-2 bg-white   pt-3">
                    <div className="font-bold text-neutral-400 text-lg pb-3 px-6">
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
                                    Cookies.set("selected-language", lang.value)
                                    window.location.reload()
                                }}
                            >
                                <img
                                    alt={lang.label}
                                    className="rounded-sm h-5 w-5 mr-2"
                                    src={lang.flag}
                                />
                                <span
                                    className={cn(
                                        "text-sm font-bold text-neutral-600 ml-1"
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
