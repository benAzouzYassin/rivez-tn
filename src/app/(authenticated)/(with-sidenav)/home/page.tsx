"use client"

import { handleInvite } from "@/data-access/users/handle-invite"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useEffect } from "react"
import HomePage from "./_components/home-page"

export default function Page() {
    const refetchUser = useRefetchUser()
    const [isNewUser, setIsNewUser] = useQueryState(
        "is_new_user",
        parseAsBoolean.withDefault(false)
    )
    useEffect(() => {
        if (isNewUser) {
            const inviteCode = localStorage.getItem("inviteCode")
            if (inviteCode) {
                handleInvite(inviteCode)
                    .then(() => {
                        localStorage.removeItem("inviteCode")
                        refetchUser()
                    })
                    .catch(console.error)
                setIsNewUser(false)
            }
        }
    }, [isNewUser, setIsNewUser, refetchUser])
    return (
        <div className="relative isolate pb-12">
            <HomePage />
        </div>
    )
}
