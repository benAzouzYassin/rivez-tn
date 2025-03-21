import { useCurrentUser } from "./use-current-user"

export const useIsAdmin = () => {
    const { data, isLoading } = useCurrentUser()
    return isLoading ? null : data?.user_role === "ADMIN"
}
