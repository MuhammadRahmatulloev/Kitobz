import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-icons">
                    <Link to="/help/delivery" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/delivery.png" alt="Доставка" />
                        </div>
                        <span>Доставка</span>
                    </Link>
                    <Link to="/help/installment" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/installment.png" alt="Рассрочка" />
                        </div>
                        <span>Рассрочка</span>
                    </Link>
                    <Link to="/social" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/social.png" alt="Соц. сети" />
                        </div>
                        <span>Соц. сети</span>
                    </Link>
                    <Link to="/gift" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/gift.png" alt="Гифт карты" />
                        </div>
                        <span>Гифт карты</span>
                    </Link>
                    <Link to="/reviews" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/reviews.png" alt="Отзывы" />
                        </div>
                        <span>Отзывы</span>
                    </Link>
                    <Link to="/about" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/about.png" alt="О нас" />
                        </div>
                        <span>О нас</span>
                    </Link>
                    <Link to="/profile" className="footer-icon-item">
                        <div className="footer-icon-circle">
                            <img src="/icons/account.png" alt="Аккаунт" />
                        </div>
                        <span>Аккаунт</span>
                    </Link>
                </div>

                <div className="footer-links">
                    <div className="footer-col">
                        <h4 className="footer-col-title">Помощь</h4>
                        <Link to="/help/delivery" className="footer-link">Доставка</Link>
                        <Link to="/help/installment" className="footer-link">Рассрочка</Link>
                        <Link to="/about" className="footer-link">О KITOBZ-е</Link>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-col-title">Дополнительно</h4>
                        <Link to="/sales" className="footer-link">Акции</Link>
                        <Link to="/gift" className="footer-link">Подарочные сертификаты</Link>
                        <Link to="/sitemap" className="footer-link">Карта сайта</Link>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-col-title">Мой кабинет</h4>
                        <Link to="/login" className="footer-link">Вход / Регистрация</Link>
                        <Link to="/orders" className="footer-link">История заказов</Link>
                        <Link to="/profile" className="footer-link">KITOBZIK</Link>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-col-title">Контакты</h4>
                        <a href="tel:+992903022298" className="footer-link">Позвонить</a>
                        <a href="mailto:info@kitobz.info" className="footer-link">Написать на почту</a>
                        <a href="https://t.me/kitobz" target="_blank" rel="noreferrer" className="footer-link">Телеграм</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <span>Создан с ❤ в Girbar</span>
                        <span>Kitobz.info © 2026</span>
                    </div>
                    <div className="footer-bottom-right">
                        <img src="/icons/yandex.png" alt="Яндекс" />
                        <img src="/icons/alif.png" alt="Alif" />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer