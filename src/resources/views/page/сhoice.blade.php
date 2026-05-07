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
        <section class="form" id="formSection">
            <div class="form__container">
                <h3 class="form__title">ОСТАВЬТЕ ЗАЯВКУ</h3>
                <p class="form__description">Менеджер подберет лучший вариант с выгодой</p>
                
                <form class="form__body" id="leadForm">
                    <div class="form__fields">
                        <div class="form__field-group">
                            <input type="text" 
                                class="form__input" 
                                placeholder="Ваше имя" 
                                id="userName" 
                                name="userName"
                                required>
                        </div>
                        
                        <div class="form__field-group">
                            <input type="tel" 
                                class="form__input" 
                                placeholder="Номер телефона" 
                                id="userPhone" 
                                name="userPhone"
                                required>
                        </div>
                        
                        <div class="form__field-group">
                            <textarea class="form__input form__input--textarea" 
                                    rows="3" 
                                    placeholder="Количество комнат / бюджет / пожелания" 
                                    id="userComment" 
                                    name="userComment"></textarea>
                        </div>
                        
                        <div class="form__field-group">
                            <button type="submit" class="form__submit">ОТПРАВИТЬ ЗАЯВКУ</button>
                        </div>
                    </div>
                    
                    <p class="form__agreement">Нажимая на кнопку, вы даете согласие на обработку данных</p>
                </form>
            </div>
        </section>
    </div>

    <script src="{{ asset('js/choice/new-buildings.js') }}"> </script>
@endsection
