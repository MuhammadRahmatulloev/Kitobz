import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ordersApi from "../../api/ordersApi"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/ui/Loader"
import { formatPrice } from "../../utils/helpers"

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

const statusLabels = {
    pending: "В обработке",
    confirmed: "Подтверждён",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён"
}

const AdminOrders = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    useEffect(() => {
        if (!user) return
        if (user.role !== "admin" && user.role !== "moderator") {
            navigate("/")
            return
        }
        fetchOrders()
    }, [user])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await ordersApi.getAll()
            setOrders(res.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId, status) => {
        setUpdating(orderId)
        try {
            const res = await ordersApi.updateStatus(orderId, { status })
            setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)))
        } catch {
        } finally {
            setUpdating(null)
        }
    }

    const filtered = orders.filter((o) => {
        const matchSearch = search
            ? String(o.id).includes(search) ||
              (o.delivery_city || "").toLowerCase().includes(search.toLowerCase()) ||
              (o.delivery_address || "").toLowerCase().includes(search.toLowerCase())
            : true
        const matchStatus = statusFilter ? o.status === statusFilter : true
        return matchSearch && matchStatus
    })

    if (loading) return <Loader fullPage />

    return (
        <div className="container">
            <div className="admin-page">
                <div className="admin-header">
                    <div>
                        <Link to="/admin" className="admin-back-link">Панель управления</Link>
                        <h1 className="admin-title">Управление заказами</h1>
                    </div>
                </div>

                <div className="admin-search">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Поиск по номеру, городу или адресу"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="filter-select admin-status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Все статусы</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                    </select>
                    <span className="admin-count">{filtered.length} заказов</span>
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Пользователь</th>
                                <th>Адрес</th>
                                <th>Товаров</th>
                                <th>Сумма</th>
                                <th>Дата</th>
                                <th>Статус</th>
                                <th>Изменить статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_id}</td>
                                    <td className="admin-order-address">
                                        {order.delivery_city && (
                                            <span>{order.delivery_city}</span>
                                        )}
                                        {order.delivery_address && (
                                            <span className="admin-order-address-sub">{order.delivery_address}</span>
                                        )}
                                    </td>
                                    <td>{order.items.length}</td>
                                    <td>{formatPrice(order.total_price)}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString("ru-RU")}</td>
                                    <td>
                                        <span className={`order-status order-status--${order.status}`}>
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="admin-status-select"
                                            value={order.status}
                                            disabled={updating === order.id}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>{statusLabels[s]}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminOrders