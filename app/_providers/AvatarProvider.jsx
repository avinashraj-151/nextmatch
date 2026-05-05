"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AvatarContext = createContext({
    avatar: null,
    setAvatar: () => {},
})

export const AvatarProvider = ({ initialAvatar = null, children }) => {
    const [avatar, setAvatar] = useState(initialAvatar ?? null)
    useEffect(() => {
        setAvatar(initialAvatar ?? null)
    }, [initialAvatar])

    return (
        <AvatarContext.Provider value={{ avatar, setAvatar }}>
            {children}
        </AvatarContext.Provider>
    )
}

export const useAvatar = () => useContext(AvatarContext)
