import { readCurrentUser } from "@/data-access/users/read"
import { useQuery } from "@tanstack/react-query"

export function useCurrentUser() {
    const { isLoading, data, isError, refetch } = useQuery({
        staleTime: Infinity,
        queryKey: ["current-user"],
        retry: 1,
        queryFn: async () => {
            const { data, error, success } = await readCurrentUser()
            if (!success) throw error
            return data
        },
    })
    return { isLoading, data, isError, refetch }
}
