"use client"

import { handleInvite } from "@/data-access/users/handle-invite"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useEffect } from "react"
import HomePage from "./_components/home-page"
import { useRefetchUser } from "@/hooks/use-refetch-user"

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
                        refetchUser()
                    })
                    .catch(console.error)
                setIsNewUser(false)
            }
        }
    }, [isNewUser, setIsNewUser, refetchUser])
    return (
        <div className="relative isolate">
            <HomePage />
        </div>
    )
}
