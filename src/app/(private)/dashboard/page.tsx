"use client"

import { Button } from "@/components/ui/button"
import { toastError } from "@/lib/toasts"
import { logout } from "@/use-cases/users/logout"
import { useRouter } from "nextjs-toploader/app"

export default function Page() {
    const router = useRouter()
    return (
        <main className=" flex min-h-[100vh] flex-col items-center justify-center">
            This is a protected page
            <Button
                onClick={async () => {
                    const { success } = await logout()
                    if (success) {
                        router.replace("/auth/register")
                    } else {
                        toastError("error while signing out")
                    }
                }}
            >
                Logout
            </Button>
        </main>
    )
}
