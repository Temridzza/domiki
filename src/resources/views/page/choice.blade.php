@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')

@section('style')
    @vite('resources/css/app.css')
@endsection

@section('content')
<div class="site-wrapper">
    <div class="header">
        <h1 class="header__title">{{ $districtSlug }} Район</h1>
    </div>

    <div class="district-header-stats">
        <div class="district-header-stats__container">
            <div class="district-header-stats__headline">НОВОСТРОЙКИ</div>
            <div class="district-header-stats__counter">
                <span class="district-header-stats__counter-label">Всего:</span>
                <span class="district-header-stats__counter-value" id="totalApartmentsCount">0</span>
            </div>
        </div>
    </div>

    <div class="complexes-container" data-slug="{{ $districtSlug }}"></div>

    <section class="form-section" id="formSection">
        <div class="form-section__wrapper">
            <h3 class="form-section__title">ОСТАВЬТЕ ЗАЯВКУ</h3>
            <p class="form-section__description">Менеджер подберет лучший вариант с выгодой</p>
                    
            <form class="form-section__form" id="leadForm">
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
                </div>
                <p class="form-section__consent">Нажимая на кнопку, вы даете согласие на обработку данных</p>
            </form>
        </div>
    </section>
</div>

<script>
    window.districtSlug = @json($districtSlug);
</script>
@endsection

@section('scripts')
    @vite('resources/js/app.js')
@endsection
