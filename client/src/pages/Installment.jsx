const Installment = () => {
    return (
        <div className="container">
            <div className="help-page">
                <div className="help-breadcrumb">
                    <span>Рассрочка</span>
                </div>

                <h1 className="help-title">Рассрочка</h1>

                <div className="installment-content">
                    <div className="installment-logo-wrap">
                        <img src="/installation_plan_logo.png" alt="Kitobz" className="installment-logo" />
                    </div>

                    <p className="installment-text">
                        Для покупки книг в рассрочку нужно всего лишь иметь карту "Салом" от "Алиф Бонк".
                    </p>

                    <p className="installment-link-row">
                        <a href="https://alifshop.tj/?rs=alif.shop_redirekt&cityId=1" target="_blank" rel="noreferrer" className="installment-link">
                            Подробнее о том как получить карту "САЛОМ".
                        </a>
                        <span className="installment-phone-label">Тел:</span>
                        <a href="tel:+99248888111" className="installment-phone">+(992) 48888 1111</a>
                    </p>

                    <p className="installment-note">
                        * Если у Вас уже имеется карта "САЛОМ", то вам нужно оформить заказ и после доставки курьером и получения книги вы можете оформить рассрочку.
                    </p>

                    <div className="installment-contacts">
                        <p className="installment-contacts-title">
                            Возникли вопросы про рассрочку? Пишите на наш онлайн чат или звоните по номерам:
                        </p>
                        <div className="installment-phones">
                            <span className="installment-company">АЛИФ БОНК</span>
                            <a href="tel:+99248888111" className="installment-company-phone">+(992) 48888 1111</a>
                            <span className="installment-divider">|</span>
                            <span className="installment-company">KITOBZ</span>
                            <a href="tel:+992903022298" className="installment-company-phone">+(992) 903-02-22-98</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Installment