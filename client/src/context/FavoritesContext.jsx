import { createContext, useState, useEffect, useContext } from "react"

export const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem("kitobz_favorites")
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem("kitobz_favorites", JSON.stringify(favorites))
    }, [favorites])

    const addFavorite = (book) => {
        setFavorites((prev) => {
            if (prev.find((b) => b.id === book.id)) return prev
            return [...prev, book]
        })
    }

    const removeFavorite = (bookId) => {
        setFavorites((prev) => prev.filter((b) => b.id !== bookId))
    }

    const isFavorite = (bookId) => {
        return favorites.some((b) => b.id === bookId)
    }

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => useContext(FavoritesContext)