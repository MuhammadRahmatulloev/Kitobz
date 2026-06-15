import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import booksApi from "../api/booksApi"
import categoriesApi from "../api/categoriesApi"
import BookCard from "../components/ui/BookCard"
import Loader from "../components/ui/Loader"

const slides = [
    { image: "/anna_jane_books.png", alt: "Книги Анны Джейн" },
    { image: "/magistral.png", alt: "Серия книг Магистраль" }
]

const quotes = [
    {
        text: "Тщеславие выбирает, истинная любовь не выбирает.",
        author: "Иван Бунин",
        image: "/herochik1.png"
    },
    {
        text: "Если ты суёшь свою голову в пасть льва, не жалуйся, когда однажды случится так, что он её откусит.",
        author: "Агата Кристи",
        image: "/herochik2.png"
    },
    {
        text: "Если тронуть страсти в человеке, то, конечно, правды не найдёшь.",
        author: "Сергей Есенин",
        image: "/herochik3.png"
    },
    {
        text: "Перестать читать книги — значит перестать мыслить.",
        author: "Фёдор Достоевский",
        image: "/herochik4.png"
    },
    {
        text: "Нет ничего в мире, чего бы не преодолела настойчивость.",
        author: "Лев Толстой",
        image: "/herochik5.png"
    },
    {
        text: "Слово — серебро, молчание — золото.",
        author: "Антон Чехов",
        image: "/herochik6.png"
    }
]

const HeroSlider = () => {
    const [current, setCurrent] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 3000)
        return () => clearInterval(timerRef.current)
    }, [])

    const handlePrev = () => {
        clearInterval(timerRef.current)
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 3000)
    }

    const handleNext = () => {
        clearInterval(timerRef.current)
        setCurrent((prev) => (prev + 1) % slides.length)
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 3000)
    }

    return (
        <div className="hero-slider">
            <button className="hero-slider-btn hero-slider-btn--prev" onClick={handlePrev}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>

            <div className="hero-slider-track">
                {slides.map((slide, i) => (
                    <div key={i} className={`hero-slide ${i === current ? "hero-slide--active" : ""}`}>
                        <img src={slide.image} alt={slide.alt} className="hero-slide-img" />
                    </div>
                ))}
            </div>

            <button className="hero-slider-btn hero-slider-btn--next" onClick={handleNext}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>

            <div className="hero-slider-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-slider-dot ${i === current ? "hero-slider-dot--active" : ""}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    )
}

const QuotesSlider = () => {
    const doubled = [...quotes, ...quotes]

    return (
        <div className="quotes-slider-wrap">
            <div className="quotes-slider-track">
                {doubled.map((quote, i) => (
                    <div key={i} className="quotes-slider-card">
                        <div className="quotes-slider-avatar">
                            <img
                                src={quote.image}
                                alt={quote.author}
                                onError={(e) => {
                                    e.target.style.display = "none"
                                    e.target.nextSibling.style.display = "flex"
                                }}
                            />
                            <div className="quotes-slider-avatar-fallback">
                                {quote.author.charAt(0)}
                            </div>
                        </div>
                        <div className="quotes-slider-content">
                            <p className="quotes-slider-text">«{quote.text}»</p>
                            <span className="quotes-slider-author">{quote.author}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

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
                <HeroSlider />
                <div className="hero-side">
                    <div className="hero-side-banner">
                        <img src="/ad_language1.png" alt="Books in English" className="hero-side-banner-img" />
                    </div>
                    <div className="hero-side-banner">
                        <img src="/ad_language2.png" alt="Китобхо бо тарчумаи забони точики" className="hero-side-banner-img" />
                    </div>
                </div>
            </section>

            <QuotesSlider />

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