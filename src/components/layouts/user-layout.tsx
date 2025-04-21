import Sidenav from "@/components/shared/sidenav"
import UserHeader from "@/components/shared/user-header"
import { useNavigationItems } from "@/hooks/use-navigation-items"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ReactNode } from "react"

type Props = {
    children?: Readonly<ReactNode>
}
export default function UserLayout({ children }: Props) {
    const { isSidenavOpen } = useSidenav()
    const { normalUserItems, bottomItem } = useNavigationItems()
    return (
        <>
            <UserHeader />
            <Sidenav items={normalUserItems} bottomItem={bottomItem} />
            <main
                className={cn("transition-all pt-[10vh] duration-300", {
                    "lg:pl-[300px]": isSidenavOpen,
                    "lg:pl-[100px]": !isSidenavOpen,
                })}
            >
                {children}
            </main>
        </>
    )
}
