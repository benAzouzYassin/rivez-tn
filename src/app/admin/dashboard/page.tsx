"use client"

import ImageUpload from "@/components/shared/image-upload"
import { useState } from "react"

export default function Page() {
    const [imgUrl, setImageUrl] = useState<string | null>(null)
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <ImageUpload onImageUrlChange={setImageUrl} imageUrl={imgUrl} />
            {imgUrl}
        </div>
    )
}
