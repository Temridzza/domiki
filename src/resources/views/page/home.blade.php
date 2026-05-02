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
        <section class="districts">
            <h2 class="districts__title">Выберите район</h2>
            <p class="districts__subtitle">Престижные локации с развитой инфраструктурой</p>
            <div class="districts__grid" id="districtsContainer"></div>
        </section>

        <!-- ФОРМА ЗАЯВКИ - появляется только после клика -->
        <div class="form-section" id="applicationForm" style="display: none;">
            <div class="form-section__wrapper">
                <h3 class="form-section__title">Оставьте заявку</h3>
                <p class="form-section__description">Подберем идеальный вариант и ответим на все вопросы</p>
                
                <form class="form-section__form" id="contactForm" novalidate>
                    <div class="form-section__fields">
                        <div class="form-field">
                            <input 
                                type="text" 
                                class="form-field__input" 
                                placeholder="Ваше имя" 
                                id="formName" 
                                required
                            >
                        </div>
                        
                        <div class="form-field">
                            <input 
                                type="tel" 
                                class="form-field__input" 
                                placeholder="Номер телефона" 
                                id="formPhone" 
                                required
                            >
                        </div>
                        
                        <div class="form-field">
                            <textarea 
                                class="form-field__textarea" 
                                placeholder="Ваши пожелания (количество комнат, бюджет, этаж, срок покупки...)" 
                                id="formWishes"
                            ></textarea>
                        </div>
                    </div>
                    
                    <button type="submit" class="form-section__submit">ОТПРАВИТЬ ЗАЯВКУ</button>
                    <p class="form-section__consent">Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных</p>
                </form>
            </div>
        </div>

        <!-- АКЦИИ И СТАТИСТИКА -->
        <section class="stats">
            <div class="stats__container" id="statsContainer"></div>
        </section>
    </div>
    
@push('scripts')
    <script src="{{ asset('js/proces-stocks.js') }}"></script>
    <script src="{{ asset('js/proces-card.js') }}"></script>
    <script src="{{ asset('js/proces-form.js') }}"></script>
@endpush

@endsection
