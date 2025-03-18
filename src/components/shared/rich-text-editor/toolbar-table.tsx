import { useState } from "react"
import { Editor } from "@tiptap/react"
import {
    TableIcon,
    Rows3,
    Columns3,
    Trash2,
    Settings2,
    CheckSquare,
    LucideArrowRightLeft,
} from "lucide-react"
import TooltipWrapper from "@/components/ui/tooltip"
import { cn } from "@/lib/ui-utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ToolbarTableProps {
    editor: Editor | null
}

export default function ToolbarTable({ editor }: ToolbarTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [rows, setRows] = useState(3)
    const [cols, setCols] = useState(3)

    if (!editor) {
        return null
    }

    const isTableActive = editor.isActive("table")
    const canMergeOrSplitCells = editor.can().mergeOrSplit()

    const insertTable = () => {
        editor
            .chain()
            .focus()
            .insertTable({ rows, cols, withHeaderRow: true })
            .run()

        setIsDialogOpen(false)
    }

    const addColumnBefore = () => {
        editor.chain().focus().addColumnBefore().run()
    }

    const addColumnAfter = () => {
        editor.chain().focus().addColumnAfter().run()
    }

    const deleteColumn = () => {
        editor.chain().focus().deleteColumn().run()
    }

    const addRowBefore = () => {
        editor.chain().focus().addRowBefore().run()
    }

    const addRowAfter = () => {
        editor.chain().focus().addRowAfter().run()
    }

    const deleteRow = () => {
        editor.chain().focus().deleteRow().run()
    }

    const deleteTable = () => {
        editor.chain().focus().deleteTable().run()
    }

    const toggleHeaderRow = () => {
        editor.chain().focus().toggleHeaderRow().run()
    }

    const toggleHeaderColumn = () => {
        editor.chain().focus().toggleHeaderColumn().run()
    }

    const toggleCell = () => {
        editor.chain().focus().toggleHeaderCell().run()
    }

    const mergeOrSplitCells = () => {
        if (canMergeOrSplitCells) {
            editor.chain().focus().mergeOrSplit().run()
        }
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <MenuButton
                        title="Table"
                        isActive={isTableActive}
                        onClick={() => {
                            if (isTableActive) return
                            setIsDialogOpen(true)
                        }}
                    >
                        <TableIcon className="w-5 h-5 stroke-[2.5]" />
                    </MenuButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-center text-neutral-700 font-bold">
                            Insert Table
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex w-full flex-col gap-2">
                                <Label htmlFor="rows">Rows</Label>
                                <Input
                                    id="rows"
                                    type="number"
                                    value={rows}
                                    className="grow w-full"
                                    onChange={(e) =>
                                        setRows(parseInt(e.target.value) || 1)
                                    }
                                    min={1}
                                    max={10}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="columns">Columns</Label>
                                <Input
                                    id="columns"
                                    type="number"
                                    value={cols}
                                    className="grow w-full"
                                    onChange={(e) =>
                                        setCols(parseInt(e.target.value) || 1)
                                    }
                                    min={1}
                                    max={10}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={insertTable}>Insert Table</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isTableActive && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <MenuButton title="Table Options" isActive={true}>
                                <Settings2 className="w-5 h-5 stroke-[2.5]" />
                            </MenuButton>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="!min-w-64">
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={toggleHeaderRow}
                        >
                            Toggle Header Row
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={toggleHeaderColumn}
                        >
                            Toggle Header Column
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={toggleCell}
                        >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Toggle Cell Header
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn(
                                "font-semibold",
                                canMergeOrSplitCells
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed opacity-50"
                            )}
                            onClick={mergeOrSplitCells}
                            disabled={!canMergeOrSplitCells}
                        >
                            <LucideArrowRightLeft className="mr-2 h-4 w-4" />
                            Merge or Split Cells
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={addRowBefore}
                        >
                            <Rows3 className="mr-2 h-4 w-4" />
                            Add Row Before
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={addRowAfter}
                        >
                            <Rows3 className="mr-2 h-4 w-4" />
                            Add Row After
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={deleteRow}
                        >
                            Delete Row
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={addColumnBefore}
                        >
                            <Columns3 className="mr-2 h-4 w-4" />
                            Add Column Before
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={addColumnAfter}
                        >
                            <Columns3 className="mr-2 h-4 w-4" />
                            Add Column After
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-semibold cursor-pointer"
                            onClick={deleteColumn}
                        >
                            Delete Column
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={deleteTable}
                            className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-500 font-semibold"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Table
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}

interface MenuButtonProps {
    onClick?: () => void
    isActive?: boolean
    children: React.ReactNode
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
