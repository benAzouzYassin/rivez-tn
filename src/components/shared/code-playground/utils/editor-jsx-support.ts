import monaco from "monaco-editor"

export const activateMonacoJSXHighlighter = async (
    monacoEditor: monaco.editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
): Promise<MonacoJSXHighlighterRef> => {
    const { default: traverse } = await import("@babel/traverse")
    const { parse } = await import("@babel/parser")
    const { default: MonacoJSXHighlighter, makeBabelParse } = await import(
        "monaco-jsx-highlighter"
    )

    const parseJSX = makeBabelParse(parse, true)
    const monacoJSXHighlighter = new MonacoJSXHighlighter(
        monaco,
        parseJSX,
        traverse,
        monacoEditor
    )
    let disposeJSXHighlighting =
        monacoJSXHighlighter.highlightOnDidChangeModelContent()
    let disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand()

    const toggleJSXHighlighting = (): boolean => {
        if (disposeJSXHighlighting) {
            disposeJSXHighlighting()
            disposeJSXHighlighting = null
            return false
        }

        disposeJSXHighlighting =
            monacoJSXHighlighter.highlightOnDidChangeModelContent()
        return true
    }

    const toggleJSXCommenting = (): boolean => {
        if (disposeJSXCommenting) {
            disposeJSXCommenting()
            disposeJSXCommenting = null
            return false
        }

        disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand()
        return true
    }

    const isToggleJSXHighlightingOn = (): boolean => !!disposeJSXHighlighting
    const isToggleJSXCommentingOn = (): boolean => !!disposeJSXCommenting

    return {
        monacoJSXHighlighter,
        toggleJSXHighlighting,
        toggleJSXCommenting,
        isToggleJSXHighlightingOn,
        isToggleJSXCommentingOn,
    }
}
interface MonacoJSXHighlighter {
    highlightOnDidChangeModelContent: () => () => void
    addJSXCommentCommand: () => () => void
}

interface MonacoJSXHighlighterRef {
    monacoJSXHighlighter: MonacoJSXHighlighter
    toggleJSXHighlighting: () => boolean
    toggleJSXCommenting: () => boolean
    isToggleJSXHighlightingOn: () => boolean
    isToggleJSXCommentingOn: () => boolean
}
