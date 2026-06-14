import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email.trim() || !form.password) {
            setError("Заполните все поля")
            return
        }
        setLoading(true)
        setError("")
        try {
            await login(form.email, form.password)
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.detail || "Неверный email или пароль")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="auth-page">
                <h1 className="auth-title">Авторизация</h1>

                <div className="auth-grid">
                    <div className="auth-box">
                        <h3 className="auth-box-title">Зарегистрированный клиент</h3>
                        <p className="auth-box-subtitle">Войти в Личный Кабинет</p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="auth-error">{error}</div>}

                            <Input
                                name="email"
                                type="email"
                                placeholder="E-Mail"
                                value={form.email}
                                onChange={handleChange}
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Пароль"
                                value={form.password}
                                onChange={handleChange}
                            />

                            <div className="auth-actions">
                                <Button type="submit" variant="secondary" disabled={loading}>
                                    {loading ? "Загрузка..." : "Войти"}
                                </Button>
                                <Link to="/forgot-password" className="auth-link">Забыли пароль?</Link>
                            </div>
                        </form>
                    </div>

                    <div className="auth-box">
                        <h3 className="auth-box-title">Новый клиент</h3>
                        <p className="auth-box-subtitle">Регистрация</p>
                        <p className="auth-box-text">
                            Создание учетной записи поможет покупать быстрее. Вы сможете
                            контролировать состояние заказа, а также просматривать заказы сделанные
                            ранее. Вы сможете накапливать призовые баллы и получать скидочные купоны.
                        </p>
                        <p className="auth-box-text">
                            А постоянным покупателям мы предлагаем гибкую систему скидок и
                            персональное обслуживание.
                        </p>

                        <Link to="/register">
                            <Button variant="secondary">Продолжить</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login