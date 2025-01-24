import { ReactNode } from "react"
import UserHeader from "../shared/user-header"
import UserNav from "../shared/user-nav"

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
