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
                className={cn(
                    "transition-all dark:bg-neutral-900 pt-[10vh] duration-300",
                    {
                        "ltr:lg:pl-[300px] rtl:lg:pr-[300px]": isSidenavOpen,
                        "ltr:lg:pl-[100px] rtl:lg:pr-[100px]": !isSidenavOpen,
                    }
                )}
            >
                {children}
            </main>
        </>
    )
}
