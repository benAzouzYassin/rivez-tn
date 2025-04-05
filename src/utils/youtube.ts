import axios from "axios"
import "server-only"
import { tryCatchAsync } from "./try-catch"
const serviceUrl = process.env.YOUTUBE_TRANSCRIPTIONS_SERVICE!
const serviceSecret = process.env.YOUTUBE_TRANSCRIPTIONS_SERVICE_SECRET!

export async function getYtVideoTranscriptions(youtubeLink: string) {
    const { data, error } = await tryCatchAsync(
        axios.post(serviceUrl, {
            secret: serviceSecret,
            youtube_link: youtubeLink,
        })
    )
    if (error) {
        console.error(error)
        return null
    }
    const result = data.data
    if (Array.isArray(result) && result.length > 0) {
        return result as string[]
    } else {
        return null
    }
    return
}
