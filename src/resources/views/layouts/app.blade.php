<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Основные мета-теги -->
        <meta charset="utf-8">
        <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Основные SEO-теги -->
        <title>@yield('title', 'Новостройки в Ярославле')</title>
        <meta name="description" content="@yield('description', 'Новостройки в Ярославле — поиск и покупка квартир')">
        <meta name="keywords" content="@yield('keywords', 'застройщик, ипотека, скидки')">

        <!-- Шрифты\Иконки -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.15.10/dist/cdn.min.js"></script>
        
        <!-- Blade CSS -->
        @yield('style')
    </head>
    <body>
        <div class="site-wrapper">
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
                    <nav class="nav-links">
                        <a href="{{ route('company') }}" class="nav-link nav-link--about">О нас</a>
                        <a href="{{ route('service') }}" class="nav-link nav-link--services">Услуги</a>
                    </nav>
                    <button class="burger-btn" id="burgerBtn" aria-label="Меню">
                        <span class="burger-btn__line"></span>
                        <span class="burger-btn__line"></span>
                        <span class="burger-btn__line"></span>
                    </button>
                </div>
            </header>

            <div id="mobileMenu" class="mobile-menu">
                <div class="mobile-menu__container">
                    <nav class="mobile-menu__nav">
                        <div class="mobile-menu__section">
                            <h3 class="mobile-menu__title">Районы</h3>
                            <ul id="districtsList" class="mobile-menu__list">
                                <li class="mobile-menu__loader">Загрузка районов...</li>
                            </ul>
                        </div>
                        <div class="mobile-menu__divider"></div>
                        <div class="mobile-menu__section">
                            <a href="/panel" class="mobile-menu__admin-link">Админ панель</a>
                        </div>
                    </nav>
                </div>
            </div>

            <!-- Blade content -->
            @yield('content')

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
                    <div class="footer__copyright-text">
                        © {{ date('Y') }} NORTHWIND. Все права защищены.
                    </div>
                </div>
            </footer>
        </div>
        <!-- Blade js -->
        @yield('scripts')
    </body>
</html>
