import axios from "axios"
import { readCurrentSession } from "../users/read"
import { TGeneratePaymentLink } from "@/app/api/buy-credits/generate-payment-link/route"

export async function generatePaymentLink({ credits }: { credits: number }) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const body: TGeneratePaymentLink = {
        credits,
        failEndpoint: window.location.origin + "/api/buy-credits/success",
        successEndpoint: window.location.origin + "/api/buy-credits/fail",
    }
    const response = await axios.post(
        "/api/buy-credits/generate-payment-link",
        body,
        {
            headers: {
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
    const link = response?.data?.link
    if (!link) {
        throw new Error("payment link is undefined")
    }
    return link as string
}
