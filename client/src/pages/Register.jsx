import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authApi from "../api/authApi"
import useAuth from "../hooks/useAuth"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"

const Register = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({
        username: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const validate = () => {
        const newErrors = {}
        if (!form.phone.trim()) {
            newErrors.phone = "Введите номер телефона"
        }
        if (!form.email.trim()) {
            newErrors.email = "Введите email"
        }
        if (!form.password) {
            newErrors.password = "Введите пароль"
        }
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают"
        }
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setLoading(true)
        try {
            await authApi.register({
                username: form.username || undefined,
                phone: form.phone,
                email: form.email,
                password: form.password
            })
            await login(form.email, form.password)
            navigate("/")
        } catch (err) {
            setErrors({ general: err.response?.data?.detail || "Ошибка регистрации" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="auth-page">
                <h1 className="auth-title">Быстрая регистрация</h1>
                <p className="auth-subtitle">
                    Если Вы уже зарегистрированы, перейдите на страницу{" "}
                    <Link to="/login" className="auth-link">входа в систему</Link>.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {errors.general && <div className="auth-error">{errors.general}</div>}

                    <Input
                        label="😉 Имя"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder=""
                    />
                    <Input
                        label="📞 Телефон *"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Пример: 903022298"
                        error={errors.phone}
                    />
                    <Input
                        label="📨 Ваш E-mail *"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Например bajanaja20@yandex.com"
                        error={errors.email}
                    />
                    <Input
                        label="🔐 Пароль"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <Input
                        label="🔓 Подтвердите пароль"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Загрузка..." : "Продолжить"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Register