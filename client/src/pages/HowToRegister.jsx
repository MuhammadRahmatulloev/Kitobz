import { Link } from "react-router-dom"

const HowToRegister = () => {
    return (
        <div className="container">
            <div className="help-page">
                <div className="help-breadcrumb">
                    <span>Как зарегистрироваться?</span>
                </div>

                <h1 className="help-title">Как зарегистрироваться?</h1>

                <div className="help-content">
                    <p className="help-text">Для этого необходимо иметь электронную почту и номер телефона</p>
                    <p className="help-text">И так начнем, жмем в правом углу на «Личный» кабинет после «Регистрация»</p>

                    <img src="/how_register1.png" alt="Шаг 1" className="help-step-img" />
                    <img src="/how_register2.png" alt="Шаг 2" className="help-step-img" />

                    <p className="help-text">Здесь необходимо указать свои данные (почту, имя, номер телефона) введенная почта является вашим логином для входа в аккаунт. После заполнения всех пунктов смело жмем продолжить и Вы официальный пользователь нашего сайта.</p>

                    <img src="/how_register3.png" alt="Шаг 3" className="help-step-img" />
                    <img src="/how_register4.png" alt="Шаг 4" className="help-step-img" />

                    <img src="/how_register5.png" alt="Шаг 5" className="help-step-img" />

                    <p className="help-text-start">На этом все, в своей учетной записи Вы можете просмотреть свою историю заказов или внести некоторые изменения своих данных</p>
                    <p className="help-text-center">Всего хорошего и приятного выбора!</p>
                </div>
            </div>
        </div>
    )
}

export default HowToRegister