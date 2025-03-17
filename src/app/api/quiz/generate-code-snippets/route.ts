import { authenticateAdmin } from "@/data-access/users/is-admin"
import { anthropicHaiku } from "@/lib/ai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// TODO make rate limiting for each user
export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token") || ""
        const refreshToken = req.headers.get("refresh-token") || ""
        const isAdmin = await authenticateAdmin({ refreshToken, accessToken })

        if (!isAdmin) {
            return NextResponse.json(
                { error: "this feature is available for admins only" },
                { status: 403 }
            )
        }
        const body = await req.json()

        const { success, data, error } = bodySchema.safeParse(body)

        if (!success) {
            return NextResponse.json({ error }, { status: 400 })
        }
        const prompt = generatePrompt(data)
        const llmResponse = streamText({
            model: anthropicHaiku,
            prompt,
            temperature: 0,
            system: `
            - you only answer with arrays. 
            - you should escape special characters for the special characters since your response will be parse with JSON.parse()
            `,
        })
        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

const bodySchema = z.object({
    language: z.string().min(1).max(50),
    framework: z.string().max(50).optional(),
    concepts: z.string().min(1).max(100),
    notes: z.string().max(500).optional(),
    fileCount: z.coerce.number().min(1).max(5),
})
function generatePrompt(data: {
    language: string
    framework?: string
    concepts: string
    notes?: string
    fileCount: number
}) {
    return `
You are an expert programming tutor. Provide an in-depth explanation of the following programming concepts in ${
        data.language
    }${data.framework ? ` using the ${data.framework} framework` : ""}.

### Concepts to Cover:
${data.concepts}

${data.notes ? `### Additional Notes:\n${data.notes}` : ""}

### Example 1:
{
    "filename": "example1.${data.language.toLowerCase()}",
    "programmingLanguage": "${data.language.toLowerCase()}"
    "code": "// Example demonstrating ${data.concepts} in ${data.language}${
        data.framework ? ` with ${data.framework}` : ""
    }...",
}

### Example 2:
{
    "filename": "example2.${data.language.toLowerCase()}",
    "language": "${data.language.toLowerCase()}"
    "code": "// Alternative implementation of ${data.concepts} in ${
        data.language
    }${data.framework ? ` with ${data.framework}` : ""}...",
}

### Important Instructions:
- 
- Generate only valid JSON that can be parsed using \`JSON.parse(response)\`.  
- Do **not** use markdown formatting.  
- Do **not** include any comments in the code.  
- Ensure your response is strictly json and not markdown 
- Ensure your response strictly follows the Zod schema below
- Never start your response with this \`\`\` 

\`\`\`typescript
const schema = z.array(
    z.object({
        filename: z.string(),
        programmingLanguage: z.enum([
            "plaintext", "abap", "apex", "azcli", "bat", "bicep", "cameligo",
            "clojure", "c", "cpp", "csharp", "csp", "css", "cypher", "dart",
            "dockerfile", "ecl", "elixir", "flow9", "fsharp", "freemarker2",
            "go", "graphql", "handlebars", "hcl", "html", "ini", "java",
            "javascript", "julia", "kotlin", "less", "lexon", "lua", "liquid",
            "m3", "markdown", "mdx", "mips", "msdax", "mysql", "objective-c",
            "pascal", "pascaligo", "perl", "pgsql", "php", "pla", "postiats",
            "powerquery", "powershell", "proto", "pug", "python", "qsharp",
            "r", "razor", "redis", "redshift", "restructuredtext", "ruby",
            "rust", "sb", "scala", "scheme", "scss", "shell", "sol", "aes",
            "sparql", "sql", "st", "swift", "systemverilog", "verilog",
            "tcl", "twig", "typescript", "typespec", "vb", "wgsl", "xml",
            "yaml", "json", "tsx", "jsx"
        ]),

        code: z.string(),
    })
).max(${data.fileCount});
\`\`\`
`.trim()
}

const codeSnippetsResponse = z.array(
    z.object({
        filename: z.string(),
        programmingLanguage: z.string(),
        code: z.string(),
    })
)

export type CodeSnippetsResponse = z.infer<typeof codeSnippetsResponse>

export const maxDuration = 60
