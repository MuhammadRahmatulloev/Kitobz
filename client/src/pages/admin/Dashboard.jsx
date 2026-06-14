import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import booksApi from "../../api/booksApi"
import usersApi from "../../api/usersApi"
import ordersApi from "../../api/ordersApi"
import Loader from "../../components/ui/Loader"

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({ books: 0, users: 0, orders: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        if (user.role !== "admin" && user.role !== "moderator") {
            navigate("/")
            return
        }
        const fetchStats = async () => {
            try {
                const [booksRes, usersRes, ordersRes] = await Promise.all([
                    booksApi.getAll({ limit: 1 }),
                    user.role === "admin" ? usersApi.getAll() : Promise.resolve({ data: [] }),
                    ordersApi.getAll()
                ])
                setStats({
                    books: booksRes.data.length,
                    users: usersRes.data.length,
                    orders: ordersRes.data.length
                })
            } catch {
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [user])

    if (loading) return <Loader fullPage />

    return (
        <div className="container">
            <div className="admin-page">
                <h1 className="admin-title">Панель управления</h1>

                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="admin-stat-value">{stats.books}</div>
                        <div className="admin-stat-label">Книг</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-value">{stats.orders}</div>
                        <div className="admin-stat-label">Заказов</div>
                    </div>
                    {user.role === "admin" && (
                        <div className="admin-stat-card">
                            <div className="admin-stat-value">{stats.users}</div>
                            <div className="admin-stat-label">Пользователей</div>
                        </div>
                    )}
                </div>

                <div className="admin-nav-cards">
                    <Link to="/admin/books" className="admin-nav-card">
                        <div className="admin-nav-card-icon">книги</div>
                        <div className="admin-nav-card-title">Управление книгами</div>
                        <div className="admin-nav-card-desc">Добавить, редактировать, удалить книги</div>
                    </Link>
                    <Link to="/admin/orders" className="admin-nav-card">
                        <div className="admin-nav-card-icon">заказы</div>
                        <div className="admin-nav-card-title">Управление заказами</div>
                        <div className="admin-nav-card-desc">Изменить статус заказов</div>
                    </Link>
                    {user.role === "admin" && (
                        <Link to="/admin/users" className="admin-nav-card">
                            <div className="admin-nav-card-icon">польз</div>
                            <div className="admin-nav-card-title">Управление пользователями</div>
                            <div className="admin-nav-card-desc">Роли, премиум, деактивация</div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard