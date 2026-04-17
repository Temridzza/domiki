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
        <!-- БЛОК ВЫБЕРИТЕ РАЙОН -->
        <div class="districts">
            <h2>Выберите район</h2>
            <div class="districts-sub">Престижные локации с развитой инфраструктурой</div>
            <div class="district-grid-cards" id="districtsContainer"></div>
        </div>

        <!-- ФОРМА ЗАЯВКИ - появляется только после клика -->
        <div class="form-section" id="applicationForm">
            <div class="form-wrapper">
                <h3>Оставьте заявку</h3>
                <div class="form-desc">Подберем идеальный вариант и ответим на все вопросы</div>
                <form id="contactForm">
                    <div class="form-group-vertical">
                        <input type="text" class="input-field" placeholder="Ваше имя" id="formName" required>
                        <input type="tel" class="input-field" placeholder="Номер телефона" id="formPhone" required>
                        <textarea class="input-field" placeholder="Ваши пожелания (количество комнат, бюджет, этаж, срок покупки...)" id="formWishes"></textarea>
                    </div>
                    <button type="submit" class="btn-submit">ОТПРАВИТЬ ЗАЯВКУ</button>
                    <p class="consent-text">Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных</p>
                </form>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/proces-card.js') }}"></script>
@endsection
