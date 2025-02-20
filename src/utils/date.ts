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

export function formatSeconds(s: number) {
    const seconds = Number(s.toFixed(0) || 0)
    const hours = Number(Math.floor(seconds / 3600).toFixed(0))
    const minutes = Number((Math.floor(seconds % 3600) / 60).toFixed(0))
    const remainingSeconds = Number((seconds % 60).toFixed(0))

    const padding = (num: number): string => num.toString().padStart(2, "0")

    if (hours > 0) {
        return `${padding(hours)}:${padding(minutes)}:${padding(
            remainingSeconds
        )}`
    }
    return `${padding(minutes)}:${padding(remainingSeconds)}`
}
