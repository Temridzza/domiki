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
    <section class="hero-fullscreen">
        <div class="hero-container">
            <div class="hero-text">
                <h1>Новостройки в <span>Ярославле</span></h1>
                <div class="hero-sub-line">
                    <p>
                        <span>🏗️ Напрямую от застройщика</span>
                        <span>🔥 Скидки до конца месяца</span>
                    </p>
                </div>
                <a href="#" class="btn-primary" @click.prevent="showFormAndScroll">ПОДОБРАТЬ КВАРТИРУ</a>
            </div>
        </div>
    </section>

    <div class="content-after-hero">
        {{-- БЛОК ВЫБЕРИТЕ РАЙОН --}}
        <div class="districts">
            <h2>Выберите район</h2>
            <div class="districts-sub">Престижные локации с развитой инфраструктурой</div>
            <div class="district-grid-cards">
                <template x-for="district in districts" :key="district.id">
                    <div class="district-card" @click="selectDistrict(district.name)">
                        <div class="card-img" :style="{ backgroundImage: 'url(' + district.imageUrl + ')' }"></div>
                        <h3 x-text="district.name"></h3>
                        <p x-text="district.description"></p>
                    </div>
                </template>
            </div>
        </div>

        {{-- ФОРМА ЗАЯВКИ --}}
        <div class="form-section" id="applicationForm" x-show="showForm" x-transition.duration.400ms>
            <div class="form-wrapper">
                <h3>Оставьте заявку</h3>
                <div class="form-desc">Подберем идеальный вариант и ответим на все вопросы</div>
                <form @submit.prevent="submitForm">
                    <div class="form-group-vertical">
                        <input type="text" class="input-field" placeholder="Ваше имя" x-model="formData.name" required>
                        <input type="tel" class="input-field" placeholder="Номер телефона" x-model="formData.phone" required>
                        <textarea class="input-field" placeholder="Ваши пожелания (количество комнат, бюджет, этаж, срок покупки...)" x-model="formData.wishes"></textarea>
                    </div>
                    <button type="submit" class="btn-submit">ОТПРАВИТЬ ЗАЯВКУ</button>
                    <p style="font-size: 0.7rem; text-align: center; margin-top: 18px; color: #6f8ea0;">Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных</p>
                </form>
            </div>
        </div>

        {{-- АКЦИИ И СТАТИСТИКА --}}
        <div class="promo-stats">
            <div class="promo-stats-inner">
                <div class="stat-card" @click="showStatInfo(0)">
                    <div class="stat-number" x-text="stats.apartments.count"></div>
                    <div class="stat-label" x-text="stats.apartments.label">ОСТАЛОСЬ ВСЕГО КВАРТИР</div>
                    <div class="stat-small" x-text="stats.apartments.subtitle">в активных корпусах</div>
                </div>
                
                <div class="stat-card" @click="showStatInfo(1)">
                    <div class="stat-number" x-text="stats.discounts.percent"></div>
                    <div class="stat-label">
                        <span x-text="stats.discounts.label">СКИДКИ ДО</span>
                        <span x-text="stats.discounts.percent"></span>%
                    </div>
                    <div class="stat-small" x-text="stats.discounts.subtitle">на отделку и паркинг</div>
                </div>
                
                <div class="stat-card" @click="showStatInfo(2)">
                    <div class="stat-number" x-text="stats.mortgage.rate"></div>
                    <div class="stat-label">
                        <span x-text="stats.mortgage.label">ИПОТЕКА ОТ</span>
                        <span x-text="stats.mortgage.rate"></span>%
                    </div>
                    <div class="stat-small" x-text="stats.mortgage.subtitle">спецпредложение для семей</div>
                </div>
                
                <div class="stat-card" @click="showStatInfo(3)">
                    <div class="stat-number" x-text="stats.offers.icon"></div>
                    <div class="stat-label" x-text="stats.offers.label">ПОСЛЕДНИЕ ПРЕДЛОЖЕНИЯ</div>
                    <div class="stat-small" x-text="stats.offers.subtitle">Рассрочка 0% + ключи за 3 дня</div>
                </div>
            </div>
        </div>
    </div>

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
