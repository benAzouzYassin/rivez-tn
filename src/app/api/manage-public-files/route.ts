import { authenticateAdmin } from "@/data-access/users/is-admin"
import { NextRequest, NextResponse } from "next/server"
import { s3Client } from "@/lib/s3"
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

const S3_BUCKET_NAME = "public_files"
// TODO make rate limits for normal users

export async function POST(req: NextRequest) {
    const maxFileSize =
        Number(process.env.NEXT_PUBLIC_FILE_SIZE_LIMIT! || 10) * 1024 * 1024
    try {
        const accessToken = req.headers.get("access-token")
        const refreshToken = req.headers.get("refresh-token")

        if (!accessToken || !refreshToken) {
            return NextResponse.json(
                { message: "No authorization header was provided" },
                { status: 401 }
            )
        }

        // const isAdmin = await authenticateAdmin({ refreshToken, accessToken })
        // if (!isAdmin) {
        //     return NextResponse.json(
        //         { message: "Unauthorized: Admin access required" },
        //         { status: 403 }
        //     )
        // }

        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json(
                { message: "No file provided" },
                { status: 400 }
            )
        }

        if (file.size > maxFileSize) {
            return NextResponse.json(
                { message: "File size exceeds limit" },
                { status: 400 }
            )
        }

        const buffer = await file.arrayBuffer()

        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name}`

        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: filename,
            Body: Buffer.from(buffer),
            ContentType: file.type,
        })

        await s3Client.send(command)

        return NextResponse.json(
            `${process.env.S3_PUBLIC_FILE_URL_PREFIX}/${S3_BUCKET_NAME}/${filename}`,
            { status: 200 }
        )
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json(
            { message: "Error uploading file" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token")
        const refreshToken = req.headers.get("refresh-token")

        if (!accessToken || !refreshToken) {
            return NextResponse.json(false, { status: 401 })
        }

        const isAdmin = await authenticateAdmin({ refreshToken, accessToken })
        if (!isAdmin) {
            return NextResponse.json(false, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const filename = searchParams.get("filename")

        if (!filename) {
            return NextResponse.json(false, { status: 400 })
        }

        const command = new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: filename,
        })

        await s3Client.send(command)

        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.error("Error deleting file:", error)
        return NextResponse.json(false, { status: 500 })
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}

export const maxDuration = 60
