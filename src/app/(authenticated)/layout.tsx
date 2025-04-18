"use client"

import AnimatedLoader from "@/components/ui/animated-loader"
import { readCurrentSession } from "@/data-access/users/read"
import { useIsFetching } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useState } from "react"
export const dynamic = "force-static"

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [allowedToEnter, setAllowedToEnter] = useState<boolean | null>(null)
    const isLoading =
        useIsFetching({
            queryKey: ["current-user"],
        }) > 0
    useEffect(() => {
        if (isLoading === false) {
            readCurrentSession().then(({ data }) => {
                if (data.session) {
                    setAllowedToEnter(true)
                } else {
                    const afterAuthUrl = ["/", ""].includes(
                        window.location.pathname
                    )
                        ? "/home"
                        : window.location.pathname
                    localStorage.setItem(
                        "afterAuthRedirect",
                        afterAuthUrl + "?" + searchParams.toString()
                    )
                    router.replace("/auth/register")
                }
            })
        }
    }, [router, searchParams, isLoading])
    if (allowedToEnter === null || isLoading) {
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
