import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import booksApi from "../api/booksApi"
import categoriesApi from "../api/categoriesApi"
import BookCard from "../components/ui/BookCard"
import Loader from "../components/ui/Loader"

const Books = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        category_id: searchParams.get("category_id") || "",
        min_price: searchParams.get("min_price") || "",
        max_price: searchParams.get("max_price") || "",
        available_only: searchParams.get("available_only") === "true"
    })

    useEffect(() => {
        categoriesApi.getAll().then((res) => setCategories(res.data))
    }, [])

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            try {
                const params = {}
                if (filters.search) params.search = filters.search
                if (filters.category_id) params.category_id = filters.category_id
                if (filters.min_price) params.min_price = filters.min_price
                if (filters.max_price) params.max_price = filters.max_price
                if (filters.available_only) params.available_only = true

                const res = await booksApi.getAll(params)
                setBooks(res.data)
            } catch {
                setBooks([])
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [filters])

    useEffect(() => {
        setFilters({
            search: searchParams.get("search") || "",
            category_id: searchParams.get("category_id") || "",
            min_price: searchParams.get("min_price") || "",
            max_price: searchParams.get("max_price") || "",
            available_only: searchParams.get("available_only") === "true"
        })
    }, [searchParams])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const applyFilters = (e) => {
        e.preventDefault()
        const params = {}
        if (filters.search) params.search = filters.search
        if (filters.category_id) params.category_id = filters.category_id
        if (filters.min_price) params.min_price = filters.min_price
        if (filters.max_price) params.max_price = filters.max_price
        if (filters.available_only) params.available_only = "true"
        setSearchParams(params)
    }

    const resetFilters = () => {
        setFilters({
            search: "",
            category_id: "",
            min_price: "",
            max_price: "",
            available_only: false
        })
        setSearchParams({})
    }

    return (
        <div className="container">
            <div className="catalog-page">
                <aside className="catalog-sidebar">
                    <h3 className="catalog-sidebar-title">Фильтры</h3>

                    <form className="catalog-filters" onSubmit={applyFilters}>
                        <div className="filter-group">
                            <label className="filter-label">Поиск</label>
                            <input
                                type="text"
                                name="search"
                                className="input-field"
                                value={filters.search}
                                onChange={handleChange}
                                placeholder="Название или автор"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Категория</label>
                            <select
                                name="category_id"
                                className="filter-select"
                                value={filters.category_id}
                                onChange={handleChange}
                            >
                                <option value="">Все категории</option>
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

                        <div className="filter-group">
                            <label className="filter-label">Цена, сомони</label>
                            <div className="filter-price-row">
                                <input
                                    type="number"
                                    name="min_price"
                                    className="input-field"
                                    value={filters.min_price}
                                    onChange={handleChange}
                                    placeholder="От"
                                />
                                <input
                                    type="number"
                                    name="max_price"
                                    className="input-field"
                                    value={filters.max_price}
                                    onChange={handleChange}
                                    placeholder="До"
                                />
                            </div>
                        </div>

                        <div className="filter-group filter-checkbox">
                            <input
                                type="checkbox"
                                id="available_only"
                                name="available_only"
                                checked={filters.available_only}
                                onChange={handleChange}
                            />
                            <label htmlFor="available_only">Только в наличии</label>
                        </div>

                        <button type="submit" className="btn btn--primary btn--full">
                            Применить
                        </button>
                        <button type="button" className="btn btn--outline btn--full" onClick={resetFilters}>
                            Сбросить
                        </button>
                    </form>
                </aside>

                <div className="catalog-content">
                    <h1 className="catalog-title">Каталог книг</h1>

                    {loading ? (
                        <Loader />
                    ) : books.length === 0 ? (
                        <p className="catalog-empty">Книги не найдены</p>
                    ) : (
                        <div className="books-grid books-grid--4">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Books