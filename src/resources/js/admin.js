import { testAdminBearer } from './panel/bearer-login';
import { initAdminPanel } from './panel/admin-menu';

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('loginOverlay');
    const bearerInput = document.getElementById('bearerInput');
    const submitBtn = document.getElementById('submitLoginBtn');
    const loginError = document.getElementById('loginError');

    async function handleLogin() {
        const token = bearerInput.value.trim();

        if (!token) {
            showError('Введите Bearer токен');
            return;
        }

        const isValid = await testAdminBearer(token);

        if (isValid) {
            initAdminPanel();
        } else {
            showError('Неверный токен. Попробуйте ещё раз.');
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

    if (submitBtn) {
        submitBtn.addEventListener('click', handleLogin);
    }

    if (bearerInput) {
        bearerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleLogin();
            }
        });
    }

    if (bearerInput && loginError) {
        bearerInput.addEventListener('input', () => {
            loginError.classList.add('login__error--hidden');
        });
    }
});
