import { NextRequest, NextResponse } from "next/server"

export function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const websiteOrigin = searchParams.get("website_origin") as string | null
    return NextResponse.redirect(`${websiteOrigin}/payments/fail`)
}
