import { updateUserPassword } from "@/data-access/users/update"

export async function updatePassword(data: { newPassword: string }) {
    return updateUserPassword({ password: data.newPassword })
}
