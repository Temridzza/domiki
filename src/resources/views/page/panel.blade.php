@extends('layouts.app')

@section('title', 'Админ панель')

@section('content')
    <div class="login-container">
        <div class="login-header">
            <h1>🔐 Админ-панель</h1>
            <p>Введите Bearer токен для входа</p>
        </div>

        <div id="message" class="message"></div>

        <!-- Форма входа -->
        <form id="loginForm">
            <div class="form-group">
                <label for="token">Bearer токен:</label>
                <input 
                    type="password" 
                    id="token" 
                    name="token" 
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    required
                >
            </div>

            <button type="submit" class="login-btn" id="loginBtn">
                Войти
            </button>
        </form>

        <!-- Админ-панель -->
        <div id="adminPanel" style="display: none;">
            <div class="admin-panel">
                <h2 style="color: #28a745; margin-bottom: 1rem;">✅ Добро пожаловать, админ!</h2>
                <p style="color: #666; font-size: 1.1rem; margin-bottom: 1rem;">Вы успешно авторизованы</p>
                
                <div class="token-display" id="currentToken"></div>
                
                <div style="margin-top: 1.5rem;">
                    <button onclick="testProtected()" class="login-btn" style="background: #28a745; margin-bottom: 0.5rem;">
                        🧪 Тест защищенного API
                    </button>
                    <br>
                    <button onclick="logout()" class="login-btn" style="
                        background: #dc3545; 
                        font-size: 0.9rem;
                        padding: 10px;
                    ">
                        🚪 Выйти
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentToken = null;

        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const message = document.getElementById('message');
        const adminPanel = document.getElementById('adminPanel');
        const currentTokenEl = document.getElementById('currentToken');

        function showMessage(text, type) {
            message.textContent = text;
            message.className = `message ${type}`;
            message.style.display = 'block';
        }

        function hideMessage() {
            message.style.display = 'none';
        }

        function setLoading(loading) {
            loginBtn.disabled = loading;
            if (loading) {
                loginBtn.innerHTML = '<div class="loading"></div>Проверка...';
            } else {
                loginBtn.innerHTML = 'Войти';
            }
        }

        function logout() {
            currentToken = null;
            adminPanel.style.display = 'none';
            loginForm.style.display = 'block';
            hideMessage();
            document.getElementById('token').value = '';
        }

        // Тест защищенного API с Bearer токеном
        async function testProtected() {
            try {
                const response = await fetch('/api/protected', {  // Замените на ваш защищенный endpoint
                    headers: {
                        'Authorization': `Bearer ${currentToken}`
                    }
                });

                const data = await response.json();
                
                if (response.ok) {
                    showMessage('✅ Защищенный API работает!', 'success');
                } else {
                    showMessage(data.message || 'Ошибка доступа', 'error');
                }
            } catch (error) {
                showMessage('Ошибка подключения', 'error');
                console.error('Protected API error:', error);
            }
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = document.getElementById('token').value.trim();
            
            if (!token) {
                showMessage('Введите Bearer токен!', 'error');
                return;
            }

            setLoading(true);
            hideMessage();

            try {
                const response = await fetch('api/admin-test', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok && data.message === 'вы админ') {
                    currentToken = token;
                    currentTokenEl.textContent = `Bearer ${token.substring(0, 20)}...`;
                    
                    showMessage('✅ Авторизация успешна!', 'success');
                    loginForm.style.display = 'none';
                    adminPanel.style.display = 'block';
                } else {
                    showMessage(data.message || 'Неверный токен!', 'error');
                }
            } catch (error) {
                showMessage('Ошибка подключения к серверу', 'error');
                console.error('Auth error:', error);
            } finally {
                setLoading(false);
            }
        });
    </script>
@endsection
