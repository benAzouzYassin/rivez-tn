import Content from "./_components/content"
import { french } from "./translations/french"
import { headers } from "next/headers"
import { cookies } from "next/headers"
import { english } from "./translations/english"
import { arabic } from "./translations/arabic"
import { getPreferredLanguage } from "@/utils/languages"
async function Page() {
    const reqCookies = await cookies()
    const reqHeaders = await headers()
    const selectedLanguage = reqCookies.get("selected-language")?.value
    let language = ""
    if (!selectedLanguage) {
        language = getPreferredLanguage(
            reqHeaders.get("accept-language") as string
        )
    } else {
        language = selectedLanguage
    }
    let translation = english
    if (language === "fr") {
        translation = french
    } else if (language === "ar") {
        translation = arabic
    }

    return (
        <Content
            currentLang={language}
            shouldSaveLang={!selectedLanguage}
            translation={translation}
        />
    )
}

export default Page
