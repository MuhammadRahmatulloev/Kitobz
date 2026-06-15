import { Link } from "react-router-dom"

const Delivery = () => {
    return (
        <div className="container">
            <div className="delivery-page">
                <div className="delivery-breadcrumb">
                    <span>Доставка</span>
                </div>

                <h1 className="delivery-title">Доставка</h1>

                <div className="delivery-hero">
                    <img src="/courier.png" alt="Доставка" className="delivery-courier-img" />

                    <div className="delivery-dushanbe">
                        <p className="delivery-dushanbe-text">Курьерская доставка по г. Душанбе - 7 сомони</p>
                        <p className="delivery-dushanbe-promo">
                            <strong>АКЦИЯ:</strong> Бесплатно при заказе 3-х и более книг
                        </p>
                        <p className="delivery-dushanbe-time">| Осуществляется в течение 24 часов.</p>
                    </div>
                </div>

                <div className="delivery-regions">
                    <h3 className="delivery-regions-title">В другие города Республики Таджикистан</h3>

                    <table className="delivery-table">
                        <tbody>
                            <tr>
                                <td>
                                    <div>– Худжанд (Сугд)</div>
                                    <div>– Пянджикент</div>
                                    <div>– Исфара</div>
                                    <div>– Истаравшан</div>
                                    <div>– Бустон</div>
                                </td>
                                <td>27 сомони</td>
                            </tr>
                            <tr>
                                <td>– Бохтар (Курган-Тюбе)</td>
                                <td>17 сомони</td>
                            </tr>
                            <tr>
                                <td>– Турсунзаде (Регар)</td>
                                <td>17 сомони</td>
                            </tr>
                            <tr>
                                <td>– Гиссар (Хисор)</td>
                                <td>17 сомони</td>
                            </tr>
                            <tr>
                                <td>– Вахдат</td>
                                <td>17 сомони</td>
                            </tr>
                            <tr>
                                <td>– Р.Рудаки (Ленинский)</td>
                                <td>17 сомони</td>
                            </tr>
                            <tr>
                                <td>– Куляб (Кулоб)</td>
                                <td>17 сомони</td>
                            </tr>
                            <tr>
                                <td>– Дангара</td>
                                <td>49 сомони</td>
                            </tr>
                            <tr>
                                <td>– Хорог</td>
                                <td>17 сомони</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Delivery