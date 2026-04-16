<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Шаблоны страниц</title>

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="site-wrapper">
        <!-- Верхняя панель с логотипом и бургером -->
        <div class="top-bar">
            <div class="container">
                <div class="logo-area">
                    <div class="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 3L21 9V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V9Z" stroke="white" stroke-width="1.5" fill="#f7b32b" />
                            <path d="M9 21V12H15V21" stroke="white" stroke-width="1.5" fill="none" />
                        </svg>
                    </div>
                    <span class="logo-text">NORTHWIND</span>
                </div>
            </div>
        </div>
        
        <div class="content" id="page-content">
            <div class="loading">
                <div class="spinner"></div>
                Загрузка...
            </div>
        </div>

        <!-- ФУТЕР -->
        <footer>
            <div class="footer-contacts">
                <div class="contacts-info">
                    <h4>Контакты</h4>
                    <p>📍 г. Ярославль, ул. Примерная, 1</p>
                    <p>📧 info@example.ru</p>
                    <p>🕒 Ежедневно 09:00 – 21:00</p>
                </div>
                <div class="contacts-phone">
                    <div class="big-phone">+7 (4852) ХХХ-ХХ-ХХ</div>
                    <div class="big-phone">+7 (4852) ХХХ-ХХ-ХХ</div>
                    <div class="big-phone">+7 (4852) ХХХ-ХХ-ХХ</div>
                </div>
            </div>
            <div class="footer-copyright">
                © 2026 Новостройки в Ярославле — напрямую от застройщика
            </div>
        </footer>
    </div>
        
    <script src="{{ asset('js/index-code.js') }}"></script>
</body>
</html>
