"use client"

import AnimatedLoader from "@/components/ui/animated-loader"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function Page() {
    const searchParams = useSearchParams()
    const inviteCode = searchParams.get("invite_code") as string

    const userData = useCurrentUser()
    const router = useRouter()
    useEffect(() => {
        if (!userData.isLoading) {
            if (userData.data?.id) {
                router.replace("/home")
            } else {
                router.replace("/landing-page")
            }
        }
    }, [router, userData])
    useEffect(() => {
        if (inviteCode) {
            localStorage.setItem("inviteCode", inviteCode)
        }
    }, [inviteCode])
    return (
        <div className="h-screen flex items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
