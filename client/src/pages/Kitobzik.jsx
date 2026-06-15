import { useState } from "react"

const faqs = [
    {
        question: 'Как получить статус "KITOBZIK"?',
        answer: 'Сделать покупку на общую сумму 599 сомони (Не имеет значения в одном заказе или в нескольких заказах ваш аккаунт достиг суммы 399 сомони, вы становитесь владельцем премиум аккаунта)'
    },
    {
        question: 'Сколько % скидки я получу?',
        answer: 'Определённого фиксированного % нет. Обычно premium пользователи получают скидку от -10% до -30% в зависимости от книги.\n\nДля того чтобы ваши скидки активировались, Вам необходимо авторизоваться с вашего "KITOBZIK" аккаунта с любого устройства, и только после просматривать цены'
    },
    {
        question: 'Сколько заказов я могу сделать? Есть ли ограничения?',
        answer: 'Вы можете делать любое количество заказов с общей суммой не выше 5000 сомони в месяц.'
    },
    {
        question: 'На какие книги распространяется скидка?',
        answer: 'Скидка распространяется на все книги которые есть на сайте, и на книги которые мы можем доставить с Российской Федерации по вашему запросу.'
    },
    {
        question: 'Сколько длится подписка?',
        answer: 'Статус KITOBZ PREMIUM не имеет срока окончания подписки. Если вы получили статус "KITOBZIK" - то это бессрочно.'
    }
]

const FaqItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setOpen(!open)}>
                <span className="faq-arrow">{open ? "▼" : "►"}</span>
                <span>{question}</span>
            </button>
            {open && (
                <div className="faq-answer">
                    {answer.split("\n\n").map((para, i) => (
                        <p key={i} className="faq-answer-para">{para}</p>
                    ))}
                </div>
            )}
        </div>
    )
}

const Kitobzik = () => {
    return (
        <div className="container">
            <div className="help-page">
                <div className="help-breadcrumb">
                    <span>KITOBZIK</span>
                </div>

                <h1 className="help-title">KITOBZIK</h1>

                <div className="kitobzik-hero">
                    <div className="kitobzik-badge">KITOBZIK</div>
                    <p className="kitobzik-sub">Это подписка на <strong>эксклюзивные цены!</strong></p>
                    <hr className="kitobzik-divider" />
                    <p className="kitobzik-desc">Получайте <strong>максимум</strong> скидок вне зависимости от проводимых акций</p>
                    <hr className="kitobzik-divider" />
                </div>

                <div className="faq-section">
                    <div className="faq-title-wrap">
                        <h2 className="faq-title">FAQ</h2>
                    </div>

                    <div className="faq-list">
                        {faqs.map((item, i) => (
                            <FaqItem key={i} question={item.question} answer={item.answer} />
                        ))}
                    </div>

                    <div className="kitobzik-notes">
                        <p className="kitobzik-note-title">Примечания:</p>
                        <p className="kitobzik-note">Скидки премиум аккаунта не действуют в мобильном приложении KITOBZ</p>
                        <p className="kitobzik-note">Во время оформление заказа вы обязательно должны быть авторизованы</p>
                        <p className="kitobzik-note">Постоянно прослеживайте условия премиум статуса, они могут быть изменены без уведомления пользователей.</p>
                        <p className="kitobzik-note">Проект находится на стадии разработки</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Kitobzik