"use client"
import AnimatedLoader from "@/components/ui/animated-loader"
import { useRouter } from "nextjs-toploader/app"
import { useEffect } from "react"

export default function Loading() {
    const router = useRouter()
    useEffect(() => {
        router.replace("/flash-cards/list")
    }, [router])
    return (
        <div className="w-full h-[90vh] flex items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
