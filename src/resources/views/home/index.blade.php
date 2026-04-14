@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')
@section('description', 'Новостройки в Ярославле — поиск и покупка квартир')
@section('keywords', 'застройщик, ипотека, скидки')

@section('content')
    {{-- ПРИВЕТСТВЕННЫЙ БЛОК НА ВЕСЬ ЭКРАН --}}
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
@endsection
