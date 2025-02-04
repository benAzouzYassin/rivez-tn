"use client"

import UserLayout from "@/components/layouts/user-layout"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <UserLayout>{children}</UserLayout>
}
