import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from os import getenv
from dotenv import load_dotenv

load_dotenv()

MAIL_USERNAME = getenv("MAIL_USERNAME")
MAIL_PASSWORD = getenv("MAIL_PASSWORD")
MAIL_FROM = getenv("MAIL_FROM")


async def send_registration_email(to_email: str, username: str, password: str):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Kitobz - Благодарим за регистрацию"
    message["From"] = f"Kitobz <{MAIL_FROM}>"
    message["To"] = to_email

    text = f"""
Добро пожаловать в Kitobz и благодарим Вас за регистрацию!!

Ваш аккаунт создан и Вы можете войти, используя свой E-mail и пароль, по ссылке:
http://localhost:5173/login

Ваш логин: {to_email}

Ваш пароль: {password}

После входа в систему, Вы сможете получить доступ к разным сервисам магазина,
такие как обзор последних заказов и редактирование информации о Вашей учетной записи.

Спасибо,
Kitobz
"""

    html = f"""
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #e8192c;">Kitobz</h2>
    <p>Добро пожаловать в Kitobz и благодарим Вас за регистрацию!!</p>
    <p>Ваш аккаунт создан и Вы можете войти, используя свой E-mail и пароль, по ссылке:</p>
    <p><a href="http://localhost:5173/login" style="color: #1a73e8;">http://localhost:5173/login</a></p>
    <br>
    <p>Ваш логин: <strong>{to_email}</strong></p>
    <p>Ваш пароль: <strong>{password}</strong></p>
    <br>
    <p>После входа в систему, Вы сможете получить доступ к разным сервисам магазина,
    такие как обзор последних заказов и редактирование информации о Вашей учетной записи.</p>
    <br>
    <p>Спасибо,<br><strong>Kitobz</strong></p>
</div>
"""

    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=465,
        use_tls=True,
        username=MAIL_USERNAME,
        password=MAIL_PASSWORD,
    )