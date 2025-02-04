import { ReactNode } from "react"
import AdminHeader from "./admin-header"
import AdminNav from "./admin-nav"

type Props = {
    children?: Readonly<ReactNode>
}
export default function AdminLayout({ children }: Props) {
    return (
        <>
            <AdminHeader />
            <AdminNav />
            <main className="pl-[256px]">{children}</main>
        </>
    )
}
