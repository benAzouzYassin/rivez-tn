import { NextResponse } from "next/server"

export function GET() {
    return NextResponse.json("failed")
}

// TODO redirect the user into the fail page
