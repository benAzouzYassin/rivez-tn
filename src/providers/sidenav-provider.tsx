"use client"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import React, { createContext, useContext, ReactNode, useState } from "react"

interface SidenavContextType {
    isSidenavOpen: boolean
    toggleSidenav: () => void
}

const SidenavContext = createContext<SidenavContextType | undefined>(undefined)

interface SidenavProviderProps {
    children: ReactNode
}

export const SidenavProvider: React.FC<SidenavProviderProps> = ({
    children,
}) => {
    const isSmallScreen = useIsSmallScreen()
    const [isSidenavOpen, setIsSidenavOpen] = useState(true)

    const toggleSidenav = () => setIsSidenavOpen((prev) => !prev)

    const value = {
        isSidenavOpen: isSidenavOpen && isSmallScreen === false,
        toggleSidenav,
    }

    return (
        <SidenavContext.Provider value={value}>
            {children}
        </SidenavContext.Provider>
    )
}

export const useSidenav = () => {
    const context = useContext(SidenavContext)
    if (context === undefined) {
        throw new Error("useSidenav must be used within a SidenavProvider")
    }
    return context
}
