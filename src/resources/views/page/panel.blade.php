@extends('layouts.app')

@section('title', 'Админ панель')

@section('content')
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(145deg, #f6f9fc 0%, #eef2f5 100%);
            font-family: 'Helvetica Neue', Roboto, 'Segoe UI', sans-serif;
        }

        .site-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        :root {
            --dark-bg: #0f2c38;
            --text-muted: #5f7e90;
            --border-color: #cfdfe9;
            --border-radius-md: 12px;
            --border-light: #eef3fc;
            --accent-color: #f7b32b;
            --hero-gradient-end: #144d5e;
            --transition-normal: 0.3s ease;
            --error-color: #e74c3c;
            --shadow-sm: 0 8px 20px rgba(0, 0, 0, 0.05);
            --shadow-md: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .form-section {
            background: #fafcff;
            padding: 70px 32px 80px;
            border-bottom: 1px solid #eef2f8;
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;
        }

        .form-wrapper {
            max-width: 700px;
            margin: 0 auto;
            width: 100%;
        }

        .form-wrapper h3 {
            font-size: 2.2rem;
            text-align: center;
            font-weight: 700;
            color: var(--dark-bg);
            margin-bottom: 12px;
        }

        .form-desc {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 36px;
            font-size: 1rem;
        }

        .form-group-vertical {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 30px;
        }

        .input-field {
            width: 100%;
            padding: 14px 18px;
            font-size: 1rem;
            border: 1px solid var(--border-light);
            border-radius: var(--border-radius-md);
            background: white;
            transition: all var(--transition-normal);
            font-family: 'Helvetica Neue', Roboto, sans-serif;
        }

        .input-field:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(247, 179, 43, 0.2);
        }

        .input-field.error {
            border-color: var(--error-color);
            background-color: #fff6f5;
        }

        .error-message-field {
            color: var(--error-color);
            font-size: 0.85rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .btn-submit {
            width: 100%;
            padding: 16px 24px;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 1px;
            color: white;
            background: var(--dark-bg);
            border: none;
            border-radius: var(--border-radius-md);
            cursor: pointer;
            transition: all var(--transition-normal);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
        }

        .btn-submit:hover {
            background: #1a4b5e;
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
        }

        .btn-submit:active {
            transform: scale(0.98);
        }

        .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .message {
            animation: fadeIn 0.5s ease;
            padding: 14px 18px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .message.success {
            background: #e0f7e8;
            color: #1e6f3f;
            border-left: 5px solid #2ecc71;
        }

        .message.error {
            background: #fee9e7;
            color: #c0392b;
            border-left: 5px solid var(--error-color);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-6px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.7s linear infinite;
            display: inline-block;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .token-input-wrapper {
            position: relative;
            width: 100%;
        }

        .toggle-visibility {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #7f8c8d;
            font-size: 1.2rem;
            padding: 0;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }

        .toggle-visibility:hover {
            color: var(--accent-color);
        }

        .badge-admin {
            background: linear-gradient(125deg, #f7b32b, #ffa01e);
            width: fit-content;
            margin: 0 auto 20px auto;
            padding: 6px 18px;
            border-radius: 60px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #1e2f3a;
            letter-spacing: 0.5px;
            box-shadow: var(--shadow-sm);
        }

        @media (max-width: 560px) {
            .form-section {
                padding: 40px 20px 60px;
            }
            .form-wrapper h3 {
                font-size: 1.8rem;
            }
        }
    </style>

<div class="form-section">
    <div class="form-wrapper">
        <!-- эмблема / акцент -->
        <div class="badge-admin">
            ЗОНА АДМИНИСТРИРОВАНИЯ
        </div>
        <h3>Вход по токену доступа</h3>
        <div class="form-desc">
            Введите уникальный токен для входа в панель управления
        </div>

        <!-- контейнер для глобальных сообщений (success / error) -->
        <div id="global-message-container"></div>

        <form id="token-login-form" novalidate>
            <div class="form-group-vertical">
                <div>
                    <div class="token-input-wrapper">
                        <input type="password" id="token-input" class="input-field" 
                               placeholder="Введите токен " 
                               autocomplete="off">
                        <button type="button" class="toggle-visibility" id="toggle-visibility-btn" aria-label="Показать/скрыть токен">
                            👁️
                        </button>
                    </div>
                    <div id="token-error" class="error-message-field" style="display: none;"></div>
                </div>
                
                <button type="submit" class="btn-submit" id="submit-btn">
                    <span id="btn-text">ВОЙТИ В ПАНЕЛЬ</span>
                </button>
            </div>
        </form>
    </div>
</div>

<script>
   // Предполагаемые вспомогательные функции (добавьте их)
    function showError(message) {
        const errorDiv = document.getElementById('token-error');
        errorDiv.textContent = `❌ ${message}`;
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-message-field error';
    }

    function showSuccess(message) {
        const errorDiv = document.getElementById('token-error');
        errorDiv.textContent = `✅ ${message}`;
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-message-field success';
    }

    function setLoading(loading) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        
        if (loading) {
            submitBtn.disabled = true;
            btnText.textContent = 'ЗАГРУЗКА...';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'ВОЙТИ В ПАНЕЛЬ';
        }
    }

    // Ваш код (готов к использованию!)
    const form = document.getElementById('token-login-form');
    const tokenInput = document.getElementById('token-input');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const token = tokenInput.value.trim();
        
        if (!token) {
            showError('Пожалуйста, введите токен доступа');
            tokenInput.focus();
            return;
        }
        
        if (token.length < 10) {
            showError('Неверный формат токена');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await fetch('/api/admin-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token: token })
            });
            
            if (response.ok) {
                const data = await response.json();
                showSuccess('Вход выполнен успешно!');
                // setTimeout(() => {
                //     window.location.href = '/dashboard'; // Или '/admin-panel'
                // }, 1000);
            } else {
                const error = await response.json();
                showError(error.message || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showError('Ошибка');
        } finally {
            setLoading(false);
        }
    });

    // Переключение видимости токена (без изменений)
    document.getElementById('toggle-visibility-btn').addEventListener('click', function() {
        const tokenInput = document.getElementById('token-input');
        const toggleBtn = this;
        
        if (tokenInput.type === 'password') {
            tokenInput.type = 'text';
            toggleBtn.textContent = '🙈';
            toggleBtn.setAttribute('aria-label', 'Скрыть токен');
        } else {
            tokenInput.type = 'password';
            toggleBtn.textContent = '👁️';
            toggleBtn.setAttribute('aria-label', 'Показать/скрыть токен');
        }
    });
</script>
@endsection
