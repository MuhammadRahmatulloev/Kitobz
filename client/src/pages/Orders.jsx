import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ordersApi from "../api/ordersApi"
import Loader from "../components/ui/Loader"
import { formatPrice, getImageUrl } from "../utils/helpers"

const statusLabels = {
    pending: "В обработке",
    confirmed: "Подтверждён",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён"
}

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await ordersApi.getMyOrders()
                setOrders(res.data)
            } catch {
                setOrders([])
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const handleCancel = async (orderId) => {
        setCancellingId(orderId)
        try {
            const res = await ordersApi.cancelOrder(orderId)
            setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)))
        } catch {
        } finally {
            setCancellingId(null)
        }
    }

    if (loading) {
        return <Loader fullPage />
    }

    return (
        <div className="container">
            <div className="orders-page">
                <h1 className="orders-title">История заказов</h1>

                {orders.length === 0 ? (
                    <div className="cart-empty">
                        <p>У Вас пока нет заказов</p>
                        <Link to="/books" className="btn btn--primary">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <div>
                                        <span className="order-card-id">Заказ №{order.id}</span>
                                        <span className="order-card-date">
                                            {new Date(order.created_at).toLocaleDateString("ru-RU")}
                                        </span>
                                    </div>
                                    <span className={`order-status order-status--${order.status}`}>
                                        {statusLabels[order.status] || order.status}
                                    </span>
                                </div>

                                <div className="order-card-items">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="order-item">
                                            <Link to={`/books/${item.book_id}`} className="order-item-image-wrap">
                                                <img
                                                    src={getImageUrl(item.book.cover_image)}
                                                    alt={item.book.title}
                                                    className="order-item-image"
                                                    onError={(e) => { e.target.src = "/no-image.png" }}
                                                />
                                            </Link>
                                            <div className="order-item-info">
                                                <Link to={`/books/${item.book_id}`} className="order-item-title">
                                                    {item.book.title}
                                                </Link>
                                                <span className="order-item-meta">
                                                    {item.quantity} x {formatPrice(item.price_at_order)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-card-delivery">
                                        {order.delivery_city && (
                                            <span>{order.delivery_city}, {order.delivery_address}</span>
                                        )}
                                        <span>Доставка: {formatPrice(order.delivery_cost)}</span>
                                    </div>

                                    <div className="order-card-total">
                                        <span className="order-card-total-label">Итого</span>
                                        <span className="order-card-total-value">{formatPrice(order.total_price)}</span>
                                    </div>

                                    {order.status === "pending" && (
                                        <button
                                            className="btn btn--outline btn--sm"
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancellingId === order.id}
                                        >
                                            {cancellingId === order.id ? "Отмена..." : "Отменить заказ"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders