<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>@yield('title', 'Новостройки в Ярославле')</title>
    <meta name="description" content="@yield('description', 'Новостройки в Ярославле — поиск и покупка квартир')">
    <meta name="keywords" content="@yield('keywords', 'застройщик, ипотека, скидки')">
    
    <link href="{{ asset('images/favicon.png') }}" rel="icon" type="image/png">
    <link href="{{ asset('stylesheets/style.css') }}" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
    @stack('styles')
</head>
<body>
<div class="site-wrapper" x-data="app()" x-init="initData">
    
    {{-- TOP BAR (общий для всех страниц) --}}
    <div class="top-bar">
        <div class="container">
            <div class="logo-area">
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="white" stroke="#2c7da0" stroke-width="1.2" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="2.5" fill="#FFD966" stroke="#b97f10" stroke-width="0.8"/>
                    </svg>
                </div>
                <span class="logo-text">NORTHWIND</span>
            </div>
            <div class="burger-btn" @click="toggleBurger" :class="{ active: burgerActive }">
                <div class="burger-line"></div>
                <div class="burger-line"></div>
                <div class="burger-line"></div>
            </div>
        </div>
    </div>

    {{-- ОСНОВНОЙ КОНТЕНТ (будет подставляться из дочерних шаблонов) --}}
    <main>
        @yield('content')
    </main>

    {{-- ФУТЕР (общий) --}}
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
            © {{ date('Y') }} Новостройки в Ярославле — напрямую от застройщика
        </div>
    </footer>

    {{-- TOAST УВЕДОМЛЕНИЯ --}}
    <div id="toastMsg" class="toast-msg" x-text="toastMessage" :class="{ 'show': toastVisible }"></div>
</div>

<script src="{{ asset('javascripts/index.js') }}"></script>
<script src="{{ asset('javascripts/data.js') }}"></script>
@stack('scripts')
</body>
</html>
