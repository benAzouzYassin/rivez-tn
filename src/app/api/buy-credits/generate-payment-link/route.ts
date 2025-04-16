import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const isProduction = process.env.NODE_ENV === "production"
const BASE_URL = isProduction
    ? "https://dashboard.sandbox.konnect.network"
    : "https://dashboard.sandbox.konnect.network"
const COOKIES_STRING = process.env.KONNECT_COOKIES_STRING as string
const CREDITS_FOR_10_DINARS = 500
const ALLOWED_LINKS_PER_10_MINUTE = 5

export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token") || ""
        const refreshToken = req.headers.get("refresh-token") || ""
        const userId = await getUserInServerSide({ accessToken, refreshToken })
        if (!userId) {
            return NextResponse.json(
                {
                    error: "this feature is available for authenticated users only",
                },
                { status: 403 }
            )
        }
        // const userId = "63130b20-03fc-43c5-b690-a17b01911234"

        // Rate limiting: Check how many payment links the user has created in the last 10 minutes
        const supabase = await supabaseAdminServerSide()
        const tenMinutesAgo = new Date(
            Date.now() - 10 * 60 * 1000
        ).toISOString()

        const { count: lastPaymentsCount } = await supabase
            .from("payments")
            .select("*", { count: "exact", head: false })
            .eq("user_id", userId)
            .gte("created_at", tenMinutesAgo)
        if (typeof lastPaymentsCount !== "number") {
            throw new Error("lastPaymentsCount is not a number")
        }
        if (lastPaymentsCount >= ALLOWED_LINKS_PER_10_MINUTE) {
            return NextResponse.json(
                {
                    error: `Rate limit exceeded. You can only create ${ALLOWED_LINKS_PER_10_MINUTE} payment links every 10 minutes.`,
                },
                { status: 429 }
            )
        }

        // payments logic
        const body = await req.json()
        const { data, error: zodError } = bodySchema.safeParse(body)
        if (!data) {
            return NextResponse.json(zodError, { status: 400 })
        }
        const now = new Date()
        const orderId = `${userId}/${now.getTime()}`
        const priceToPay = (
            (data.credits / CREDITS_FOR_10_DINARS) *
            10000
        ).toFixed(3)
        const formData = new URLSearchParams()
        const successUrl = new URL(data.successEndpoint)
        successUrl.searchParams.append("user_id", userId)
        successUrl.searchParams.append("order_id", orderId)
        const failUrl = new URL(data.failEndpoint)
        failUrl.searchParams.append("user_id", userId)
        failUrl.searchParams.append("order_id", orderId)
        formData.append("__rvfInternalFormId", "createPaymentLink")
        formData.append("type", "immediate")
        formData.append("packId", "")
        formData.append("intent", "createPaymentLink")
        formData.append("amount", String(priceToPay)) //price in millimes
        formData.append("token", "TND")
        formData.append("expirationDate", "")
        formData.append("acceptedPaymentMethods", "bank_card")
        formData.append("acceptedPaymentMethods", "wallet")
        formData.append("acceptedPaymentMethods", "e-DINAR")
        formData.append("addPaymentFeesToAmount", "false")
        formData.append("checkoutForm", "false")
        formData.append("isThanksMessageEnabled", "true")
        formData.append("successUrl", successUrl.toString())
        formData.append("failUrl", failUrl.toString())
        formData.append("orderId", orderId)

        const response = await fetch(
            BASE_URL +
                "/admin/payment-link?_data=routes%2Fadmin%2F%28organisations%29%2F%28%24organisationId%29%2Fpayment-link%2Findex",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Host: "dashboard.sandbox.konnect.network",
                    "User-Agent":
                        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0",
                    Accept: "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    Referer: isProduction
                        ? "https://dashboard.sandbox.konnect.network/admin/payment-link"
                        : "https://dashboard.sandbox.konnect.network/admin/payment-link",
                    Origin: isProduction
                        ? "https://dashboard.sandbox.konnect.network"
                        : "https://dashboard.sandbox.konnect.network",
                    Connection: "keep-alive",
                    Cookie: COOKIES_STRING,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    Priority: "u=4",
                    TE: "trailers",
                },
                body: formData.toString(),
            }
        )
        const link = new URL(
            response.headers.get("x-remix-redirect") as string,
            "https://example.com"
        ).searchParams.get("link")
        const result = await supabase
            .from("payments")
            .insert({
                credit_count: data.credits,
                currency_symbol: "TND",
                paid_amount: 0,
                status: "PENDING",
                updated_at: now.toISOString(),
                created_at: now.toISOString(),
                user_id: userId,
                payment_link: link || "",
                price_to_pay: Number(priceToPay),
                order_id: orderId,
            })
            .select("id")
            .throwOnError()
        const paymentId = result.data[0].id

        return NextResponse.json({ link, paymentId })
    } catch (error) {
        console.error("payment link generation error", error)
        return NextResponse.json(
            { error: "something went wrong" },
            { status: 500 }
        )
    }
}

const bodySchema = z.object({
    credits: z.number(),
    successEndpoint: z.string(),
    failEndpoint: z.string(),
})

export type TGeneratePaymentLink = z.infer<typeof bodySchema>
