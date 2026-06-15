const HowToOrder = () => {
    return (
        <div className="container">
            <div className="help-page">
                <div className="help-breadcrumb">
                    <span>Как оформить заказ?</span>
                </div>

                <h1 className="help-title">Как оформить заказ?</h1>

                <div className="help-content">
                    <p className="help-text">
                        Оформить заказ Вы можете как зарегистрированный пользователь, так и без регистрации,
                        а так же выполнять быстрый и простой заказ, сейчас мы наглядно покажем, как это сделать.
                    </p>
                    <p className="help-text">
                        Для начало выберем книгу, к примеру <strong>«Джоджо Мойес: До встречи с тобой»</strong> нажав купить
                        мы оформим обычный заказ как показано ниже на фото.
                    </p>

                    <img src="/place_order1.png" alt="Шаг 1" className="help-step-img" />

                    <img src="/place_order2.png" alt="Шаг 2" className="help-step-img" />

                    <p className="help-text">
                        При оформлении заказ необходимо заполнить одно обязательное поле это номер телефона*
                        После нажать <strong>"Оформить заказ"</strong> и продолжить.
                    </p>

                    <img src="/place_order3.png" alt="Шаг 3" className="help-step-img" />

                    <img src="/place_order4.png" alt="Шаг 4" className="help-step-img" />

                    <p className="help-text-center">Всего хорошего и приятного выбора!</p>
                </div>
            </div>
        </div>
    )
}

export default HowToOrder