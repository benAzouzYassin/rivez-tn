"use client"

import AdminLayout from "@/components/layouts/admin-layout"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <AdminLayout>{children}</AdminLayout>
}
