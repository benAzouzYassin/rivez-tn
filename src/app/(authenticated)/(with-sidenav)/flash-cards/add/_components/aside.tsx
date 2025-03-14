import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import AsideItem from "./aside-item"
import { memo } from "react"

interface Props {
    selectedId: string
    items: { name: string; localId: string }[]
}
function Aside(props: Props) {
    return (
        <aside className="w-48 fixed h-[90vh]  border-r-2">
            <ScrollArea className="  max-h-[73vh]  scale-x-[-1]   px-5 ">
                <div className="h-[73vh] scale-x-[-1]">
                    <div className="h-5"></div>
                    {props.items.map((item) => {
                        return (
                            <AsideItem
                                key={item.localId}
                                {...item}
                                isSelected={props.selectedId === item.localId}
                            />
                        )
                    })}
                </div>
            </ScrollArea>
            <div className="pt-5">
                <div className="pl-5 pr-6">
                    <button
                        className={
                            "h-[100px]  flex items-center justify-center w-full hover:cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all border-dashed border-neutral-300 border-2 rounded-lg"
                        }
                    >
                        <Plus className="w-16 h-16 text-neutral-300 stroke-1" />
                    </button>
                </div>
            </div>
        </aside>
    )
}
export default memo(Aside)
