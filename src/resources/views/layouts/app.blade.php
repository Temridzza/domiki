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
        <!-- Верхняя панель с логотипом -->
        <header class="top-bar">
            <div class="top-bar__container">
                <a href="{{ route('home') }}" class="logo">
                    <div class="logo__icon-wrapper">
                        <div class="logo__icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M3 9L12 3L21 9V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V9Z" stroke="white" stroke-width="1.5" fill="#f7b32b" />
                                <path d="M9 21V12H15V21" stroke="white" stroke-width="1.5" fill="none" />
                            </svg>
                        </div>
                    </div>
                    <span class="logo__text">NORTHWIND</span>
                </a>
            </div>
        </header>

        <!-- содержимое страницы -->

        <!-- ФУТЕР -->
        <footer class="footer">
            <div class="footer__container">
                <div class="footer__section footer__section--info">
                    <h3 class="footer__title">Контакты</h3>
                    <ul class="contact-list">
                        <li class="contact-list__item">
                            <span class="contact-list__icon" aria-hidden="true">📍</span>
                            <span>г. Ярославль, ул. Примерная, 1</span>
                        </li>
                        <li class="contact-list__item">
                            <span class="contact-list__icon" aria-hidden="true">📧</span>
                            <a href="mailto:info@example.ru" class="contact-list__link">info@example.ru</a>
                        </li>
                        <li class="contact-list__item">
                            <span class="contact-list__icon" aria-hidden="true">🕒</span>
                            <span>Ежедневно 09:00 – 21:00</span>
                        </li>
                    </ul>
                </div>

                <div class="footer__section footer__section--phones">
                    <h3 class="footer__title footer__title--hidden">Телефоны</h3>
                    <ul class="phone-list">
                        <li class="phone-list__item">
                            <a href="tel:+74852XXXXXX" class="phone-list__link">+7 (4852) ХХХ-ХХ-ХХ</a>
                        </li>
                        <li class="phone-list__item">
                            <a href="tel:+74852XXXXXX" class="phone-list__link">+7 (4852) ХХХ-ХХ-ХХ</a>
                        </li>
                        <li class="phone-list__item">
                            <a href="tel:+74852XXXXXX" class="phone-list__link">+7 (4852) ХХХ-ХХ-ХХ</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer__copyright">
                <p class="footer__copyright-text">© {{ date('Y') }} Новостройки в Ярославле — напрямую от застройщика.</p>
            </div>
        </footer>
    </div>
    
    @stack('scripts')
</body>
</html>
