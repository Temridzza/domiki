// Обработка формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const nameInput = document.getElementById('formName');
            const phoneInput = document.getElementById('formPhone');
            const wishesInput = document.getElementById('formWishes');
            
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const wishes = wishesInput.value.trim();
            
            // Очищаем предыдущие ошибки
            removeErrors(form);
            
            // Валидация
            let isValid = true;
            
            // Проверка имени
            if (name === '') {
                showError(nameInput, 'Пожалуйста, укажите ваше имя');
                isValid = false;
            } else if (name.length < 2) {
                showError(nameInput, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }
            
            // Проверка телефона
            if (phone === '') {
                showError(phoneInput, 'Пожалуйста, укажите номер телефона');
                isValid = false;
            } else if (!isValidPhone(phone)) {
                showError(phoneInput, 'Введите корректный номер телефона');
                isValid = false;
            }
            
            // Если валидация пройдена
            if (isValid) {
                // Подготавливаем данные для отправки
                const formData = {
                    name: name,
                    phone: phone,
                    wishes: wishes || 'Не указано'
                };
                
                console.log('Отправка формы:', formData);
                
                // Здесь можно добавить отправку на сервер
                // Пример с fetch:
                /*
                fetch('/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    showSuccessMessage('Спасибо! Мы свяжемся с вами в ближайшее время.');
                    form.reset();
                })
                .catch(error => {
                    showErrorMessage('Произошла ошибка. Пожалуйста, попробуйте позже.');
                });
                */
                
                // Временное сообщение об успехе (для демонстрации)
                showSuccessMessage('Спасибо, ' + name + '! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            }
        });
    }
    
    // Функция проверки телефона
    function isValidPhone(phone) {
        // Удаляем все пробелы и специальные символы, кроме цифр и +
        const cleaned = phone.replace(/[^\d+]/g, '');
        
        // Регулярное выражение для проверки номера телефона
        // Поддерживает: +7, 8, 7, а также коды городов
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        
        // Проверяем, что номер содержит от 10 до 12 цифр
        const digitsOnly = cleaned.replace(/\D/g, '');
        
        return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 12;
    }
    
    // Функция отображения ошибки
    function showError(input, message) {
        const formGroup = input.closest('.form-group-vertical');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-field';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
        `;
        errorDiv.textContent = message;
        
        input.style.borderColor = '#e74c3c';
        
        // Добавляем сообщение об ошибке после поля
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    
    // Функция удаления всех ошибок
    function removeErrors(form) {
        // Удаляем сообщения об ошибках
        const errorMessages = form.querySelectorAll('.error-message-field');
        errorMessages.forEach(error => error.remove());
        
        // Возвращаем нормальный цвет границ
        const inputs = form.querySelectorAll('.input-field');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    // Функция отображения сообщения об успехе
    function showSuccessMessage(message) {
        removeMessages();
        
        const formWrapper = document.querySelector('.form-wrapper');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-size: 1rem;
            animation: fadeIn 0.5s ease;
        `;
        successDiv.textContent = message;
        
        formWrapper.appendChild(successDiv);
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // Функция отображения сообщения об ошибке
    function showErrorMessage(message) {
        removeMessages();
        
        const formWrapper = document.querySelector('.form-wrapper');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-global';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-size: 1rem;
            animation: fadeIn 0.5s ease;
        `;
        errorDiv.textContent = message;
        
        formWrapper.appendChild(errorDiv);
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Функция удаления всех сообщений
    function removeMessages() {
        const messages = document.querySelectorAll('.success-message, .error-message-global');
        messages.forEach(message => message.remove());
    }
    
    // Добавляем анимацию для сообщений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Реальном времени валидация (опционально)
    const phoneInput = document.getElementById('formPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(231, 76, 60)') {
                const error = this.parentNode.querySelector('.error-message-field');
                if (error) error.remove();
                this.style.borderColor = '';
            }
        });
    }
    
    const nameInput = document.getElementById('formName');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(231, 76, 60)') {
                const error = this.parentNode.querySelector('.error-message-field');
                if (error) error.remove();
                this.style.borderColor = '';
            }
        });
    }
});
