{{-- resources/views/about.blade.php --}}
@extends('layouts.app')

@section('title', 'Выбор Новостройки ')
@section('description', 'О компании застройщике')

@section('content')
    <!-- ОСНОВНОЙ КОНТЕНТ -->
    <div class="main-content">
        <!-- Шапка района -->
        <div class="header">
            <h1 class="header__title">{{ $districtName }} Район</h1>
        </div>

        <div class="stats">
            <div class="stats__headline">НОВОСТРОЙКИ</div>
            <div class="stats__counters">
                <div class="counter-item">
                    <span class="counter-item__label">Всего:</span>
                    <span class="counter-item__value" 
                        id="totalApartmentsCount"
                        data-counter="complexes">
                        0
                    </span>
                </div>
            </div>
        </div>

        <!-- ======= Анкеты ЖК ======= -->
        <div class="complexes-container" data-slug="{{ $districtSlug }}"></div>

        <!-- СРОЧНОЕ ПРЕДЛОЖЕНИЕ -->
        <div class="urgent-block">
            <div class="urgent-block__content">
                <h3 class="urgent-block__title">⚡ОСТАЛОСЬ ВСЕГО 2 ОБЪЕКТА</h3>
                <p class="urgent-block__subtitle">Квартиры по специальной цене</p>
            </div>
            <button class="urgent-block__button" id="urgentSelectBtn">🔥 ПОДОБРАТЬ КВАРТИРУ</button>
        </div>

        <!-- ФОРМА ЗАЯВКИ -->
        <div class="form-section" id="formSection">
            <div class="form-wrapper">
                <h3>ОСТАВЬТЕ ЗАЯВКУ</h3>
                <div class="form-desc">Менеджер подберет лучший вариант с выгодой</div>
                <form id="leadForm">
                    <div class="form-group">
                        <input type="text" class="input-field" placeholder="Ваше имя" id="userName" required>
                        <input type="tel" class="input-field" placeholder="Номер телефона" id="userPhone" required>
                        <textarea class="input-field" rows="2" placeholder="Количество комнат / бюджет / пожелания" id="userComment" style="border-radius: 28px;"></textarea>
                        <button type="submit" class="btn-submit">ОТПРАВИТЬ ЗАЯВКУ</button>
                    </div>
                </form>
                <p style="font-size: 0.7rem; text-align: center; margin-top: 20px; color: #6f8ea0;">Нажимая на кнопку, вы даете согласие на обработку данных</p>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/choice/new-buildings.js') }}"> </script>
@endsection
