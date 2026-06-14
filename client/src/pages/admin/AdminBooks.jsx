import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import booksApi from "../../api/booksApi"
import categoriesApi from "../../api/categoriesApi"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/ui/Loader"
import Modal from "../../components/ui/Modal"
import { formatPrice, getImageUrl } from "../../utils/helpers"

const emptyForm = {
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    cover_image: "",
    isbn: "",
    pages: "",
    language: "",
    published_year: "",
    category_id: "",
    is_available: true
}

const AdminBooks = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editBook, setEditBook] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!user) return
        if (user.role !== "admin" && user.role !== "moderator") {
            navigate("/")
            return
        }
        fetchData()
    }, [user])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [booksRes, catsRes] = await Promise.all([
                booksApi.getAll({ limit: 100 }),
                categoriesApi.getAll()
            ])
            setBooks(booksRes.data)
            setCategories(catsRes.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    const openCreate = () => {
        setEditBook(null)
        setForm(emptyForm)
        setError("")
        setModalOpen(true)
    }

    const openEdit = (book) => {
        setEditBook(book)
        setForm({
            title: book.title || "",
            author: book.author || "",
            description: book.description || "",
            price: book.price || "",
            stock: book.stock || "",
            cover_image: book.cover_image || "",
            isbn: book.isbn || "",
            pages: book.pages || "",
            language: book.language || "",
            published_year: book.published_year || "",
            category_id: book.category_id || "",
            is_available: book.is_available
        })
        setError("")
        setModalOpen(true)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError("")
        try {
            const data = {
                title: form.title,
                author: form.author,
                description: form.description || null,
                price: parseFloat(form.price),
                stock: parseInt(form.stock) || 0,
                cover_image: form.cover_image || null,
                isbn: form.isbn || null,
                pages: parseInt(form.pages) || null,
                language: form.language || null,
                published_year: parseInt(form.published_year) || null,
                category_id: form.category_id ? parseInt(form.category_id) : null,
                is_available: form.is_available
            }
            if (editBook) {
                await booksApi.update(editBook.id, data)
            } else {
                await booksApi.create(data)
            }
            setModalOpen(false)
            await fetchData()
        } catch (err) {
            setError(err.response?.data?.detail || "Ошибка сохранения")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить книгу?")) return
        try {
            await booksApi.delete(id)
            await fetchData()
        } catch {
        }
    }

    const filtered = books.filter(
        (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <Loader fullPage />

    return (
        <div className="container">
            <div className="admin-page">
                <div className="admin-header">
                    <div>
                        <Link to="/admin" className="admin-back-link">Панель управления</Link>
                        <h1 className="admin-title">Управление книгами</h1>
                    </div>
                    <button className="btn btn--primary" onClick={openCreate}>
                        Добавить книгу
                    </button>
                </div>

                <div className="admin-search">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Поиск по названию или автору"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="admin-count">{filtered.length} книг</span>
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Обложка</th>
                                <th>Название</th>
                                <th>Автор</th>
                                <th>Цена</th>
                                <th>Остаток</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>
                                        <img
                                            src={getImageUrl(book.cover_image)}
                                            alt={book.title}
                                            className="admin-book-cover"
                                            onError={(e) => { e.target.src = "/no-image.png" }}
                                        />
                                    </td>
                                    <td className="admin-book-title-cell">{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{formatPrice(book.price)}</td>
                                    <td>{book.stock}</td>
                                    <td>
                                        <span className={`admin-badge ${book.is_available && book.stock > 0 ? "admin-badge--success" : "admin-badge--danger"}`}>
                                            {book.is_available && book.stock > 0 ? "В наличии" : "Нет"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-btn admin-btn--edit" onClick={() => openEdit(book)}>
                                                Изменить
                                            </button>
                                            <button className="admin-btn admin-btn--delete" onClick={() => handleDelete(book.id)}>
                                                Удалить
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editBook ? "Редактировать книгу" : "Добавить книгу"}
            >
                <form className="admin-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="admin-form-row">
                        <div className="filter-group">
                            <label className="filter-label">Название *</label>
                            <input name="title" className="input-field" value={form.title} onChange={handleChange} required />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Автор *</label>
                            <input name="author" className="input-field" value={form.author} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="filter-group">
                            <label className="filter-label">Цена *</label>
                            <input name="price" type="number" step="0.01" className="input-field" value={form.price} onChange={handleChange} required />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Остаток</label>
                            <input name="stock" type="number" className="input-field" value={form.stock} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Описание</label>
                        <textarea name="description" className="review-textarea" value={form.description} onChange={handleChange} />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Ссылка на обложку</label>
                        <input name="cover_image" className="input-field" value={form.cover_image} onChange={handleChange} />
                    </div>

                    <div className="admin-form-row">
                        <div className="filter-group">
                            <label className="filter-label">ISBN</label>
                            <input name="isbn" className="input-field" value={form.isbn} onChange={handleChange} />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Язык</label>
                            <input name="language" className="input-field" value={form.language} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="filter-group">
                            <label className="filter-label">Страниц</label>
                            <input name="pages" type="number" className="input-field" value={form.pages} onChange={handleChange} />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Год издания</label>
                            <input name="published_year" type="number" className="input-field" value={form.published_year} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Категория</label>
                        <select name="category_id" className="filter-select" value={form.category_id} onChange={handleChange}>
                            <option value="">Без категории</option>
                            {categories.map((cat) => (
                                <optgroup key={cat.id} label={cat.name}>
                                    <option value={cat.id}>{cat.name}</option>
                                    {cat.subcategories?.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group filter-checkbox">
                        <input type="checkbox" id="is_available" name="is_available" checked={form.is_available} onChange={handleChange} />
                        <label htmlFor="is_available">Доступна для продажи</label>
                    </div>

                    <button type="submit" className="btn btn--primary btn--full" disabled={saving}>
                        {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                </form>
            </Modal>
        </div>
    )
}

export default AdminBooks