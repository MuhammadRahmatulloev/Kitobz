import { Link } from "react-router-dom"
import { useFavorites } from "../context/FavoritesContext"
import useCart from "../hooks/useCart"
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { formatPrice, getImageUrl } from "../utils/helpers"

const Favorites = () => {
    const { favorites, removeFavorite } = useFavorites()
    const { addToCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleAddToCart = async (bookId) => {
        if (!user) {
            navigate("/login")
            return
        }
        try {
            await addToCart(bookId)
        } catch {
        }
    }

    return (
        <div className="container">
            <div className="favorites-page">
                <div className="favorites-breadcrumb">
                    <Link to="/profile">Личный Кабинет</Link>
                    <span>Мои закладки</span>
                </div>
                <h1 className="favorites-title">Мои закладки</h1>

                {favorites.length === 0 ? (
                    <div className="cart-empty">
                        <p>Ваши закладки пусты</p>
                        <Link to="/books" className="btn btn--primary">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <div className="favorites-table-wrap">
                        <table className="favorites-table">
                            <thead>
                                <tr>
                                    <th>Изображение</th>
                                    <th>Название товара</th>
                                    <th>Наличие</th>
                                    <th>Цена за единицу товара</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favorites.map((book) => (
                                    <tr key={book.id}>
                                        <td>
                                            <Link to={`/books/${book.id}`} className="favorites-img-wrap">
                                                <img
                                                    src={getImageUrl(book.cover_image)}
                                                    alt={book.title}
                                                    className="favorites-img"
                                                    onError={(e) => { e.target.src = "/no-image.png" }}
                                                />
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/books/${book.id}`} className="favorites-book-title">
                                                {book.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <span className={`favorites-stock ${book.is_available && book.stock > 0 ? "favorites-stock--available" : "favorites-stock--unavailable"}`}>
                                                {book.is_available && book.stock > 0 ? "В наличии" : "Нет в наличии"}
                                            </span>
                                        </td>
                                        <td className="favorites-price">
                                            {formatPrice(book.price)}
                                        </td>
                                        <td>
                                            <div className="favorites-actions">
                                                <button
                                                    className="favorites-btn favorites-btn--cart"
                                                    onClick={() => handleAddToCart(book.id)}
                                                    title="В корзину"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="9" cy="21" r="1"/>
                                                        <circle cx="20" cy="21" r="1"/>
                                                        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="favorites-btn favorites-btn--remove"
                                                    onClick={() => removeFavorite(book.id)}
                                                    title="Удалить"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                        <path d="M10 11v6M14 11v6"/>
                                                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favorites