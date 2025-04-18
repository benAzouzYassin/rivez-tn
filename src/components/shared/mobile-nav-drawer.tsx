import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useNavigationItems } from "@/hooks/use-navigation-items"
import { AlignLeft } from "lucide-react"
import { NavButton } from "./nav-button"

export default function MobileNavDrawer() {
    const { normalUserItems, bottomItem } = useNavigationItems()

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <button className="h-10 cursor-pointer lg:hidden z-[999] w-10 rounded-full">
                    <AlignLeft className="h-10 text-neutral-500 stroke-[2.3] w-10" />
                    <span className="sr-only">Toggle menu</span>
                </button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] max-w-h-[90vh] pb-2">
                <DrawerHeader className="text-center">
                    <DrawerTitle className="text-3xl text-neutral-600 font-bold">
                        Menu
                    </DrawerTitle>
                    <DrawerDescription className="text-lg font-medium"></DrawerDescription>
                </DrawerHeader>
                <div className="flex overflow-y-auto h-[90vh] flex-col items-center justify-center gap-3 p-6">
                    {normalUserItems.map((item) => (
                        <NavButton
                            key={item.name}
                            item={item}
                            isNameVisible={true}
                            additionalClasses="mt-1"
                        />
                    ))}
                    <NavButton
                        item={bottomItem}
                        isNameVisible={true}
                        additionalClasses="mt-1 py-7 pl-6 hover:bg-blue-400/90 rounded-xl border-b-4 border-blue-400/70 bg-blue-400/80 text-white gap-2 text-xl"
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
