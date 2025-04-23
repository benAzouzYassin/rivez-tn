import { useState, useEffect } from "react"

function useIsRTL() {
    const [isRTL, setIsRTL] = useState(false)

    useEffect(() => {
        const htmlElement = document.querySelector("html")
        if (htmlElement) {
            setIsRTL(getComputedStyle(htmlElement).direction === "rtl")
        } else {
            setIsRTL(document.documentElement.getAttribute("dir") === "rtl")
        }
    }, [])

    return isRTL
}

export default useIsRTL
