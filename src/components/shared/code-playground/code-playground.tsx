"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import SearchSelect from "@/components/ui/search-select"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import Editor, { useMonaco } from "@monaco-editor/react"
import { Loader2, Pencil, Plus, X } from "lucide-react"
import monaco from "monaco-editor"
import { useCallback, useEffect, useRef, useState } from "react"
import { VS_ICONS } from "./constants/icons"
import { EDITOR_LANGUAGES } from "./constants/languages"
import {
    draculaTheme,
    githubLightTheme,
    monokaiOneDarkVividTheme,
    monokaiTheme,
    nightOwlTheme,
    oneDarkerTheme,
    oneDarkTheme,
} from "./constants/themes"
import { activateMonacoJSXHighlighter } from "./utils/editor-jsx-support"

type Props = {
    tabs: Tab[]
    onAdd: (t: Tab) => void
    selectedTabId: string
    onSelectedTabChange: (id: string) => void
    onCodeChange: (code: string) => void
    onTabRemove: (id: string) => void
    onTabRename: (id: string, newName: string, fileType: string) => void
    theme:
        | "nightOwl"
        | "light"
        | "dracula"
        | "monokai"
        | "oneDark"
        | "oneDarker"
        | "monokaiOneDarkVivid"
    onThemeChange: (theme: string) => void
    className?: string
    onBlur?: () => void
    isReadonly?: boolean
}

