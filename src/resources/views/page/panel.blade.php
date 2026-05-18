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

<div class="container">
    <h1>📌 Админ панель</h1>
    <p>Не забыть сделать.</p>
</div>
@endsection

@section('scripts')
    @vite('resources/js/app.js')
    @vite('resources/js/admin.js')
@endsection
