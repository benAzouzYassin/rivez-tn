import { useState, useEffect } from "react"
export const useIsSmallScreen = (breakpoint = 1050): boolean => {
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
        if (typeof window === "undefined") return false
        return window.innerWidth < breakpoint
    })

    useEffect(() => {
        if (typeof window === "undefined") return

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < breakpoint)
        }

        window.addEventListener("resize", checkScreenSize)

        checkScreenSize()

        return () => {
            window.removeEventListener("resize", checkScreenSize)
        }
    }, [breakpoint])

    return isSmallScreen
}
