import {
    loginUserWithGoogle,
    loginUserWithPassword,
} from "@/data-access/users/login"

export function loginWithPassword(data: { email: string; password: string }) {
    return loginUserWithPassword(data)
}

export function loginWithGoogle() {
    return loginUserWithGoogle()
}
