"use client"

import { cn } from "@/lib/ui-utils"
import { Moon, Monitor, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import Cookies from "js-cookie"
import { useEffect, useState, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { getLanguage } from "@/utils/get-language"

const themes = [
    { label: "Light", value: "light", icon: SunMedium },
    { label: "Dark", value: "dark", icon: Moon },
    { label: "System", value: "system", icon: Monitor },
]

export function ThemeMenuItem({
    isRTL,
    asDialog = false,
    close,
}: {
    isRTL: boolean
    asDialog?: boolean
    close?: () => void
}) {
    const { setTheme } = useTheme()
    const [theme, setThemeState] = useState(themes[2])
    const [isOpen, setIsOpen] = useState(false)

    const translation = useMemo(
        () => ({
            en: {
                theme: "Theme",
                light: "Light",
                dark: "Dark",
                system: "System",
            },
            fr: {
                theme: "Thème",
                light: "Clair",
                dark: "Sombre",
                system: "Système",
            },
            ar: {
                theme: "المظهر",
                light: "فاتح",
                dark: "داكن",
                system: "النظام",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const translatedThemes = useMemo(
        () =>
            themes.map((th) => ({
                ...th,
                label:
                    th.value === "light"
                        ? t.light
                        : th.value === "dark"
                        ? t.dark
                        : t.system,
            })),
        [t]
    )

    useEffect(() => {
        const selected = Cookies.get("selected-theme")
        const savedTheme = translatedThemes.find((t) => t.value === selected)
        if (savedTheme) setThemeState(savedTheme)
        else setThemeState(translatedThemes[2])
    }, [lang, translatedThemes])

    const handleThemeChange = (themeOption: (typeof themes)[number]) => {
        setThemeState(themeOption)
        Cookies.set("selected-theme", themeOption.value)
        setTheme(themeOption.value)
        setIsOpen(false)
        close?.()
    }

    if (asDialog) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        className={cn(
                            "flex min-w-72 group relative grow  cursor-pointer text-neutral-500  dark:text-neutral-300 items-center gap-3 px-4 py-3 text-base font-bold",
                            "transition-colors hover:bg-blue-100/70 hover:text-blue-400 active:bg-blue-200/70",
                            { "flex-row-reverse": isRTL }
                        )}
                    >
                        <theme.icon className="w-6 h-6 opacity-70" />
                        <span className={cn({ "lg:mr-auto": isRTL })}>
                            {t.theme}
                        </span>
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.theme}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-1 py-2">
                        {translatedThemes.map((themeOption) => {
                            const Icon = themeOption.icon
                            return (
                                <DialogClose asChild key={themeOption.value}>
                                    <button
                                        className={cn(
                                            "flex items-center w-full p-3 rounded-md cursor-pointer hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-colors",
                                            {
                                                "flex-row-reverse": isRTL,
                                                "bg-blue-50 dark:bg-blue-900/20":
                                                    theme.value ===
                                                    themeOption.value,
                                            }
                                        )}
                                        onClick={() =>
                                            handleThemeChange(themeOption)
                                        }
                                    >
                                        <Icon className="h-6 w-6 mr-3 text-neutral-500 dark:text-neutral-300" />
                                        <span
                                            className={cn(
                                                "font-medium dark:text-neutral-200",
                                                { "ml-0 mr-3": isRTL }
                                            )}
                                        >
                                            {themeOption.label}
                                        </span>
                                        {theme.value === themeOption.value && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={cn(
                                                    "h-5 w-5 text-blue-500",
                                                    {
                                                        "mr-auto": isRTL,
                                                        "ml-auto": !isRTL,
                                                    }
                                                )}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </DialogClose>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    // For desktop popover
    return (
        <div
            className={cn(
                "group relative text-neutral-500 dark:text-neutral-300 w-full cursor-pointer items-center gap-3 px-4 py-3 text-base font-bold transition-colors hover:bg-blue-100/70 dark:hover:bg-blue-900/40 hover:text-blue-400 active:bg-blue-200/70 dark:active:bg-blue-900/60 flex",
                { "flex-row-reverse": isRTL }
            )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <theme.icon className="w-6 h-6 opacity-70" />
            <span className={cn({ "mr-auto": isRTL })}>{t.theme}</span>
            {isOpen && (
                <div
                    className={cn("absolute z-50 w-64 h-auto top-0", {
                        "-left-64": !isRTL,
                        "-right-64": isRTL,
                    })}
                >
                    <div className="rounded-2xl overflow-hidden border-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 mt-0">
                        {translatedThemes.map((themeOption) => {
                            const Icon = themeOption.icon
                            return (
                                <div
                                    key={themeOption.value}
                                    className={cn(
                                        "flex items-center active:scale-95 transition-all h-12 border-t-2 border-neutral-100 dark:border-neutral-800 px-6 w-full cursor-pointer hover:bg-blue-100/70 dark:hover:bg-blue-900/40",
                                        {
                                            "flex-row-reverse justify-between":
                                                isRTL,
                                        }
                                    )}
                                    onClick={() =>
                                        handleThemeChange(themeOption)
                                    }
                                >
                                    <Icon className="h-5 w-5 mr-2 text-neutral-500 dark:text-neutral-300" />
                                    <span
                                        className={cn(
                                            "text-sm font-bold text-neutral-600 dark:text-neutral-200 ml-1",
                                            { "ml-0 mr-1": isRTL }
                                        )}
                                    >
                                        {themeOption.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
