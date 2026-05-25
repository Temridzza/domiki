// admin.js
// import { testAdminBearer } from './panel/bearer-login'; // больше не нужно
import { initAdminPanel } from './panel/admin-menu';

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('loginOverlay');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('submitLoginBtn');
    const loginError = document.getElementById('loginError');
    const adminContent = document.querySelector('.admin-panel-content');

    async function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError('Заполните email и пароль');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Успешный вход: скрываем оверлей, показываем админку
                loginOverlay.style.display = 'none';
                adminContent.style.display = 'block';
                initAdminPanel(data.token);   // передаём Bearer токен
            } else {
                // Ошибка: показать сообщение от сервера или общее
                const errorMsg = data.message || 'Неверный email или пароль';
                showError(errorMsg);
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            showError('Ошибка соединения с сервером');
        }
    }

    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.classList.remove('login__error--hidden');
        } else {
            alert(message);
        }
    }

    // Скрываем ошибку при вводе в любое поле
    const clearError = () => loginError?.classList.add('login__error--hidden');
    emailInput?.addEventListener('input', clearError);
    passwordInput?.addEventListener('input', clearError);
    submitBtn?.addEventListener('click', handleLogin);

    // Вход по Enter на любом поле
    const onKeyPress = (e) => { if (e.key === 'Enter') handleLogin(); };
    emailInput?.addEventListener('keypress', onKeyPress);
    passwordInput?.addEventListener('keypress', onKeyPress);
});
