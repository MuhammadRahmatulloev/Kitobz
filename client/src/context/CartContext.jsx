import { createContext, useState, useEffect, useContext } from "react"
import cartApi from "../api/cartApi"
import { AuthContext } from "./AuthContext"

export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [cart, setCart] = useState([])
    const [cartLoading, setCartLoading] = useState(false)

    const fetchCart = async () => {
        if (!user) {
            setCart([])
            return
        }
        setCartLoading(true)
        try {
            const res = await cartApi.getCart()
            setCart(res.data)
        } catch {
            setCart([])
        } finally {
            setCartLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [user])

    const addToCart = async (bookId, quantity = 1) => {
        await cartApi.addItem({ book_id: bookId, quantity })
        await fetchCart()
    }

    const updateItem = async (itemId, quantity) => {
        await cartApi.updateItem(itemId, { quantity })
        await fetchCart()
    }

    const removeItem = async (itemId) => {
        await cartApi.removeItem(itemId)
        await fetchCart()
    }

    const clearCart = async () => {
        await cartApi.clearCart()
        setCart([])
    }

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cart,
            cartLoading,
            addToCart,
            updateItem,
            removeItem,
            clearCart,
            fetchCart,
            totalCount,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    )
}