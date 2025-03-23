import ReactMarkdown from "react-markdown"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark as prismStyle } from "react-syntax-highlighter/dist/cjs/styles/prism"
import rangeParser from "parse-numeric-range"

// Web Development
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx"
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx"
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript"
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript"
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css"
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss"
import html from "react-syntax-highlighter/dist/cjs/languages/prism/markup"
import svg from "react-syntax-highlighter/dist/cjs/languages/prism/markup"

// Backend Languages
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python"
import csharp from "react-syntax-highlighter/dist/cjs/languages/prism/csharp"
import go from "react-syntax-highlighter/dist/cjs/languages/prism/go"
import ruby from "react-syntax-highlighter/dist/cjs/languages/prism/ruby"
import php from "react-syntax-highlighter/dist/cjs/languages/prism/php"
import rust from "react-syntax-highlighter/dist/cjs/languages/prism/rust"
import kotlin from "react-syntax-highlighter/dist/cjs/languages/prism/kotlin"
import swift from "react-syntax-highlighter/dist/cjs/languages/prism/swift"
import dart from "react-syntax-highlighter/dist/cjs/languages/prism/dart"
import scala from "react-syntax-highlighter/dist/cjs/languages/prism/scala"

// Data & Config
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json"
import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml"
import toml from "react-syntax-highlighter/dist/cjs/languages/prism/toml"
import xml from "react-syntax-highlighter/dist/cjs/languages/prism/markup"
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql"
import graphql from "react-syntax-highlighter/dist/cjs/languages/prism/graphql"

// Shell & Scripting
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash"
import powershell from "react-syntax-highlighter/dist/cjs/languages/prism/powershell"
import shell from "react-syntax-highlighter/dist/cjs/languages/prism/bash"

// Documentation
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown"

// Low-level languages
import c from "react-syntax-highlighter/dist/cjs/languages/prism/c"
import cpp from "react-syntax-highlighter/dist/cjs/languages/prism/cpp"

SyntaxHighlighter.registerLanguage("tsx", tsx)
SyntaxHighlighter.registerLanguage("jsx", jsx)
SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("ts", typescript)
SyntaxHighlighter.registerLanguage("javascript", javascript)
SyntaxHighlighter.registerLanguage("js", javascript)
SyntaxHighlighter.registerLanguage("css", css)
SyntaxHighlighter.registerLanguage("scss", scss)
SyntaxHighlighter.registerLanguage("html", html)
SyntaxHighlighter.registerLanguage("svg", svg)

SyntaxHighlighter.registerLanguage("java", java)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("py", python)
SyntaxHighlighter.registerLanguage("csharp", csharp)
SyntaxHighlighter.registerLanguage("cs", csharp)
SyntaxHighlighter.registerLanguage("go", go)
SyntaxHighlighter.registerLanguage("ruby", ruby)
SyntaxHighlighter.registerLanguage("rb", ruby)
SyntaxHighlighter.registerLanguage("php", php)
SyntaxHighlighter.registerLanguage("rust", rust)
SyntaxHighlighter.registerLanguage("rs", rust)
SyntaxHighlighter.registerLanguage("kotlin", kotlin)
SyntaxHighlighter.registerLanguage("kt", kotlin)
SyntaxHighlighter.registerLanguage("swift", swift)
SyntaxHighlighter.registerLanguage("dart", dart)
SyntaxHighlighter.registerLanguage("scala", scala)

SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("yaml", yaml)
SyntaxHighlighter.registerLanguage("yml", yaml)
SyntaxHighlighter.registerLanguage("toml", toml)
SyntaxHighlighter.registerLanguage("xml", xml)
SyntaxHighlighter.registerLanguage("sql", sql)
SyntaxHighlighter.registerLanguage("graphql", graphql)
SyntaxHighlighter.registerLanguage("gql", graphql)

SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("sh", bash)
SyntaxHighlighter.registerLanguage("shell", shell)
SyntaxHighlighter.registerLanguage("powershell", powershell)
SyntaxHighlighter.registerLanguage("ps", powershell)

SyntaxHighlighter.registerLanguage("markdown", markdown)
SyntaxHighlighter.registerLanguage("md", markdown)

SyntaxHighlighter.registerLanguage("c", c)
SyntaxHighlighter.registerLanguage("cpp", cpp)
SyntaxHighlighter.registerLanguage("c++", cpp)

export default function Markdown({ content }: { content: string }) {
    return (
        <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
    )
}

const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: any) {
        const hasLang = /language-(\w+)/.exec(className || "")
        const hasMeta = node?.data?.meta

        const applyHighlights: object = (applyHighlights: number) => {
            if (hasMeta) {
                const RE = /{([\d,-]+)}/
                const metadata = node.data.meta?.replace(/\s/g, "")
                const strlineNumbers = RE?.test(metadata)
                    ? RE?.exec(metadata)?.[1]
                    : "0"
                const highlightLines = rangeParser(strlineNumbers || "0")
                const highlight = highlightLines
                const data: string = highlight.includes(applyHighlights)
                    ? "highlight"
                    : ""
                return { data }
            } else {
                return {}
            }
        }

        return hasLang ? (
            <SyntaxHighlighter
                style={prismStyle}
                language={hasLang[1]}
                PreTag="div"
                className="codeStyle"
                showLineNumbers={true}
                wrapLines={hasMeta}
                useInlineStyles={true}
                lineProps={applyHighlights}
            >
                {props.children}
            </SyntaxHighlighter>
        ) : (
            <code className={className} {...props} />
        )
    },
}
