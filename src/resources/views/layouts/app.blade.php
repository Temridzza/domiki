<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>@yield('title', 'Новостройки в Ярославле')</title>
    <meta name="description" content="@yield('description', 'Новостройки в Ярославле — поиск и покупка квартир')">
    <meta name="keywords" content="@yield('keywords', 'застройщик, ипотека, скидки')">

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.15.10/dist/cdn.min.js"></script>
    @stack('styles')
</head>
<body>
    <div class="site-wrapper">
        <!-- Верхняя панель с логотипом и бургером -->
        <div class="top-bar">
            <div class="container">
                <!-- Логотип -->
                 <a href="{{ route('home') }}" class="logo-area" style="text-decoration: none;">
                    <div class="logo-area">
                        <div class="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" >
                                <path d="M3 9L12 3L21 9V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V9Z" stroke="white" stroke-width="1.5" fill="#f7b32b" />
                                <path d="M9 21V12H15V21" stroke="white" stroke-width="1.5" fill="none" />
                            </svg>
                        </div>
                        <!-- Текст для логотипа -->
                        <span class="logo-text">NORTHWIND</span>
                    </div>
                </a>
            </div>
        </div>
        
        <!-- Основной контент -->
        @yield('content')

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
                 © {{ date('Y') }} Новостройки в Ярославле — напрямую от застройщика.
            </div>
        </footer>
    </div>
    
    @stack('scripts')
</body>
</html>
