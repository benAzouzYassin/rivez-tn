import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { isPaymentCompleted } from "./is-payment-completed"

export async function GET(request: NextRequest) {
    const supabase = await supabaseAdminServerSide()
    const { searchParams } = new URL(request.url)
    const paymentRef = searchParams.get("payment_ref")
    const userId = searchParams.get("user_id") as string | null
    const orderId = searchParams.get("order_id") as string | null
    const websiteOrigin = searchParams.get("website_origin") as string | null
    try {
        if (!userId || !orderId || !paymentRef || !websiteOrigin) {
            return NextResponse.redirect(`${websiteOrigin}/payments/fail`)
        }

        const isPayed = await isPaymentCompleted(paymentRef)
        if (!isPayed) {
            return NextResponse.redirect(`${websiteOrigin}/payments/fail`)
        }
        const payment = await supabase
            .from("payments")
            .select("status")
            .eq("user_id", userId)
            .eq("order_id", orderId)
            .single()
            .throwOnError()
        if (payment.data.status === "SUCCESS") {
            return NextResponse.redirect(`${websiteOrigin}/payments/fail`)
        }
        const { data } = await supabase
            .from("payments")
            .update({
                status: "SUCCESS",
                updated_at: new Date().toISOString(),
                payment_ref: paymentRef,
            })
            .eq("user_id", userId)
            .eq("order_id", orderId)
            .select("*")
            .throwOnError()
        const creditToAdd = data[0].credit_count
        try {
            await supabase
                .rpc("add_credits_to_user", {
                    credits: creditToAdd,
                    p_user_id: data[0].user_id,
                })
                .throwOnError()
        } catch (err) {
            console.error(err)
            await supabase
                .from("payment_errors")
                .insert({
                    cause: "rpc function call to add_credits_to_user failed",
                    order_id: orderId,
                    payment_ref: paymentRef,
                    user_id: userId,
                    error_text: JSON.stringify(err),
                })
                .throwOnError()
            return NextResponse.redirect(`${websiteOrigin}/payments/fail`)
        }

        return NextResponse.redirect(
            `${websiteOrigin}/payments/success?credits=${data[0].credit_count}`
        )
    } catch (error) {
        console.error(error)
        await supabase
            .from("payment_errors")
            .insert({
                cause: "something went wrong",
                order_id: orderId,
                payment_ref: paymentRef,
                user_id: userId,
                error_text: JSON.stringify(error),
            })
            .throwOnError()

        return NextResponse.redirect(`${websiteOrigin}/payments/fail`)
    }
}
