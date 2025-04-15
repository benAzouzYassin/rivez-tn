import { NextRequest, NextResponse } from "next/server"

export function POST(req: NextRequest) {
    const body = req.json()
    console.log(body)
    return NextResponse.json({ success: true })
}
export function GET(req: NextRequest) {
    console.log("body")
    return NextResponse.json({ success: true })
}
