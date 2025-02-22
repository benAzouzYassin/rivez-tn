import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { message: "this endpoint is not ready yet." },
        {
            status: 500,
        }
    )
}
