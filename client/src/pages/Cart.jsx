import { Link, useNavigate } from "react-router-dom"
import useCart from "../hooks/useCart"
import { formatPrice, getImageUrl } from "../utils/helpers"

const Cart = () => {
    const { cart, cartLoading, updateItem, removeItem, totalPrice, totalCount } = useCart()
    const navigate = useNavigate()

    const handleQuantityChange = async (itemId, quantity) => {
        if (quantity < 1) return
        await updateItem(itemId, quantity)
    }

    const handleRemove = async (itemId) => {
        await removeItem(itemId)
    }

    const handleCheckout = () => {
        navigate("/checkout")
    }

    if (cartLoading) {
        return (
            <div className="container">
                <p className="catalog-empty">Загрузка...</p>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="cart-page">
                <h1 className="cart-title">Корзина покупок</h1>

                {cart.length === 0 ? (
                    <div className="cart-empty">
                        <p>Ваша корзина пуста!</p>
                        <Link to="/books" className="btn btn--primary">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-list">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <Link to={`/books/${item.book_id}`} className="cart-item-image-wrap">
                                        <img
                                            src={getImageUrl(item.book.cover_image)}
                                            alt={item.book.title}
                                            className="cart-item-image"
                                            onError={(e) => { e.target.src = "/no-image.png" }}
                                        />
                                    </Link>

                                    <div className="cart-item-info">
                                        <Link to={`/books/${item.book_id}`} className="cart-item-title">
                                            {item.book.title}
                                        </Link>
                                        <span className="cart-item-author">{item.book.author}</span>
                                    </div>

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            type="button"
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-price">
                                        {formatPrice(item.book.price * item.quantity)}
                                    </div>

                                    <button
                                        className="cart-item-remove"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="cart-summary-row">
                                <span>Товаров</span>
                                <span>{totalCount}</span>
                            </div>
                            <div className="cart-summary-row cart-summary-row--total">
                                <span>Итого</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <button className="btn btn--primary btn--lg btn--full" onClick={handleCheckout}>
                                Оформить заказ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Cart