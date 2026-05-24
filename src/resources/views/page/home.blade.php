@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')
@section('description', 'Новостройки в Ярославле — поиск и покупка квартир')
@section('keywords', 'застройщик, ипотека, скидки')

@section('style')
    @vite('resources/css/app.css')
@endsection

@section('content')

<section class="hero">
    <div class="hero__container">
        <div class="hero__content">
            <h1 class="hero__title">Новостройки в <span class="hero__title-accent">Ярославле</span></h1>
            <div class="hero__badges">
                <span class="hero__badge hero__badge--building">🏗️ Напрямую от застройщика</span>
                <span class="hero__badge hero__badge--fire">🔥 Скидки до конца месяца</span>
            </div>
            <button class="hero__btn hero__btn--primary" data-action="showForm">ПОДОБРАТЬ КВАРТИРУ</button>
        </div>
    </div>
</section>

<div class="page-content">
    <section class="districts">
        <h2 class="districts__title">Выберите район</h2>
        <p class="districts__subtitle">Престижные локации с развитой инфраструктурой</p>
        <div class="districts__grid" id="districtsContainer"></div>        
    </section>

    <div class="form-section form-section--hidden">
        <div class="form-section__wrapper">
            <h2 class="form-section__title">Оставьте заявку</h2>
            <p class="form-section__description">Мы подберём лучшие варианты под ваш бюджет</p>
            
            <form id="leadForm">
                <div class="form-section__fields">
                    <div class="form-field">
                        <input type="text" class="form-field__input" placeholder="Ваше имя" id="userName" name="userName" required>
                    </div>
                    <div class="form-field">
                        <input type="tel" class="form-field__input" placeholder="Номер телефона" id="userPhone" name="userPhone" required>
                    </div>
                    <div class="form-field">
                        <textarea class="form-field__textarea" placeholder="Количество комнат / бюджет / пожелания" id="userComment" name="userComment"></textarea>
                    </div>
                    <button type="submit" class="form-section__submit form_btn form_btn--primary form_btn--full">
                        <i class="fas fa-paper-plane"></i>
                        <span>ОТПРАВИТЬ ЗАЯВКУ</span>
                    </button>
                    <div class="form-section__message" style="display: none;"></div>
                </div>
                <p class="form-section__consent">Нажимая на кнопку, вы даете согласие на обработку данных</p>
            </form>
        </div>
    </div>

    <section class="stats">
        <div class="stats__container" id="statsContainer"></div>
    </section>
</div>

@endsection

@section('scripts')
    @vite('resources/js/app.js')
@endsection
