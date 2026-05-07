@extends('layouts.app')

@section('title', 'Админ панель')

@section('content')
    <!-- Модальное окно входа -->
<div id="loginOverlay" class="login-overlay">
    <div class="login-card">
        <div class="login-card__icon">
            <i class="fas fa-shield-alt"></i>
        </div>
        <h2 class="login-card__title">Вход в систему</h2>
        <p class="login-card__text">Введите пароль для доступа к панели управления</p>
        <input type="password" id="passwordInput" class="login-card__input" placeholder="Пароль" autocomplete="off">
        <div id="loginError" class="login-card__error">Неверный пароль. Попробуйте ещё раз.</div>
        <button id="submitLoginBtn" class="btn btn--primary" style="width: 100%; justify-content: center;">
            <i class="fas fa-key"></i> Войти
        </button>
    </div>
</div>

<!-- Основное приложение (скрыто до входа) -->
<div id="adminApp" class="admin admin--hidden">
    <!-- Боковая панель -->
    <aside class="admin__sidebar">
        <nav class="sidebar-nav">
            <div class="sidebar-nav__item" data-tab="districts">
                <i class="fas fa-map-marker-alt"></i>
                <span>Районы</span>
            </div>
            <div class="sidebar-nav__item" data-tab="complexes">
                <i class="fas fa-city"></i>
                <span>Комплексы</span>
            </div>
            <div class="sidebar-nav__item" data-tab="apartments">
                <i class="fas fa-bed"></i>
                <span>Квартиры</span>
            </div>
            <div class="sidebar-nav__item" data-tab="requests">
                <i class="fas fa-headset"></i>
                <span>Запросы</span>
            </div>
            <div class="sidebar-nav__item" data-tab="users">
                <i class="fas fa-users"></i>
                <span>Пользователи</span>
            </div>
        </nav>
    </aside>

    <!-- Основной контент -->
    <main class="admin__main" id="mainContent">
        <div id="dynamicPanel">Загрузка...</div>
    </main>
</div>

<!-- Модальное окно редактирования -->
<div id="editModal" class="modal">
    <div class="modal__content">
        <h3 id="modalTitle" class="modal__title">Редактировать</h3>
        <div id="modalFormFields"></div>
        <div class="modal__actions">
            <button class="btn btn--outline" id="modalCancelBtn">Отмена</button>
            <button class="btn btn--primary" id="modalSaveBtn">Сохранить</button>
        </div>
    </div>
</div>

<script src="{{ asset('js/panel/main.js') }}" ></script>
@endsection
