import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import booksApi from "../api/booksApi"
import reviewsApi from "../api/reviewsApi"
import useAuth from "../hooks/useAuth"
import useCart from "../hooks/useCart"
import { useFavorites } from "../context/FavoritesContext"
import BookCard from "../components/ui/BookCard"
import Loader from "../components/ui/Loader"
import { formatPrice, getImageUrl } from "../utils/helpers"

const tabs = [
    { key: "description", label: "Описание" },
    { key: "specs", label: "Характеристики" },
    { key: "reviews", label: "Отзывы" }
]

const BookDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()
    const { addFavorite, removeFavorite, isFavorite } = useFavorites()

    const [book, setBook] = useState(null)
    const [related, setRelated] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("description")
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)

    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
    const [reviewError, setReviewError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const bookRes = await booksApi.getById(id)
                setBook(bookRes.data)
                setQuantity(1)

                const reviewsRes = await reviewsApi.getByBook(id)
                setReviews(reviewsRes.data)

                if (bookRes.data.category_id) {
                    const relatedRes = await booksApi.getAll({
                        category_id: bookRes.data.category_id,
                        limit: 6
                    })
                    setRelated(relatedRes.data.filter((b) => b.id !== bookRes.data.id))
                }
            } catch {
                setBook(null)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login")
            return
        }
        setAdding(true)
        try {
            await addToCart(book.id, quantity)
        } catch {
        } finally {
            setAdding(false)
        }
    }

    const handleToggleFavorite = () => {
        if (isFavorite(book.id)) {
            removeFavorite(book.id)
        } else {
            addFavorite(book)
        }
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            navigate("/login")
            return
        }
        setReviewError("")
        try {
            const res = await reviewsApi.create(id, reviewForm)
            setReviews([...reviews, res.data])
            setReviewForm({ rating: 5, comment: "" })
        } catch (err) {
            setReviewError(err.response?.data?.detail || "Не удалось добавить отзыв")
        }
    }

    if (loading) {
        return <Loader fullPage />
    }

    if (!book) {
        return (
            <div className="container">
                <p className="catalog-empty">Книга не найдена</p>
            </div>
        )
    }

    const favorited = isFavorite(book.id)

    return (
        <div className="container">
            <div className="book-detail">
                <div className="book-detail-image-wrap">
                    <img
                        src={getImageUrl(book.cover_image)}
                        alt={book.title}
                        className="book-detail-image"
                        onError={(e) => { e.target.src = "/no-image.png" }}
                    />
                </div>

                <div className="book-detail-main">
                    <h1 className="book-detail-title">{book.title}</h1>
                    <p className="book-detail-author">{book.author}</p>

                    {book.description && (
                        <p className="book-detail-short-desc">
                            {book.description.slice(0, 200)}
                            {book.description.length > 200 ? "..." : ""}
                        </p>
                    )}

                    <table className="book-detail-table">
                        <tbody>
                            {book.published_year && (
                                <tr>
                                    <td>Год издания</td>
                                    <td>{book.published_year}</td>
                                </tr>
                            )}
                            {book.pages && (
                                <tr>
                                    <td>Кол-во страниц</td>
                                    <td>{book.pages}</td>
                                </tr>
                            )}
                            {book.language && (
                                <tr>
                                    <td>Язык</td>
                                    <td>{book.language}</td>
                                </tr>
                            )}
                            {book.isbn && (
                                <tr>
                                    <td>ISBN</td>
                                    <td>{book.isbn}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="book-detail-side">
                    <div className="book-detail-price-row">
                        <div className="book-detail-price">{formatPrice(book.price)}</div>
                        <button
                            className={`book-favorite-btn ${favorited ? "book-favorite-btn--active" : ""}`}
                            onClick={handleToggleFavorite}
                            title={favorited ? "Убрать из закладок" : "В закладки"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                            </svg>
                        </button>
                    </div>

                    {book.is_available && book.stock > 0 ? (
                        <span className="book-detail-stock book-detail-stock--available">
                            В наличии
                        </span>
                    ) : (
                        <span className="book-detail-stock book-detail-stock--unavailable">
                            Нет в наличии
                        </span>
                    )}

                    <div className="book-detail-actions">
                        <div className="quantity-control">
                            <button
                                type="button"
                                className="quantity-btn"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            >
                                −
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button
                                type="button"
                                className="quantity-btn"
                                onClick={() => setQuantity((q) => q + 1)}
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="btn btn--primary btn--lg"
                            onClick={handleAddToCart}
                            disabled={adding || !book.is_available || book.stock < 1}
                        >
                            {adding ? "Добавление..." : "Купить"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="book-tabs">
                <div className="book-tabs-header">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`book-tab-btn ${activeTab === tab.key ? "book-tab-btn--active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            {tab.key === "reviews" ? ` (${reviews.length})` : ""}
                        </button>
                    ))}
                </div>

                <div className="book-tabs-content">
                    {activeTab === "description" && (
                        <p className="book-description-text">
                            {book.description || "Описание отсутствует"}
                        </p>
                    )}

                    {activeTab === "specs" && (
                        <table className="book-detail-table">
                            <tbody>
                                <tr>
                                    <td>Автор</td>
                                    <td>{book.author}</td>
                                </tr>
                                {book.published_year && (
                                    <tr>
                                        <td>Год издания</td>
                                        <td>{book.published_year}</td>
                                    </tr>
                                )}
                                {book.pages && (
                                    <tr>
                                        <td>Кол-во страниц</td>
                                        <td>{book.pages}</td>
                                    </tr>
                                )}
                                {book.language && (
                                    <tr>
                                        <td>Язык</td>
                                        <td>{book.language}</td>
                                    </tr>
                                )}
                                {book.isbn && (
                                    <tr>
                                        <td>ISBN</td>
                                        <td>{book.isbn}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "reviews" && (
                        <div className="book-reviews">
                            {reviews.length === 0 ? (
                                <p className="catalog-empty">Отзывов пока нет</p>
                            ) : (
                                <div className="reviews-list">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="review-card">
                                            <div className="review-rating">
                                                {"★".repeat(review.rating)}
                                                {"☆".repeat(5 - review.rating)}
                                            </div>
                                            {review.comment && (
                                                <p className="review-comment">{review.comment}</p>
                                            )}
                                            <span className="review-date">
                                                {new Date(review.created_at).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form className="review-form" onSubmit={handleReviewSubmit}>
                                <h4 className="review-form-title">Оставить отзыв</h4>
                                {reviewError && <div className="auth-error">{reviewError}</div>}

                                <div className="filter-group">
                                    <label className="filter-label">Оценка</label>
                                    <select
                                        className="filter-select"
                                        value={reviewForm.rating}
                                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                    >
                                        {[5, 4, 3, 2, 1].map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <textarea
                                    className="review-textarea"
                                    placeholder="Ваш отзыв"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                />

                                <button type="submit" className="btn btn--primary">
                                    Отправить
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {related.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Рекомендуемые книги</h3>
                    </div>
                    <div className="books-grid">
                        {related.map((b) => (
                            <BookCard key={b.id} book={b} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default BookDetail