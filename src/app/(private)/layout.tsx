"use client"

import { supabase } from "@/backend/config/supbase-client"
import AnimatedLoader from "@/components/ui/animated-loader"
import { useRouter } from "nextjs-toploader/app"
import { useLayoutEffect, useState } from "react"

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const [allowedToEnter, setAllowedToEnter] = useState<boolean | null>(null)
    useLayoutEffect(() => {
        console.log("effect rrun")
        supabase.auth.getUser().then(({ data, error }) => {
            if (data.user && !error) {
                setAllowedToEnter(true)
            } else {
                router.replace("/auth/register")
            }
        })
    }, [router])
    if (allowedToEnter === null) {
        return (
            <main className=" flex min-h-[100vh] items-center justify-center">
                <AnimatedLoader className="text-neutral-200 fill-blue-600" />
            </main>
        )
    }
    if (allowedToEnter) {
        return <>{children}</>
    }
    return <></>
}
