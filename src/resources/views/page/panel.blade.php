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
            <p class="login__description">Введите Bearer токен для доступа к панели управления</p>
            <input type="password" id="bearerInput" class="login__input" placeholder="Bearer токен" autocomplete="off">
            <div id="loginError" class="login__error login__error--hidden">Неверный токен. Попробуйте ещё раз.</div>
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
                <li class="admin-menu__item" data-tab="districts">Районы</li>
                <li class="admin-menu__item" data-tab="types">Типы новостроек</li>
                <li class="admin-menu__item" data-tab="buildings">Новостройки</li>
                <li class="admin-menu__item" data-tab="flats">Квартиры</li>
            </ul>
        </nav>
        <div class="admin-menu__content">
            <div id="districts" class="admin-menu__pane admin-menu__pane--active">
                <h2>Интерфейс для работы с Районами</h2>
                <p>Здесь будет управление районами.</p>
            </div>
            <div id="types" class="admin-menu__pane">
                <h2>Интерфейс для работы с Типами новостроек</h2>
                <p>Здесь будет управление типами новостроек.</p>
            </div>
            <div id="buildings" class="admin-menu__pane">
                <h2>Интерфейс для работы с Новостройками</h2>
                <p>Здесь будет управление новостройками.</p>
            </div>
            <div id="flats" class="admin-menu__pane">
                <h2>Интерфейс для работы с Квартирами</h2>
                <p>Здесь будет управление квартирами.</p>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
    @vite('resources/js/app.js')
    @vite('resources/js/admin.js')
@endsection
