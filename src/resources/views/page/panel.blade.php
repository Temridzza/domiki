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
            <p class="login-card__text">Введите Bearer токен для доступа к панели управления</p>
            <input type="password" id="passwordInput" class="login-card__input" placeholder="Bearer токен" autocomplete="off">
            <div id="loginError" class="login-card__error">Неверный токен. Попробуйте ещё раз.</div>
            <button id="submitLoginBtn" class="btn btn--primary" style="width: 100%; justify-content: center;">
                <i class="fas fa-key"></i> Войти
            </button>
        </div>
    </div>

    <!-- Основное приложение (скрыто до входа) -->
    <div id="adminApp" class="admin admin--hidden">
        <!-- Боковая панель -->
        <aside class="admin__sidebar">
            <div class="sidebar-header">
                <i class="fas fa-crown"></i>
                <span>Панель управления</span>
            </div>
            <nav class="sidebar-nav">
                <div class="sidebar-nav__item" data-tab="districts">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Районы</span>
                </div>
                <div class="sidebar-nav__item" data-tab="new-buildings">
                    <i class="fas fa-city"></i>
                    <span>Новостройки</span>
                </div>
                <div class="sidebar-nav__item" data-tab="apartments">
                    <i class="fas fa-bed"></i>
                    <span>Квартиры</span>
                </div>
            </nav>
        </aside>

        <!-- Основной контент -->
        <main class="admin__main">
            <div class="admin-header">
                <h1 class="admin-header__title" id="pageTitle">Управление районами</h1>
                <div class="admin-header__user">
                    <i class="fas fa-user-shield"></i>
                    <span>Администратор</span>
                </div>
            </div>
            <div id="dynamicPanel" class="admin-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <span>Загрузка...</span>
                </div>
            </div>
        </main>
    </div>

    <style>
        /* Стили для админ-панели */
        .admin {
            display: flex;
            min-height: 100vh;
            background: #f3f4f6;
        }

        .admin--hidden {
            display: none;
        }

        /* Боковая панель */
        .admin__sidebar {
            width: 280px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            display: flex;
            flex-direction: column;
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
        }

        .sidebar-header {
            padding: 24px 20px;
            font-size: 20px;
            font-weight: 600;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-header i {
            font-size: 24px;
            color: #f59e0b;
        }

        .sidebar-nav {
            flex: 1;
            padding: 20px 0;
        }

        .sidebar-nav__item {
            padding: 14px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #cbd5e1;
            border-left: 3px solid transparent;
        }

        .sidebar-nav__item:hover {
            background: rgba(255,255,255,0.1);
            color: white;
        }

        .sidebar-nav__item--active {
            background: rgba(255,255,255,0.1);
            color: white;
            border-left-color: #f59e0b;
        }

        .sidebar-nav__item i {
            width: 20px;
            font-size: 18px;
        }

        /* Основной контент */
        .admin__main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-x: auto;
        }

        .admin-header {
            background: white;
            padding: 20px 32px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .admin-header__title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
        }

        .admin-header__user {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #f3f4f6;
            border-radius: 8px;
            color: #4b5563;
        }

        .admin-content {
            padding: 32px;
        }

        /* Карточки */
        .section-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section-card__title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-card__subtitle {
            font-size: 18px;
            font-weight: 600;
            margin: 30px 0 20px;
            color: #374151;
        }

        /* Формы */
        .admin-form {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .admin-form__title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1f2937;
        }

        .admin-form__grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .form-field {
            display: flex;
            flex-direction: column;
        }

        .form-field__label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #374151;
        }

        .form-field__input,
        .form-field__select,
        .form-field__textarea {
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }

        .form-field__input:focus,
        .form-field__select:focus,
        .form-field__textarea:focus {
            outline: none;
            border-color: #f59e0b;
            box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
        }

        .form-field__textarea {
            resize: vertical;
            font-family: inherit;
        }

        .form-field__file {
            padding: 8px 0;
        }

        .form-field--actions {
            display: flex;
            align-items: flex-end;
        }

        /* Кнопки */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn--primary {
            background: #f59e0b;
            color: white;
        }

        .btn--primary:hover {
            background: #d97706;
            transform: translateY(-1px);
        }

        .btn--outline {
            background: white;
            border: 1px solid #e5e7eb;
            color: #374151;
        }

        .btn--outline:hover {
            background: #f9fafb;
        }

        .btn--small {
            padding: 6px 12px;
            font-size: 12px;
        }

        .btn--danger {
            background: #ef4444;
            color: white;
        }

        .btn--danger:hover {
            background: #dc2626;
        }

        /* Сетка карточек */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
            margin-top: 20px;
        }

        /* Карточка района */
        .district-card,
        .building-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }

        .district-card:hover,
        .building-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .district-card__image,
        .building-card__image {
            height: 200px;
            overflow: hidden;
            background: #f3f4f6;
        }

        .district-card__image img,
        .building-card__image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .district-card__content,
        .building-card__content {
            padding: 20px;
        }

        .district-card__title,
        .building-card__title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1f2937;
        }

        .district-card__slug {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 12px;
            font-family: monospace;
        }

        .district-card__description,
        .building-card__advantages {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.5;
            margin-top: 12px;
        }

        .district-card__advantages {
            font-size: 13px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
        }

        .building-card__address,
        .building-card__district,
        .building-card__date {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }

        .building-card__address i,
        .building-card__district i,
        .building-card__date i {
            width: 20px;
            margin-right: 8px;
        }

        /* Скелетон загрузки */
        .skeleton {
            padding: 20px;
        }

        .skeleton__header {
            height: 40px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
            margin-bottom: 24px;
        }

        .skeleton__grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .skeleton__card {
            height: 200px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 12px;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Группы новостроек для квартир */
        .buildings-accordion {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .building-group {
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
        }

        .building-group__header {
            padding: 20px;
            background: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: background 0.2s;
        }

        .building-group__header:hover {
            background: #f3f4f6;
        }

        .building-group__info {
            flex: 1;
        }

        .building-group__title {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: #1f2937;
        }

        .building-group__address {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }

        .building-group__count {
            padding: 4px 12px;
            background: #e5e7eb;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 12px;
        }

        .building-group__toggle {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #6b7280;
            padding: 4px 8px;
        }

        .building-group__content {
            display: none;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .building-group--open .building-group__content {
            display: block;
        }

        /* Сетка типов квартир */
        .apartment-types-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }

        .apartment-type-card {
            display: flex;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .apartment-type-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .apartment-type-card__image {
            width: 120px;
            background: #f3f4f6;
            overflow: hidden;
        }

        .apartment-type-card__image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .apartment-type-card__content {
            flex: 1;
            padding: 16px;
        }

        .apartment-type-card__title {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #1f2937;
        }

        .apartment-type-card__price {
            font-size: 18px;
            font-weight: 700;
            color: #f59e0b;
            margin-bottom: 8px;
        }

        .apartment-type-card__details {
            display: flex;
            gap: 12px;
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .apartment-type-card__availability {
            font-size: 13px;
            color: #10b981;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
        }

        /* Уведомления */
        .notification {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }

        .notification--show {
            opacity: 1;
            transform: translateX(0);
        }

        .notification__content {
            background: white;
            border-radius: 12px;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .notification--success .notification__content {
            background: #10b981;
            color: white;
        }

        .notification--error .notification__content {
            background: #ef4444;
            color: white;
        }

        /* Пустое состояние */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
            font-size: 16px;
        }

        /* Загрузчик */
        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px;
            color: #9ca3af;
        }

        .loading-spinner i {
            font-size: 48px;
            margin-bottom: 16px;
        }

        /* Модальное окно входа */
        .login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .login-card {
            background: white;
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .login-card__icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }

        .login-card__icon i {
            font-size: 40px;
            color: white;
        }

        .login-card__title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #1f2937;
        }

        .login-card__text {
            color: #6b7280;
            margin-bottom: 24px;
        }

        .login-card__input {
            width: 100%;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
        }

        .login-card__error {
            color: #ef4444;
            font-size: 14px;
            margin-bottom: 16px;
            display: none;
        }

        /* Адаптивность */
        @media (max-width: 768px) {
            .admin__sidebar {
                width: 80px;
            }
            
            .sidebar-header span,
            .sidebar-nav__item span {
                display: none;
            }
            
            .sidebar-header i {
                margin: 0;
            }
            
            .sidebar-nav__item {
                justify-content: center;
            }
            
            .admin-content {
                padding: 16px;
            }
            
            .cards-grid,
            .apartment-types-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
@endsection
