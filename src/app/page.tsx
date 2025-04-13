"use client"

import AnimatedLoader from "@/components/ui/animated-loader"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"

export default function Page() {
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
    return (
        <div className="h-screen flex items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
