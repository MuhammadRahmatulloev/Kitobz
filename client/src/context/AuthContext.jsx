import { createContext, useState, useEffect } from "react"
import authApi from "../api/authApi"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            authApi.getMe()
                .then((res) => setUser(res.data))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const res = await authApi.login({ email, password })
        localStorage.setItem("token", res.data.access_token)
        const me = await authApi.getMe()
        setUser(me.data)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}