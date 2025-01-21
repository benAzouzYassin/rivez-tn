import {
    registerUserWithGoogle,
    registerUserWithPassword,
} from "@/data-access/users/register"

export function registerWithPassword(data: {
    email: string
    password: string
    phone?: string
    username: string
}) {
    return registerUserWithPassword(data)
}

export function registerWithGoogle() {
    return registerUserWithGoogle()
}
