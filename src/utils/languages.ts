export function getPreferredLanguage(
    header: string
): (typeof acceptedLanguages)[number] {
    const languages = header.split(",").map((lang) => {
        const [code, q] = lang.trim().split(";q=")
        return {
            code: code.split("-")[0],
            q: q ? parseFloat(q) : 1.0,
        }
    })

    languages.sort((a, b) => b.q - a.q)
    for (const lang of languages) {
        if (acceptedLanguages.includes(lang.code)) {
            return lang.code
        }
    }

    return "en"
}
const acceptedLanguages = ["ar", "en", "fr"]
