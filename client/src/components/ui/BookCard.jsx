import { Link } from "react-router-dom"
import useCart from "../../hooks/useCart"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { formatPrice, truncateText, getImageUrl } from "../../utils/helpers"

const BookCard = ({ book }) => {
    const { addToCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleAddToCart = async (e) => {
        e.preventDefault()
        if (!user) {
            navigate("/login")
            return
        }
        try {
            await addToCart(book.id)
        } catch {
        }
    }

    return (
        <Link to={`/books/${book.id}`} className="book-card">
            <div className="book-card-img-wrap">
                <img
                    src={getImageUrl(book.cover_image)}
                    alt={book.title}
                    className="book-card-img"
                    onError={(e) => { e.target.src = "/no-image.png" }}
                />
                {book.is_available && book.stock > 0 && (
                    <span className="book-card-available">✓</span>
                )}
            </div>
            <div className="book-card-info">
                <div className="book-card-title">{truncateText(book.title, 45)}</div>
                <div className="book-card-author">{book.author}</div>
                <div className="book-card-price">{formatPrice(book.price)}</div>
            </div>
            <button className="book-card-btn" onClick={handleAddToCart}>
                В корзину
            </button>
        </Link>
    )
}

export default BookCard