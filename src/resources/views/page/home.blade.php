@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')
@section('description', 'Новостройки в Ярославле — поиск и покупка квартир')
@section('keywords', 'застройщик, ипотека, скидки')

@section('content')

{{-- ПРИВЕТСТВЕННЫЙ БЛОК НА ВЕСЬ ЭКРАН --}}
<section class="hero">
    <div class="hero__container">
        <div class="hero__content">
            <h1 class="hero__title">Новостройки в <span class="hero__title-accent">Ярославле</span></h1>
            <div class="hero__badges">
                <span class="hero__badge hero__badge--building">🏗️ Напрямую от застройщика</span>
                <span class="hero__badge hero__badge--fire">🔥 Скидки до конца месяца</span>
            </div>
            <button class="hero__btn btn btn--primary" data-action="showForm">ПОДОБРАТЬ КВАРТИРУ</button>
        </div>
    </div>
</section>

<div class="page-content">
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

        <!-- АКЦИИ И СТАТИСТИКА -->
        <div class="promo-stats">
            <div class="promo-stats-inner" id="statsContainer"></div>
        </div>
    </div>
    
@push('scripts')
    <script src="{{ asset('js/proces-stocks.js') }}"></script>
    <script src="{{ asset('js/proces-card.js') }}"></script>
    <script src="{{ asset('js/proces-form.js') }}"></script>
@endpush

@endsection
