const isProduction = process.env.NODE_ENV === "production"

const BASE_URL = isProduction
    ? "https://dashboard.sandbox.konnect.network"
    : "https://dashboard.sandbox.konnect.network"
const COOKIES_STRING = process.env.KONNECT_COOKIES_STRING as string

export async function isPaymentCompleted(paymentRef: string) {
    // IMPORTANT NOTE : this function assumes that the payment accept only one successful transaction.

    const url = `${BASE_URL}/admin/dashboard?filter[payment._id]=${paymentRef}&page=1&_data=routes%2Fadmin%2F(organisations)%2F(%24organisationId)%2Fdashboard`

    const response = await fetch(url, {
        method: "GET",
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
    })

    const data = (await response.json()) as IResponse
    const result = !!data?.transactions?.items?.some(
        (transaction) => transaction?.status === "success"
    )
    return result
}

interface IResponse {
    tags: Array<any>
    completionResult: {
        kyc: boolean
        email: boolean
    }
    canViewTransactions: boolean
    walletId: string
    levels: Array<{
        level: number
        status: string
        limits: {
            balance: {
                max: number
            }
            outgoing: {
                max: number
            }
        }
        reasonForRejection: string
    }>
    role: string
    activeWallet: {
        token: string
        balance: number
        decimals: number
    }
    id: string
    numberOfPendingDisputes: number
    numberOfPendingReviewDisputes: number
    hideBanner: boolean

    transactions: {
        items: Array<{
            note: {
                attachments: Array<any>
            }
            type: string
            method: string
            addPaymentFeesToAmount: boolean
            payment: any
            tags: Array<any>
            paymentChannel: string
            receiverWallet: {
                owner: {
                    _id: string
                    status: string
                    email: string
                    firstName: string
                    lastName: string
                    phoneNumber: string
                    imageURL: string
                    name: string
                    id: string
                }
                type: string
                id: string
            }
            underVerification: boolean
            hidden: boolean
            status: "failed_payment" | "pending" | "success"
            hashs: Array<any>
            comments: Array<any>
            token: string
            amount: number
            origin: number
            disputeInitiated: boolean
            refunded: boolean
            internalNotes: Array<any>
            notes: Array<any>
            createdAt: string
            updatedAt: string
            ext_payment_ref: string
            from: string
            details: string
            extSenderInfo: {
                pan: string
                expiration: string
                paymentSystem: string
                name: string
                email: string
                bankInfo: {
                    bankName: string
                    bankCountryCode: string
                    bankCountryName: string
                }
            }
            senderIP: string
            id: string
        }>
        total: number
        limit: number
        hasPrevPage: boolean
        hasNextPage: boolean
        page: number
        totalPages: number
        slNo: number
        prev: any
        next: any
    }
}
