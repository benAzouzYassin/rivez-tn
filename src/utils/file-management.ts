import { readCurrentSession } from "@/data-access/users/read"
import axios from "axios"

export async function uploadFile(
    fileObject: File | Blob,
    abortController?: AbortController
) {
    // TODO make rate limiting for each user
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const formData = new FormData()

    if (fileObject instanceof File) {
        formData.append("file", fileObject)
    } else {
        formData.append(
            "file",
            new File([fileObject], crypto.randomUUID(), {
                type: fileObject.type,
            })
        )
    }

    try {
        const response = await axios.post(
            "/api/manage-public-files",
            formData,
            {
                headers: {
                    "access-token": session.access_token,
                    "refresh-token": session.refresh_token,
                    "Content-Type": "multipart/form-data",
                },
                signal: abortController?.signal,
            }
        )

        return response.data as string
    } catch (error) {
        console.error("Error uploading file:", error)
        throw error
    }
}

export async function deleteFile(fileUrl: string) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    try {
        const fileName = fileUrl.split("/").pop()
        const response = await axios.delete(
            `/api/manage-public-files?filename=${fileName}`,
            {
                headers: {
                    "access-token": session.access_token,
                    "refresh-token": session.refresh_token,
                },
            }
        )

        return response.data as boolean
    } catch (error) {
        console.error(
            `Error deleting file. url: ${fileUrl} and error : `,
            error
        )
        throw error
    }
}
