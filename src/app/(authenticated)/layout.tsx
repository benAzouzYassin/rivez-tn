"use client"

import AnimatedLoader from "@/components/ui/animated-loader"
import { readCurrentSession } from "@/data-access/users/read"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useState } from "react"

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const [allowedToEnter, setAllowedToEnter] = useState<boolean | null>(null)
    useEffect(() => {
        readCurrentSession().then(({ data }) => {
            if (data.session) {
                setAllowedToEnter(true)
            } else {
                localStorage.setItem("afterAuthRedirect", window.location.href)
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
