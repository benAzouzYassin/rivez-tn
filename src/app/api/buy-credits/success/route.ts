import { NextRequest, NextResponse } from "next/server"

export function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)

    // Access specific search parameters
    const query = searchParams.get("query")
    const page = searchParams.get("page")

    return NextResponse.json({})
}
