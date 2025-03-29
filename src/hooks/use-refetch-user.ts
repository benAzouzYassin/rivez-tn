import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export function useRefetchUser() {
    const queryClient = useQueryClient()

    const refetchUser = useCallback(() => {
        queryClient.refetchQueries({
            predicate: (query) => query.queryKey.includes("current-user"),
        })
    }, [queryClient])

    return refetchUser
}
