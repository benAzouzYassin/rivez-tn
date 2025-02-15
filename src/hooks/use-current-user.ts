import { readCurrentUser } from "@/data-access/users/read"
import { useQuery } from "@tanstack/react-query"

export function useCurrentUser() {
    const { isLoading, data, isError } = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const { data, error, success } = await readCurrentUser()
            if (!success) throw error
            return data
        },
    })
    return { isLoading, data, isError }
}