export default function CodePlayground({
    onSelectedTabChange,
    selectedTabId,
    tabs,
    onCodeChange,
    onThemeChange,
    theme,
    onTabRemove,
    onAdd,
    onTabRename,
    className,
    onBlur,
    isReadonly,
}: Props) {
    const monacoJSXHighlighterRef = useRef<any>(null)
    const [editingTabId, setEditingTabId] = useState<string | null>(null)
    const [editingTabName, setEditingTabName] = useState("")
    const editorRef = useRef<any>(null)

    const handleEditorDidMount = useCallback(
        (
            monacoEditor: monaco.editor.IStandaloneCodeEditor,
            monaco: typeof import("monaco-editor")
        ) => {
            editorRef.current = monacoEditor
            const disposable = monacoEditor.onDidBlurEditorWidget(() => {
                onBlur?.()
            })

            activateMonacoJSXHighlighter(monacoEditor, monaco)
                .then((monacoJSXHighlighterRefCurrent) => {
                    monacoJSXHighlighterRef.current =
                        monacoJSXHighlighterRefCurrent
                    monacoJSXHighlighterRefCurrent.isToggleJSXHighlightingOn()
                    monacoJSXHighlighterRefCurrent.isToggleJSXCommentingOn()
                })
                .catch((e) => console.error(e))
            return () => {
                disposable.dispose()
                if (monacoJSXHighlighterRef.current) {
                    monacoJSXHighlighterRef.current.dispose()
                }
            }
        },
        [onBlur]
    )

    const handleTabNameEdit = (tabId: string) => {
        const tab = tabs.find((t) => t.localId === tabId)
        if (tab) {
            setEditingTabId(tabId)
            setEditingTabName(tab.name)
        }
    }
    const monaco = useMonaco()

    const handleTabNameSave = () => {
        if (editingTabId && editingTabName.trim()) {
            onTabRename?.(
                editingTabId,
                editingTabName.trim(),
                tabs.find((t) => t.localId == editingTabId)?.type || "plaintext"
            )
            setEditingTabId(null)
            setEditingTabName("")
        } else if (!editingTabName.trim()) {
            toastError("Tab name cannot be empty")
        }
    }

    const handleTabNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleTabNameSave()
        } else if (e.key === "Escape") {
            setEditingTabId(null)
            setEditingTabName("")
        }
    }

    const selectedTab = tabs.find((t) => t.localId === selectedTabId) || tabs[0]
    const code = selectedTab?.code || ""
    let language = selectedTab?.type || ""
    if (language === "tsx") {
        language = "typescript"
    }
    if (language === "jsx") {
        language = "javascript"
    }

    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme("nightOwl", nightOwlTheme as any)
            monaco.editor.defineTheme("dracula", draculaTheme as any)
            monaco.editor.defineTheme("monokai", monokaiTheme as any)
            monaco.editor.defineTheme("oneDark", oneDarkTheme as any)
            monaco.editor.defineTheme("oneDarker", oneDarkerTheme as any)
            monaco.editor.defineTheme(
                "monokaiOneDarkVivid",
                monokaiOneDarkVividTheme as any
            )
            monaco.editor.defineTheme("light", githubLightTheme as any)

            monaco.editor.setTheme(theme)
        }
    }, [monaco, theme])

    useEffect(() => {
        if (monaco) {
            // removes language syntax validations
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                {
                    diagnosticCodesToIgnore: [6385, 7027, 7028, 6133],
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                    onlyVisible: true,
                }
            )
            const disableErrors = {
                noSemanticValidation: true,
                noSyntaxValidation: true,
            }

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                disableErrors
            )
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                disableErrors
            )

            EDITOR_LANGUAGES.forEach((lang) => {
                monaco.languages.register({ id: lang })
                monaco.languages.setLanguageConfiguration(lang, {
                    ...(disableErrors as any),
                })
            })
        }
    }, [monaco])
    const themeBackgrounds = {
        nightOwl: "#011627",
        dracula: "#282a36",
        monokai: "#272822",
        oneDark: "#282c34",
        oneDarker: "#1e2127",
        monokaiOneDarkVivid: "#1d1e22",
        githubLight: "#ffffff",
    }

    const themeHeaderBackgrounds = {
        nightOwl: "#01111d",
        dracula: "#343746",
        monokai: "#32332d",
        oneDark: "#21252b",
        oneDarker: "#181a1f",
        monokaiOneDarkVivid: "#16171b",
        githubLight: "#f5f5f5",
    }

    const themeTabBackgrounds = {
        nightOwl: "#011627",
        dracula: "#282a36",
        monokai: "#272822",
        oneDark: "#282c34",
        oneDarker: "#1e2127",
        monokaiOneDarkVivid: "#1d1e22",
        githubLight: "#e1e4e8",
    }

    const themeTitles = {
        nightOwl: "Night Owl",
        dracula: "Dracula",
        monokai: "Monokai",
        oneDark: "One Dark",
        oneDarker: "One Darker",
        monokaiOneDarkVivid: "Dark theme",
        githubLight: "Light theme",
    }

    const isDarkTheme = (theme: string) => {
        return theme !== "light" && theme !== "githubLight"
    }

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto p-4 gap-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div
                    className="flex-1 rounded-xl overflow-hidden shadow-xl"
                    style={{
                        background:
                            themeBackgrounds[
                                theme as keyof typeof themeBackgrounds
                            ],
                    }}
                >
                    <div
                        className="p-3 flex items-center "
                        style={{
                            background:
                                themeHeaderBackgrounds[
                                    theme as keyof typeof themeHeaderBackgrounds
                                ],
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span
                                className={`text-sm ml-2 opacity-75 ${
                                    isDarkTheme(theme)
                                        ? "text-white"
                                        : "text-gray-700"
                                }`}
                            ></span>
                        </div>
                        <div
                            className={cn(
                                "flex grow ml-2 pb-1 overflow-x-auto  ",
                                { "dark-scroll": isDarkTheme(theme) }
                            )}
                            style={{
                                background:
                                    themeHeaderBackgrounds[
                                        theme as keyof typeof themeHeaderBackgrounds
                                    ],
                            }}
                        >
                            {tabs.map((tab) => {
                                const tabIcon =
                                    VS_ICONS?.[tab.type || "plaintext"]
                                const isEditing = editingTabId === tab.localId

                                return (
                                    <div
                                        key={tab.localId}
                                        className={cn(
                                            "flex items-center px-4 py-2 cursor-pointer border-b-2 min-w-[120px] transition-all",
                                            selectedTabId === tab.localId
                                                ? cn(
                                                      "",
                                                      isDarkTheme(theme)
                                                          ? "!bg-white/10 border-white/40 rounded-t-md  text-white"
                                                          : "bg-white border-black/40 rounded-t-md text-gray-800"
                                                  )
                                                : cn(
                                                      "",
                                                      isDarkTheme(theme)
                                                          ? "text-gray-400  rounded-t-md  border-white/10 hover:!bg-white/10 "
                                                          : "text-gray-600 rounded-t-md  border-black/10 hover:!bg-black/10 "
                                                  )
                                        )}
                                        onClick={() => {
                                            if (!isEditing) {
                                                onSelectedTabChange(tab.localId)
                                            }
                                        }}
                                        style={{
                                            backgroundColor:
                                                selectedTabId === tab.localId
                                                    ? themeTabBackgrounds[
                                                          theme as keyof typeof themeTabBackgrounds
                                                      ]
                                                    : "transparent",
                                        }}
                                    >
                                        <span className="rounded-full w-fit h-fit overflow-hidden">
                                            {tabIcon}
                                        </span>
                                        {isEditing ? (
                                            <input
                                                className={cn(
                                                    "ml-1 flex-1 text-sm bg-transparent outline-none border-b",
                                                    isDarkTheme(theme)
                                                        ? "text-white/80 border-white/30"
                                                        : "text-gray-800 border-gray-500"
                                                )}
                                                value={editingTabName}
                                                onChange={(e) =>
                                                    setEditingTabName(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={handleTabNameSave}
                                                onKeyDown={handleTabNameKeyDown}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                className={cn(
                                                    "truncate ml-1 flex-1 text-sm",
                                                    {
                                                        "text-white/80":
                                                            isDarkTheme(theme),
                                                    }
                                                )}
                                                onDoubleClick={() =>
                                                    handleTabNameEdit(
                                                        tab.localId
                                                    )
                                                }
                                            >
                                                {tab.name}
                                            </span>
                                        )}
                                        <div className="flex items-center ml-2">
                                            {!isEditing && !isReadonly && (
                                                <button
                                                    className={cn(
                                                        "p-1 rounded-full hover:bg-opacity-20",
                                                        isDarkTheme(theme)
                                                            ? "hover:bg-white/20 text-gray-400 hover:text-white/70"
                                                            : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleTabNameEdit(
                                                            tab.localId
                                                        )
                                                    }}
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                            )}
                                            {!isReadonly && (
                                                <button
                                                    className={cn(
                                                        "ml-1 rounded-full p-0.5 hover:bg-opacity-20",
                                                        isDarkTheme(theme)
                                                            ? "hover:bg-red-500/30 text-gray-400 hover:text-white/70"
                                                            : "hover:bg-red-500/30 text-gray-500 hover:text-gray-700"
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onTabRemove(tab.localId)
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                            {!isReadonly && (
                                <AddTabDialog
                                    isDarkTheme={isDarkTheme(theme)}
                                    onSubmit={(fileName, language) => {
                                        onAdd({
                                            code: "",
                                            localId: crypto.randomUUID(),
                                            name: fileName,
                                            type: language,
                                        })
                                    }}
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-2 mr-2 ml-auto min-w-36">
                            <label
                                htmlFor="theme-select"
                                className={`text-xs opacity-75 ${
                                    isDarkTheme(theme)
                                        ? "text-white"
                                        : "text-gray-700"
                                }`}
                            >
                                Theme:
                            </label>
                            <Select value={theme} onValueChange={onThemeChange}>
                                <SelectTrigger
                                    className={`text-xs text-nowrap rounded px-2 !h-9 translate-y-2 border ${
                                        isDarkTheme(theme)
                                            ? "bg-black/30 border-white/30 text-white/70 hover:bg-black/10"
                                            : "bg-white/30 border-black/30 border-2 text-black/70 hover:bg-white/10"
                                    }`}
                                >
                                    <SelectValue
                                        placeholder="Theme"
                                        className="text-nowrap"
                                    />
                                </SelectTrigger>
                                <SelectContent align="center">
                                    {Object.entries(themeTitles).map(
                                        ([key, title]) => (
                                            <SelectItem key={key} value={key}>
                                                {title}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className={cn(className || "h-[300px] z-0")}>
                        {/* Editor */}
                        <Editor
                            loading={
                                <div className="">
                                    <Loader2
                                        className={cn(
                                            "animate-spin text-black/70 w-10 h-10 ",
                                            {
                                                "text-white/70":
                                                    isDarkTheme(theme),
                                            }
                                        )}
                                    />
                                </div>
                            }
                            onMount={handleEditorDidMount}
                            height="100%"
                            width="100%"
                            language={language}
                            value={code}
                            theme={theme}
                            options={{
                                cursorSmoothCaretAnimation: "on",
                                cursorBlinking: "smooth",
                                fontSize: 16,
                                minimap: { enabled: false },
                                scrollbar: { vertical: "auto" },
                                lineNumbers: "off",
                                wordWrap: "on",
                                contextmenu: false,
                                padding: { top: 16, bottom: 16 },
                                stickyScroll: { enabled: false },
                                renderValidationDecorations: "off",
                                renderLineHighlight: "all",
                            }}
                            onChange={(value) => {
                                if (isReadonly) {
                                    return editorRef.current.setValue(code)
                                }
                                if (tabs.length < 1) {
                                    editorRef.current.setValue("")
                                    return toastError("Please add a file.")
                                }
                                onCodeChange(value || "")
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
type DialogProps = {
    isDarkTheme: boolean
    onSubmit: (name: string, language: string) => void
}
function AddTabDialog(props: DialogProps) {
    const [name, setName] = useState("")
    const [language, setLanguage] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        "flex items-center px-3 py-2 cursor-pointer rounded-t-md active:scale-95  border-b-2 transition-all",
                        props.isDarkTheme
                            ? "text-gray-400 border-white/10 hover:!bg-white/10 hover:text-white"
                            : "text-gray-600 border-black/10 hover:!bg-black/10 hover:text-black"
                    )}
                >
                    <Plus size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="gap-0">
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <label className="text-black">File name :</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value || "")}
                    placeholder="File name"
                    className="w-full "
                />
                <label className=" text-black">Type :</label>
                <SearchSelect
                    anchorClassName="w-full"
                    placeholder="Type"
                    items={EDITOR_LANGUAGES.map((item) => ({
                        label: item,
                        id: item,
                    }))}
                    selectedId={language}
                    onSelect={({ id }) => {
                        setLanguage(id)
                    }}
                />
                <Button
                    onClick={() => {
                        if (!name) {
                            return toastError("File name is required.")
                        }
                        props.onSubmit(name, language || "plaintext")
                        setIsOpen(false)
                        setLanguage("")
                        setName("")
                    }}
                    className="w-full text-base"
                >
                    Create
                </Button>
            </DialogContent>
        </Dialog>
    )
}
type Tab = {
    name: string
    code: string
    localId: string
    type: string
}
