import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import TooltipWrapper from "@/components/ui/tooltip"
import { cn } from "@/lib/ui-utils"
import { Editor } from "@tiptap/react"

interface Props {
    editor: Editor
}

export default function ToolbarTextColor(props: Props) {
    const { editor } = props

    const colorGroups = [
        // Grayscale
        [
            { name: "Light Gray ", code: "#d1d5db" },
            { name: "Medium Gray ", code: "#6b7280" },
            { name: "Dark Gray ", code: "#374151" },
            { name: "Darker Gray ", code: "#111827" },
        ],
        // Reds
        [
            { name: "Light Red ", code: "#fca5a5" },
            { name: "Medium Red ", code: "#ef4444" },
            { name: "Dark Red ", code: "#b91c1c" },
            { name: "Darker Red ", code: "#7f1d1d" },
        ],
        // Pinks
        [
            { name: "Light Pink ", code: "#f9a8d4" },
            { name: "Medium Pink ", code: "#ec4899" },
            { name: "Dark Pink ", code: "#be185d" },
            { name: "Darker Pink ", code: "#831843" },
        ],
        // Purples
        [
            { name: "Light Purple ", code: "#d8b4fe" },
            { name: "Medium Purple ", code: "#a855f7" },
            { name: "Dark Purple ", code: "#7e22ce" },
            { name: "Darker Purple ", code: "#581c87" },
        ],
        // Indigos
        [
            { name: "Light Indigo ", code: "#a5b4fc" },
            { name: "Medium Indigo ", code: "#6366f1" },
            { name: "Dark Indigo ", code: "#4338ca" },
            { name: "Darker Indigo ", code: "#312e81" },
        ],
        // Blues
        [
            { name: "Light Blue ", code: "#93c5fd" },
            { name: "Medium Blue ", code: "#3b82f6" },
            { name: "Dark Blue ", code: "#1d4ed8" },
            { name: "Darker Blue ", code: "#1e3a8a" },
        ],
        // Teals
        [
            { name: "Light Teal ", code: "#5eead4" },
            { name: "Medium Teal ", code: "#14b8a6" },
            { name: "Dark Teal ", code: "#0f766e" },
            { name: "Darker Teal ", code: "#134e4a" },
        ],
        // Greens
        [
            { name: "Light Green ", code: "#86efac" },
            { name: "Medium Green ", code: "#22c55e" },
            { name: "Dark Green ", code: "#15803d" },
            { name: "Darker Green ", code: "#14532d" },
        ],
        // Yellows
        [
            { name: "Light Yellow ", code: "#fde047" },
            { name: "Medium Yellow ", code: "#eab308" },
            { name: "Dark Yellow ", code: "#a16207" },
            { name: "Darker Yellow ", code: "#713f12" },
        ],
        // Oranges
        [
            { name: "Light Orange ", code: "#fdba74" },
            { name: "Medium Orange ", code: "#f97316" },
            { name: "Dark Orange ", code: "#c2410c" },
            { name: "Darker Orange ", code: "#7c2d12" },
        ],
    ]

    const applyColor = (color: string) => {
        editor.chain().focus().setColor(color).run()
    }

    const isActive = () => !!editor.getAttributes("textStyle").color

    return (
        <Popover>
            <TooltipWrapper content="Text color">
                <PopoverTrigger asChild>
                    <div
                        className={cn(
                            "h-8 w-8 flex flex-col items-center font-bold text-lg justify-center transition-all rounded-md border-transparent cursor-pointer",
                            "hover:scale-105 hover:bg-neutral-100 hover:text-neutral-800 hover:border-neutral-200 text-neutral-600 border",
                            isActive() &&
                                "bg-neutral-100 text-neutral-800 border-neutral-200"
                        )}
                    >
                        A
                        <div className="w-3/4 rounded-xl -translate-y-1 h-[4px] bg-blue-700"></div>
                    </div>
                </PopoverTrigger>
            </TooltipWrapper>
            <PopoverContent className="!px-3 rounded-2xl pt-4 flex mt-2 !w-fit items-center justify-center">
                <div className="flex gap-2">
                    {colorGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col gap-2">
                            {group.map((color) => (
                                <button
                                    key={color.code}
                                    onClick={() => applyColor(color.code)}
                                    className="w-7 h-7 rounded-md border hover:scale-110 cursor-pointer transition-transform"
                                    style={{ backgroundColor: color.code }}
                                    title={color.name}
                                    aria-label={`Set text color to ${color.name}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
