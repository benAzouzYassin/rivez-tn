type DateFormat = "short" | "medium" | "long"

type FormatOptions = {
    format?: DateFormat
    includeTime?: boolean
}

export function formatDate(
    dateStr: string | undefined,
    options?: FormatOptions
): string {
    if (!dateStr) {
        return ""
    }
    const date = new Date(dateStr)
    const locale = navigator.language || "en-US"

    const dateFormats: Record<DateFormat, Intl.DateTimeFormatOptions> = {
        short: { year: "2-digit", month: "2-digit", day: "2-digit" },
        medium: { year: "numeric", month: "short", day: "2-digit" },
        long: { year: "numeric", month: "long", day: "2-digit" },
    }

    const timeOptions: Intl.DateTimeFormatOptions = options?.includeTime
        ? { hour: "2-digit", minute: "2-digit", second: "2-digit" }
        : {}

    return new Intl.DateTimeFormat(locale, {
        ...dateFormats[options?.format ?? "long"],
        ...timeOptions,
    }).format(date)
}
