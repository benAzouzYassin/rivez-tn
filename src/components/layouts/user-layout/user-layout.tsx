import { ReactNode } from "react"
import UserHeader from "./user-header"
import UserNav from "./user-nav"

type Props = {
    children?: Readonly<ReactNode>
}
export default function UserLayout({ children }: Props) {
    return (
        <>
            <UserNav />
            <UserHeader />
            <main className="pl-[256px]">{children}</main>
        </>
    )
}
