"use client"

import { supabase } from "@/backend/config/supbase-client"
import { Button } from "@/components/ui/button"
import { toastError } from "@/lib/toasts"
import { useRouter } from "nextjs-toploader/app"

export default function Page() {
    const router = useRouter()
    return (
        <main className=" flex min-h-[100vh] flex-col items-center justify-center">
            This is a protected page
            <Button
                onClick={async () => {
                    const { error } = await supabase.auth.signOut()
                    if (!error) {
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
