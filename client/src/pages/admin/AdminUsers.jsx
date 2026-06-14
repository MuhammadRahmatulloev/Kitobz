import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import usersApi from "../../api/usersApi"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/ui/Loader"

const ROLES = ["user", "moderator", "admin"]

const AdminUsers = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        if (!user) return
        if (user.role !== "admin") {
            navigate("/")
            return
        }
        fetchUsers()
    }, [user])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await usersApi.getAll()
            setUsers(res.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId, role) => {
        setUpdating(userId + "_role")
        try {
            const res = await usersApi.changeRole(userId, role)
            setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)))
        } catch {
        } finally {
            setUpdating(null)
        }
    }

    const handleTogglePremium = async (userId) => {
        setUpdating(userId + "_premium")
        try {
            const res = await usersApi.togglePremium(userId)
            setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)))
        } catch {
        } finally {
            setUpdating(null)
        }
    }

    const handleDeactivate = async (userId) => {
        if (!window.confirm("Деактивировать пользователя?")) return
        setUpdating(userId + "_deactivate")
        try {
            const res = await usersApi.deactivate(userId)
            setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)))
        } catch {
        } finally {
            setUpdating(null)
        }
    }

    const filtered = users.filter((u) => {
        if (!search) return true
        return (
            (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (u.phone || "").includes(search)
        )
    })

    if (loading) return <Loader fullPage />

    return (
        <div className="container">
            <div className="admin-page">
                <div className="admin-header">
                    <div>
                        <Link to="/admin" className="admin-back-link">Панель управления</Link>
                        <h1 className="admin-title">Управление пользователями</h1>
                    </div>
                </div>

                <div className="admin-search">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Поиск по имени, email или телефону"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="admin-count">{filtered.length} пользователей</span>
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Телефон</th>
                                <th>Email</th>
                                <th>Роль</th>
                                <th>Премиум</th>
                                <th>Статус</th>
                                <th>Дата</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.username || "Не указано"}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.email || "Не указано"}</td>
                                    <td>
                                        <select
                                            className="admin-status-select"
                                            value={u.role}
                                            disabled={updating === u.id + "_role" || u.id === user.id}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        >
                                            {ROLES.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${u.is_premium ? "admin-badge--premium" : "admin-badge--user"}`}>
                                            {u.is_premium ? "Premium" : "Обычный"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${u.is_active ? "admin-badge--success" : "admin-badge--danger"}`}>
                                            {u.is_active ? "Активен" : "Отключён"}
                                        </span>
                                    </td>
                                    <td>{new Date(u.created_at).toLocaleDateString("ru-RU")}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-btn admin-btn--success"
                                                disabled={updating === u.id + "_premium"}
                                                onClick={() => handleTogglePremium(u.id)}
                                            >
                                                {u.is_premium ? "Убрать Premium" : "Дать Premium"}
                                            </button>
                                            {u.is_active && u.id !== user.id && (
                                                <button
                                                    className="admin-btn admin-btn--delete"
                                                    disabled={updating === u.id + "_deactivate"}
                                                    onClick={() => handleDeactivate(u.id)}
                                                >
                                                    Деактивировать
                                                </button>
                                            )}
                                        </div>
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

export default AdminUsers