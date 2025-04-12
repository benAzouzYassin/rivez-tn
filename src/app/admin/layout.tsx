"use client"
import AnimatedLoader from "@/components/ui/animated-loader"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/layouts/admin-layout"
import { useCurrentUser } from "@/hooks/use-current-user"
export const dynamic = "force-static"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const [allowedToEnter, setAllowedToEnter] = useState<boolean | null>(null)
    const user = useCurrentUser()

    useEffect(() => {
        if (!user.isLoading && user.data?.user_role === "ADMIN") {
            setAllowedToEnter(true)
        }
        if (!user.isLoading && user.data?.user_role !== "ADMIN") {
            router.replace("/home")
        }
    }, [router, user])

    if (allowedToEnter === null) {
        return (
            <main className=" flex min-h-[100vh] items-center justify-center">
                <AnimatedLoader className="text-neutral-200 fill-blue-600" />
            </main>
        )
    }

    if (allowedToEnter) {
        return <AdminLayout>{children}</AdminLayout>
    }
    return <></>
}
