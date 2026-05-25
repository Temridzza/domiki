@extends('layouts.app')

@section('title', 'Админ панель')

@section('style')
    @vite('resources/css/app.css')
@endsection

@section('content')
<div id="loginOverlay" class="login">
    <div class="login__container">
        <div class="login__card">
            <div class="login__icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <h2 class="login__title">Вход в систему</h2>
            <p class="login__description">Введите email и пароль администратора</p>

            <input type="email" id="loginEmail" class="login__input" placeholder="Email" autocomplete="email">
            <input type="password" id="loginPassword" class="login__input" placeholder="Пароль" autocomplete="current-password">

            <div id="loginError" class="login__error login__error--hidden">Неверный email или пароль</div>
            <button id="submitLoginBtn" class="login__button login__button--primary">
                <i class="fas fa-key"></i> Войти
            </button>
        </div>
    </div>
</div>

<div class="admin-panel-content" style="display: none;">
    <div class="admin-menu">
        <nav class="admin-menu__nav">
            <ul class="admin-menu__list">
                <li class="admin-menu__item" data-tab="recordsDistricts">Районы</li>
                <li class="admin-menu__item" data-tab="recordsTypes">Типы новостроек</li>
                <li class="admin-menu__item" data-tab="recordsBuildings">Новостройки</li>
                <li class="admin-menu__item" data-tab="recordsFlats">Квартиры</li>
            </ul>
        </nav>
        <div class="admin-menu__content">
            <div id="recordsDistricts" class="admin-menu__pane admin-menu__pane--active"></div>
            <div id="recordsTypes" class="admin-menu__pane"></div>
            <div id="recordsBuildings" class="admin-menu__pane"></div>
            <div id="recordsFlats" class="admin-menu__pane"></div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
    @vite('resources/js/app.js')
    @vite('resources/js/admin.js')
@endsection
