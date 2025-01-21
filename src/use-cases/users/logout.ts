import { logoutUser } from "@/data-access/users/logout"

export function logout() {
    return logoutUser()
}
