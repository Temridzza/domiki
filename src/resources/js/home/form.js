// Модуль для управления формой (показ/скрытие, отправка без перезагрузки)
/*export function initFormHandler() {
    const showFormBtn = document.querySelector('.hero__btn--primary[data-action="showForm"]');
    const formContainer = document.querySelector('.form-section');
    const leadForm = document.getElementById('leadForm');

    if (!showFormBtn || !formContainer || !leadForm) {
        console.warn('Form elements not found');
        return;
    }

    // Показ формы и фокус на первом поле
    const showFormAndFocus = () => {
        formContainer.classList.remove('form-section--hidden');
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = formContainer.querySelector('.form-field__input, .form-field__textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    };

    showFormBtn.addEventListener('click', showFormAndFocus);

    // Обработчик отправки формы
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Собираем данные
        const formData = new FormData(leadForm);
        const data = {
            userName: formData.get('userName'),
            userPhone: formData.get('userPhone'),
            userComment: formData.get('userComment'),
        };

        // Ищем блок для сообщения
        let messageBlock = leadForm.querySelector('.form-section__message');
        if (!messageBlock) {
            // Если блока нет, создаём его (на всякий случай)
            messageBlock = document.createElement('div');
            messageBlock.className = 'form-section__message';
            leadForm.appendChild(messageBlock);
        }

        // Имитация отправки (замените на реальный fetch)
        try {
            // Здесь будет ваш fetch-запрос к /api/leads или аналогичному
            console.log('Отправка формы:', data);

            // Успешный ответ (демо)
            messageBlock.textContent = '✅ Ваша заявка успешно отправлена!';
            messageBlock.classList.add('form-section__message--success');
            messageBlock.style.display = 'block';

            // Очищаем поля формы
            leadForm.reset();

            // Скрываем сообщение через 5 секунд
            setTimeout(() => {
                messageBlock.style.display = 'none';
                messageBlock.classList.remove('form-section__message--success');
            }, 5000);

        } catch (error) {
            console.error('Ошибка отправки:', error);
            messageBlock.textContent = '❌ Ошибка отправки. Попробуйте позже.';
            messageBlock.classList.add('form-section__message--error');
            messageBlock.style.display = 'block';

            setTimeout(() => {
                messageBlock.style.display = 'none';
                messageBlock.classList.remove('form-section__message--error');
            }, 5000);
        }
    });
}*/
// Модуль для управления формой (показ/скрытие, отправка без перезагрузки)
export function initFormHandler() {
    const showFormBtn = document.querySelector('.hero__btn--primary[data-action="showForm"]');
    const formContainer = document.querySelector('.form-section');
    const leadForm = document.getElementById('leadForm');

    if (!showFormBtn || !formContainer || !leadForm) {
        console.warn('Form elements not found');
        return;
    }

    // Показ формы и фокус на первом поле
    const showFormAndFocus = () => {
        formContainer.classList.remove('form-section--hidden');
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = formContainer.querySelector('.form-field__input, .form-field__textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    };

    showFormBtn.addEventListener('click', showFormAndFocus);

    // Обработчик отправки формы
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Собираем данные и преобразуем имена полей
        const formData = new FormData(leadForm);
        const data = {
            name: formData.get('userName'),      // важно: name, phone, message
            phone: formData.get('userPhone'),
            message: formData.get('userComment') || null, // если поле пустое – null
        };

        // Блок для сообщения об успехе/ошибке
        let messageBlock = leadForm.querySelector('.form-section__message');
        if (!messageBlock) {
            messageBlock = document.createElement('div');
            messageBlock.className = 'form-section__message';
            leadForm.appendChild(messageBlock);
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Успех
                messageBlock.textContent = '✅ Ваша заявка успешно отправлена!';
                messageBlock.classList.add('form-section__message--success');
                messageBlock.style.display = 'block';
                leadForm.reset();

                setTimeout(() => {
                    messageBlock.style.display = 'none';
                    messageBlock.classList.remove('form-section__message--success');
                }, 5000);
            } else {
                // Ошибки валидации или другие ошибки сервера
                const errorMsg = result.errors
                    ? Object.values(result.errors).flat().join(', ')
                    : (result.message || 'Ошибка отправки');
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            messageBlock.textContent = `❌ ${error.message || 'Попробуйте позже.'}`;
            messageBlock.classList.add('form-section__message--error');
            messageBlock.style.display = 'block';

            setTimeout(() => {
                messageBlock.style.display = 'none';
                messageBlock.classList.remove('form-section__message--error');
            }, 5000);
        }
    });
}
