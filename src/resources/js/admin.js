import { testAdminBearer } from './panel/bearer-login.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('loginOverlay');
    const bearerInput = document.getElementById('bearerInput');
    const submitBtn = document.getElementById('submitLoginBtn');
    const loginError = document.getElementById('loginError');

    async function handleLogin() {
        const token = bearerInput.value.trim();

        // Если поле пустое — показываем ошибку и не идём дальше
        if (!token) {
            showError('Введите Bearer токен');
            return;
        }

        // Вызываем функцию проверки токена (пока всегда true, если token не пуст)
        const isValid = await testAdminBearer(token);

        if (isValid) {
            // Успешный вход: скрываем оверлей
            if (loginOverlay) loginOverlay.style.display = 'none';
            console.log('Доступ разрешён, панель управления открыта');
        } else {
            showError('Неверный токен. Попробуйте ещё раз.');
        }
    }

    // Функция для показа ошибки
    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.classList.remove('login__error--hidden');
        } else {
            alert(message);
        }
    }

    // Обработчик кнопки
    if (submitBtn) {
        submitBtn.addEventListener('click', handleLogin);
    }

    // Обработчик нажатия Enter в поле ввода
    if (bearerInput) {
        bearerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleLogin();
            }
        });
    }

    // Скрываем ошибку, когда пользователь начинает печатать
    if (bearerInput && loginError) {
        bearerInput.addEventListener('input', () => {
            loginError.classList.add('login__error--hidden');
        });
    }
});
