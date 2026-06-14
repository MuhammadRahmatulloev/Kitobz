import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import booksApi from "../api/booksApi"
import categoriesApi from "../api/categoriesApi"
import BookCard from "../components/ui/BookCard"
import Loader from "../components/ui/Loader"

const quotes = [
    { text: "Тщеславие выбирает, истинная любовь не выбирает.", author: "Иван Бунин" },
    { text: "Если ты суёшь свою голову в пасть льва, не жалуйся, когда однажды случится так, что он её откусит.", author: "Агата Кристи" },
    { text: "Если тронуть страсти в человеке, то, конечно, правды не найдёшь.", author: "Сергей Есенин" }
]

const Home = () => {
    const [newBooks, setNewBooks] = useState([])
    const [popularBooks, setPopularBooks] = useState([])
    const [loveBooks, setLoveBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newRes, popularRes, categoriesRes] = await Promise.all([
                    booksApi.getAll({ limit: 6 }),
                    booksApi.getAll({ available_only: true, limit: 6 }),
                    categoriesApi.getAll()
                ])
                setNewBooks(newRes.data)
                setPopularBooks(popularRes.data)
                setCategories(categoriesRes.data)

                const loveCategory = categoriesRes.data.find(
                    (cat) => cat.name.toLowerCase().includes("любов")
                )
                if (loveCategory) {
                    const loveRes = await booksApi.getAll({ category_id: loveCategory.id, limit: 6 })
                    setLoveBooks(loveRes.data)
                }
            } catch {
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <Loader fullPage />
    }

    return (
        <div className="container">
            <section className="hero-section">
                <div className="hero-banner">
                    <div className="hero-banner-content">
                        <h2>Книги Анны Джейн</h2>
                    </div>
                </div>
                <div className="hero-side">
                    <div className="hero-side-banner">
                        <span>Books in English</span>
                    </div>
                    <div className="hero-side-banner hero-side-banner--dark">
                        <span>Китобхо бо тарчумаи забони точики</span>
                    </div>
                </div>
            </section>

            <section className="quotes-section">
                {quotes.map((quote, index) => (
                    <div key={index} className="quote-card">
                        <p className="quote-text">«{quote.text}»</p>
                        <span className="quote-author">{quote.author}</span>
                    </div>
                ))}
            </section>

            <section className="section">
                <div className="section-header">
                    <h3 className="section-title">Новые поступления</h3>
                    <div className="section-nav">
                        <button className="section-nav-btn">←</button>
                        <button className="section-nav-btn">→</button>
                    </div>
                </div>
                <div className="books-grid">
                    {newBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

            <section className="category-banners">
                <Link to="/books" className="category-banner category-banner--magistral">
                    <div className="category-banner-content">
                        <h4>Магистраль</h4>
                        <span>Главный тренд</span>
                        <button className="btn btn--sm category-banner-btn">Перейти</button>
                    </div>
                </Link>
                <Link to="/books" className="category-banner category-banner--classic">
                    <div className="category-banner-content">
                        <h4>Эксклюзивная классика</h4>
                        <button className="btn btn--sm category-banner-btn">Перейти</button>
                    </div>
                </Link>
                <Link to="/books" className="category-banner category-banner--world">
                    <div className="category-banner-content">
                        <h4>Всемирная литература</h4>
                        <button className="btn btn--sm category-banner-btn">Перейти</button>
                    </div>
                </Link>
            </section>

            <section className="wide-banners">
                <Link to="/books" className="wide-banner wide-banner--english">
                    <div className="wide-banner-content">
                        <h4>Легко читаем по английски</h4>
                        <button className="btn btn--sm wide-banner-btn">Перейти</button>
                    </div>
                </Link>
                <Link to="/books" className="wide-banner wide-banner--gift">
                    <div className="wide-banner-content">
                        <h4>Подарочные издания</h4>
                        <button className="btn btn--sm wide-banner-btn">Перейти</button>
                    </div>
                </Link>
            </section>

            <section className="categories-icons">
                {categories.slice(0, 11).map((cat) => (
                    <Link key={cat.id} to={`/books?category_id=${cat.id}`} className="category-icon-item">
                        <div className="category-icon-circle">{cat.name.charAt(0)}</div>
                        <span>{cat.name}</span>
                    </Link>
                ))}
            </section>

            <section className="section">
                <div className="section-header">
                    <h3 className="section-title">Выбор китобзиков</h3>
                    <div className="section-nav">
                        <button className="section-nav-btn">←</button>
                        <button className="section-nav-btn">→</button>
                    </div>
                </div>
                <div className="books-grid">
                    {popularBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

            <section className="social-section">
                <a href="https://instagram.com/kitobz.tj" target="_blank" rel="noreferrer" className="social-card">
                    <span className="social-icon">Instagram</span>
                    <span>@kitobz.tj</span>
                </a>
                <a href="https://facebook.com/kitobz" target="_blank" rel="noreferrer" className="social-card">
                    <span className="social-icon">Facebook</span>
                    <span>@kitobz</span>
                </a>
                <a href="https://t.me/kitobz" target="_blank" rel="noreferrer" className="social-card">
                    <span className="social-icon">Telegram</span>
                    <span>@kitobz</span>
                </a>
                <a href="https://wa.me/992903022298" target="_blank" rel="noreferrer" className="social-card">
                    <span className="social-icon">WhatsApp</span>
                    <span>+992903022298</span>
                </a>
            </section>

            {loveBooks.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Лучшие книги о любви</h3>
                        <div className="section-nav">
                            <button className="section-nav-btn">←</button>
                            <button className="section-nav-btn">→</button>
                        </div>
                    </div>
                    <div className="books-grid">
                        {loveBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </section>
            )}

            <section className="section">
                <div className="section-header">
                    <h3 className="section-title">Книги</h3>
                </div>
                <div className="books-grid books-grid--4">
                    {newBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home