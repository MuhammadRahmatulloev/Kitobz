import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import useCart from "../../hooks/useCart"
import { useFavorites } from "../../context/FavoritesContext"
import categoriesApi from "../../api/categoriesApi"

const Header = () => {
    const { user, logout } = useAuth()
    const { totalCount, totalPrice } = useCart()
    const { favorites } = useFavorites()
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [showCategories, setShowCategories] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showHelpMenu, setShowHelpMenu] = useState(false)
    const [categories, setCategories] = useState([])
    const categoriesRef = useRef(null)
    const userMenuRef = useRef(null)
    const helpMenuRef = useRef(null)

    useEffect(() => {
        categoriesApi.getAll().then((res) => setCategories(res.data))
    }, [])

    useEffect(() => {
        const handleClick = (e) => {
            if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
                setShowCategories(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false)
            }
            if (helpMenuRef.current && !helpMenuRef.current.contains(e.target)) {
                setShowHelpMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            navigate(`/books?search=${search.trim()}`)
            setSearch("")
        }
    }

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        navigate("/")
    }

    return (
        <header className="header">
            <div className="header-top">
                <div className="container">
                    <div className="header-top-inner">
                        <div className="header-top-right">
                            <Link to="/favorites" className="header-top-link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                                </svg>
                                Закладки ({favorites.length})
                            </Link>
                            <div className="header-top-help" ref={helpMenuRef}>
                                <button
                                    className="header-top-link"
                                    onClick={() => setShowHelpMenu(!showHelpMenu)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <line x1="3" y1="12" x2="21" y2="12"/>
                                        <line x1="3" y1="18" x2="21" y2="18"/>
                                    </svg>
                                    Помощь
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </button>
                                {showHelpMenu && (
                                    <div className="dropdown-menu">
                                        <Link to="/help/delivery" className="dropdown-item">Доставка</Link>
                                        <Link to="/help/register" className="dropdown-item">Как зарегистрироваться</Link>
                                        <Link to="/help/order" className="dropdown-item">Как сделать заказ</Link>
                                        <Link to="/help/installment" className="dropdown-item">Рассрочка</Link>
                                        <Link to="/kitobzik" className="dropdown-item">Что такое статус KITOBZIK?</Link>
                                    </div>
                                )}
                            </div>
                            <div className="header-top-user" ref={userMenuRef}>
                                <button
                                    className="header-top-link"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    {user ? user.username || "Личный кабинет" : "Личный кабинет"}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </button>
                                {showUserMenu && (
                                    <div className="dropdown-menu">
                                        {user ? (
                                            <>
                                                <Link to="/profile" className="dropdown-item">Мой профиль</Link>
                                                <Link to="/orders" className="dropdown-item">История заказов</Link>
                                                <Link to="/kitobzik" className="dropdown-item">KITOBZIK</Link>
                                                {(user.role === "admin" || user.role === "moderator") && (
                                                    <Link to="/admin" className="dropdown-item">Админ панель</Link>
                                                )}
                                                <button className="dropdown-item" onClick={handleLogout}>Выйти</button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/register" className="dropdown-item">Регистрация</Link>
                                                <Link to="/login" className="dropdown-item">Авторизация</Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-middle">
                <div className="container">
                    <div className="header-middle-inner">
                        <Link to="/" className="header-logo">
                            <div className="header-logo-main">
                                <span className="logo-kito">KITO</span>
                                <span className="logo-bz">BZ</span>
                            </div>
                            <span className="logo-sub">Онлайн магазин книг</span>
                        </Link>
                        <div className="header-phone">
                            <div className="phone-icon-wrap">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="phone-number">+(992) 903-02-22-98</div>
                                <div className="phone-hours">По будням с 9:00 до 19:00</div>
                            </div>
                        </div>
                        <div className="header-promo">
                            <span className="promo-icon">%</span>
                            <span>Самая доступная цена</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-bottom">
                <div className="container">
                    <div className="header-bottom-inner">
                        <div className="categories-btn-wrap" ref={categoriesRef}>
                            <button
                                className="categories-btn"
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="3" y1="18" x2="21" y2="18"/>
                                </svg>
                                <span>Категории</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </button>
                            {showCategories && (
                                <div className="categories-dropdown">
                                    <div className="categories-left">
                                        <Link to="/books" className="cat-left-item cat-left-item--red">
                                            Каталог
                                        </Link>
                                        <Link to="/books?sort=discount" className="cat-left-item">
                                            С максимальной скидкой
                                        </Link>
                                        <Link to="/books?sort=price_asc" className="cat-left-item">
                                            Сначала дешевые
                                        </Link>
                                        <Link to="/books?sort=popular" className="cat-left-item">
                                            Популярные
                                        </Link>
                                        <Link to="/books?sort=rating" className="cat-left-item">
                                            Высокий рейтинг
                                        </Link>
                                        <Link to="/books?sort=new" className="cat-left-item">
                                            Новинки
                                        </Link>
                                        <Link to="/books?sort=sale" className="cat-left-item">
                                            Книги со скидкой
                                        </Link>
                                    </div>
                                    <div className="categories-right">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="cat-group">
                                                <Link
                                                    to={`/books?category_id=${cat.id}`}
                                                    className="cat-group-title"
                                                    onClick={() => setShowCategories(false)}
                                                >
                                                    {cat.name}
                                                </Link>
                                                {cat.subcategories?.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        to={`/books?category_id=${sub.id}`}
                                                        className="cat-group-item"
                                                        onClick={() => setShowCategories(false)}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <form className="search-form" onSubmit={handleSearch}>
                            <select className="search-select">
                                <option>Везде</option>
                            </select>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Поиск в каталоге"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </button>
                        </form>

                        <Link to="/cart" className="cart-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
                            </svg>
                            <div>
                                <div>{totalCount} товар(ов),</div>
                                <div>на {totalPrice} сомони</div>
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header