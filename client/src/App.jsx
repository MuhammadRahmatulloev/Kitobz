import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { FavoritesProvider } from "./context/FavoritesContext"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import Books from "./pages/Books"
import BookDetail from "./pages/BookDetail"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Favorites from "./pages/Favorites"
import Dashboard from "./pages/admin/Dashboard"
import AdminBooks from "./pages/admin/AdminBooks"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminOrders from "./pages/admin/AdminOrders"
import "./App.css"
import Checkout from "./pages/Checkout"

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <FavoritesProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="books" element={<Books />} />
                                <Route path="books/:id" element={<BookDetail />} />
                                <Route path="cart" element={<Cart />} />
                                <Route path="checkout" element={<Checkout />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="favorites" element={<Favorites />} />
                                <Route path="admin" element={<Dashboard />} />
                                <Route path="admin/books" element={<AdminBooks />} />
                                <Route path="admin/users" element={<AdminUsers />} />
                                <Route path="admin/orders" element={<AdminOrders />} />
                            </Route>
                        </Routes>
                    </FavoritesProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App