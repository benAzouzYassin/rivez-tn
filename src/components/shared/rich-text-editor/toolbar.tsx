import TooltipWrapper from "@/components/ui/tooltip"
import { cn } from "@/lib/ui-utils"
import { Editor } from "@tiptap/react"
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code2,
    ImageIcon,
    Italic,
    LinkIcon,
    ListCollapse,
    ListOrderedIcon,
    Strikethrough,
    UnderlineIcon,
} from "lucide-react"
import { ReactNode, useState } from "react"
import TextTypeSelector from "./text-type-selector"
import ToolbarTextColor from "./tolobar-text-color"
import ToolBarImage from "./toolbar-add-image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toastError } from "@/lib/toasts"
import ToolbarTable from "./toolbar-table"

interface Props {
    editor: Editor | null
    className?: string
}

export default function Toolbar({ editor, className }: Props) {
    const [isAddingImage, setIsAddingImage] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

    if (!editor) {
        return null
    }

    const addLink = () => {
        if (!linkUrl) {
            toastError("Empty link.")
            return
        }

        if (editor.state.selection.empty) {
            toastError("Select some text first.")
            return
        }

        editor.chain().focus().setLink({ href: linkUrl }).run()

        setIsLinkDialogOpen(false)
        setLinkUrl("")
    }

    return (
        <div
            className={cn(
                "pb-3 pt-2 px-2 rounded-t-lg border-t-2 border-x-2   flex flex-wrap items-center gap-1 ",
                className
            )}
        >
            <TextTypeSelector editor={editor} />
            <MenuDivider />
            <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold"
            >
                <Bold className="w-5 h-5 stroke-[2.5] " />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                title="Underline"
            >
                <UnderlineIcon className="w-5 h-5 stroke-[2.5] " />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic"
            >
                <Italic className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                title="Line through"
            >
                <Strikethrough className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                title="Code"
            >
                <Code2 className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
            <ToolbarTextColor editor={editor} />
            <MenuDivider />

            <MenuButton
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                isActive={editor.isActive({ textAlign: "left" })}
                title="Align left"
            >
                <AlignLeft className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
            <MenuButton
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                isActive={editor.isActive({ textAlign: "center" })}
                title="Align center"
            >
                <AlignCenter className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
            <MenuButton
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                isActive={editor.isActive({ textAlign: "right" })}
                title="Align right"
            >
                <AlignRight className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>

            <MenuDivider />
            <ToolBarImage
                asChild
                setIsOpen={setIsAddingImage}
                isOpen={isAddingImage}
                editor={editor}
            >
                <MenuButton
                    onClick={() => {
                        setIsAddingImage(true)
                    }}
                    isActive={false}
                    title="Image"
                >
                    <ImageIcon className="w-5 h-5 stroke-[2.5]" />
                </MenuButton>
            </ToolBarImage>
            <Dialog
                open={isLinkDialogOpen}
                onOpenChange={(value) => {
                    if (editor.isActive("link")) {
                        return editor
                            .chain()
                            .focus()
                            .extendMarkRange("link")
                            .unsetLink()
                            .run()
                    }
                    setIsLinkDialogOpen(value)
                }}
            >
                <DialogTrigger asChild>
                    <MenuButton isActive={editor.isActive("link")} title="Link">
                        <LinkIcon className="w-5 h-5 stroke-[2.5]" />
                    </MenuButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add Link</DialogTitle>
                    <DialogDescription>
                        Add a hyperlink to the selected text
                    </DialogDescription>
                    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto space-y-2">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                Enter Link URL
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Input
                                    placeholder="https://example.com"
                                    className="grow w-full border-2 border-neutral-300"
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            addLink()
                                        }
                                    }}
                                />
                                <Button
                                    onClick={addLink}
                                    variant="default"
                                    className="text-base"
                                >
                                    Add Link
                                </Button>
                            </div>
                            <p className="text-sm text-neutral-500 mt-2">
                                First select some text, then add a link to it
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ToolbarTable editor={editor} />
            <MenuDivider />
            <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
            >
                <ListCollapse className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Ordered list"
            >
                <ListOrderedIcon className="w-5 h-5 stroke-[2.5]" />
            </MenuButton>
        </div>
    )
}

interface MenuButtonProps {
    onClick?: () => void
    isActive?: boolean
    children: ReactNode
    title: string
}
const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title = "",
}: MenuButtonProps) => (
    <TooltipWrapper content={title} asChild>
        <button
            onClick={onClick}
            className={cn(
                "h-8 w-8 flex items-center justify-center transition-all rounded-md border-transparent cursor-pointer",
                isActive
                    ? "bg-neutral-600 text-white "
                    : "hover:scale-105 hover:bg-neutral-100 hover:text-neutral-800 hover:border-neutral-200 text-neutral-600 border"
            )}
            title={title}
        >
            {children}
        </button>
    </TooltipWrapper>
)
const MenuDivider = () => <div className="mx-1 h-6 w-px bg-gray-300" />
