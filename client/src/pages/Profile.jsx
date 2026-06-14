import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import authApi from "../api/authApi"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"

const Profile = () => {
    const { user, logout, setUser } = useAuth()
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || ""
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")
        try {
            const res = await authApi.updateMe(form)
            setUser(res.data)
            setSuccess("Данные успешно обновлены")
            setEditMode(false)
        } catch (err) {
            setError(err.response?.data?.detail || "Ошибка обновления данных")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    if (!user) {
        return null
    }

    return (
        <div className="container">
            <h1 className="profile-title">Личный Кабинет</h1>

            <div className="profile-grid">
                <div className="profile-box">
                    <h3 className="profile-box-title">👤 Моя учетная запись</h3>

                    {!editMode ? (
                        <div className="profile-info">
                            <div className="profile-info-row">
                                <span className="profile-info-label">Имя</span>
                                <span className="profile-info-value">{user.username || "Не указано"}</span>
                            </div>
                            <div className="profile-info-row">
                                <span className="profile-info-label">Телефон</span>
                                <span className="profile-info-value">{user.phone}</span>
                            </div>
                            <div className="profile-info-row">
                                <span className="profile-info-label">Email</span>
                                <span className="profile-info-value">{user.email || "Не указано"}</span>
                            </div>
                            <div className="profile-info-row">
                                <span className="profile-info-label">Статус</span>
                                <span className="profile-info-value">
                                    {user.is_premium ? "Premium" : "Обычный"}
                                </span>
                            </div>
                            <button className="profile-link" onClick={() => setEditMode(true)}>
                                Изменить контактную информацию
                            </button>
                        </div>
                    ) : (
                        <form className="profile-form" onSubmit={handleSave}>
                            {error && <div className="auth-error">{error}</div>}

                            <Input
                                label="Имя"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                            />
                            <Input
                                label="Телефон"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                            />

                            <div className="auth-actions">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Сохранение..." : "Сохранить"}
                                </Button>
                                <button
                                    type="button"
                                    className="profile-link"
                                    onClick={() => setEditMode(false)}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    )}

                    {success && <div className="profile-success">{success}</div>}
                </div>

                <div className="profile-box">
                    <h3 className="profile-box-title">💼 Мои заказы</h3>
                    <Link to="/orders" className="profile-link-block">
                        История заказов
                    </Link>
                    <button className="profile-link-block" onClick={handleLogout}>
                        Выход
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile