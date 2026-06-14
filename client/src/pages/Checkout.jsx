import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useCart from "../hooks/useCart"
import ordersApi from "../api/ordersApi"
import Button from "../components/ui/Button"
import { formatPrice, getImageUrl } from "../utils/helpers"

const Checkout = () => {
    const { cart, totalPrice, fetchCart } = useCart()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        delivery_address: "",
        delivery_city: "",
        is_dushanbe: true
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const deliveryCost = form.is_dushanbe ? 5 : 10
    const totalWithDelivery = totalPrice + deliveryCost

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.delivery_address.trim() || !form.delivery_city.trim()) {
            setError("Заполните адрес и город доставки")
            return
        }
        setLoading(true)
        setError("")
        try {
            const res = await ordersApi.create(form)
            await fetchCart()
            navigate("/orders")
        } catch (err) {
            setError(err.response?.data?.detail || "Не удалось оформить заказ")
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="container">
                <div className="checkout-page">
                    <h1 className="orders-title">Оформление заказа</h1>
                    <p className="catalog-empty">Ваша корзина пуста</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="checkout-page">
                <h1 className="orders-title">Оформление заказа</h1>

                <div className="checkout-grid">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        {error && <div className="auth-error">{error}</div>}

                        <div className="filter-group">
                            <label className="filter-label">Город</label>
                            <input
                                type="text"
                                name="delivery_city"
                                className="input-field"
                                value={form.delivery_city}
                                onChange={handleChange}
                                placeholder="Душанбе"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Адрес доставки</label>
                            <input
                                type="text"
                                name="delivery_address"
                                className="input-field"
                                value={form.delivery_address}
                                onChange={handleChange}
                                placeholder="Улица, дом, квартира"
                            />
                        </div>

                        <div className="filter-group filter-checkbox">
                            <input
                                type="checkbox"
                                id="is_dushanbe"
                                name="is_dushanbe"
                                checked={form.is_dushanbe}
                                onChange={handleChange}
                            />
                            <label htmlFor="is_dushanbe">Доставка по Душанбе</label>
                        </div>

                        <Button type="submit" disabled={loading} fullWidth>
                            {loading ? "Оформление..." : "Подтвердить заказ"}
                        </Button>
                    </form>

                    <div className="checkout-summary">
                        <h3 className="checkout-summary-title">Ваш заказ</h3>

                        <div className="checkout-items">
                            {cart.map((item) => (
                                <div key={item.id} className="checkout-item">
                                    <img
                                        src={getImageUrl(item.book.cover_image)}
                                        alt={item.book.title}
                                        className="checkout-item-image"
                                        onError={(e) => { e.target.src = "/no-image.png" }}
                                    />
                                    <div className="checkout-item-info">
                                        <span className="checkout-item-title">{item.book.title}</span>
                                        <span className="checkout-item-meta">
                                            {item.quantity} x {formatPrice(item.book.price)}
                                        </span>
                                    </div>
                                    <span className="checkout-item-price">
                                        {formatPrice(item.book.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-totals">
                            <div className="cart-summary-row">
                                <span>Товары</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Доставка</span>
                                <span>{formatPrice(deliveryCost)}</span>
                            </div>
                            <div className="cart-summary-row cart-summary-row--total">
                                <span>Итого</span>
                                <span>{formatPrice(totalWithDelivery)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout