import { NextRequest, NextResponse } from "next/server"

export function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)

    // Access specific search parameters
    const query = searchParams.get("query")
    const page = searchParams.get("page")

    return NextResponse.json({})
}

// TODO extract the payment ref + other user_id + order_id from the url
// TODO use the isPaymentCompleted function to determine if the payments actually payed
// TODO add the credits to the user account and redirect him into the success page
