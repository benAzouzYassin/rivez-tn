import Cookies from "js-cookie"
export const availableLanguages = ["en", "ar", "fr"] as const
type TLanguage = (typeof availableLanguages)[number]

export function useLanguage(): TLanguage {
    const defaultLang = "fr"
    const selectedLanguage = Cookies.get("selected-language")
    return selectedLanguage &&
        availableLanguages.includes(selectedLanguage as any)
        ? (selectedLanguage as TLanguage)
        : defaultLang
}
