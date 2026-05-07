document.addEventListener('DOMContentLoaded', function() {
    // ======================= ЭЛЕМЕНТЫ =======================
    const formSection = document.getElementById('applicationForm');
    const showFormButtons = document.querySelectorAll('[data-action="showForm"]');
    const form = document.getElementById('contactForm');
    
    // ======================= СКРЫТИЕ ФОРМЫ ПРИ ЗАГРУЗКЕ =======================
    if (formSection) {
        formSection.style.display = 'none';
    }
    
    // ======================= ПОКАЗ ФОРМЫ =======================
    function showFormAndScroll(event) {
        if (event) event.preventDefault();
        
        if (!formSection) return;
        
        // Показываем форму
        formSection.style.display = 'block';
        
        // Плавный скролл с небольшой задержкой
        setTimeout(() => {
            formSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Фокус на первом поле
            setTimeout(() => {
                const firstInput = formSection.querySelector('.form-field__input, .form-field__textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 400);
        }, 100);
    }
    
    // ======================= НАВЕШИВАНИЕ ОБРАБОТЧИКОВ НА КНОПКИ =======================
    showFormButtons.forEach(button => {
        button.addEventListener('click', showFormAndScroll);
    });
    
    // ======================= ОТПРАВКА ФОРМЫ =======================
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Поля
            const nameInput = document.getElementById('formName');
            const phoneInput = document.getElementById('formPhone');
            const wishesInput = document.getElementById('formWishes');
            
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const wishes = wishesInput.value.trim();
            
            // Очистка ошибок
            clearAllErrors();
            
            // Валидация
            let isValid = true;
            
            if (name === '') {
                showFieldError(nameInput, 'Пожалуйста, укажите ваше имя');
                isValid = false;
            } else if (name.length < 2) {
                showFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }
            
            if (phone === '') {
                showFieldError(phoneInput, 'Пожалуйста, укажите номер телефона');
                isValid = false;
            } else if (!isValidPhone(phone)) {
                showFieldError(phoneInput, 'Введите корректный номер телефона');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Отправка данных
            const formData = {
                name,
                phone,
                wishes: wishes || 'Не указано'
            };
            
            console.log('Отправка формы:', formData);
            
            // Имитация отправки (замените на реальный fetch)
            showFormMessage('success', `Спасибо, ${name}! Мы свяжемся с вами в ближайшее время.`);
            form.reset();
            
            /*
            // Реальная отправка:
            fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                showFormMessage('success', 'Спасибо! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            })
            .catch(error => {
                showFormMessage('error', 'Произошла ошибка. Пожалуйста, попробуйте позже.');
            });
            */
        });
    }
    
    // ======================= ВАЛИДАЦИЯ ТЕЛЕФОНА =======================
    function isValidPhone(phone) {
        const cleaned = phone.replace(/[^\d+]/g, '');
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        const digitsOnly = cleaned.replace(/\D/g, '');
        
        return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 12;
    }
    
    // ======================= ОТОБРАЖЕНИЕ ОШИБКИ ПОЛЯ =======================
    function showFieldError(input, message) {
        // Добавляем класс ошибки
        input.classList.add(
            input.tagName === 'TEXTAREA' ? 'form-field__textarea--error' : 'form-field__input--error'
        );
        
        // Создаём элемент ошибки
        const errorElement = document.createElement('div');
        errorElement.className = 'form-field__error';
        errorElement.textContent = message;
        
        // Вставляем после инпута
        input.parentNode.appendChild(errorElement);
    }
    
    // ======================= ОЧИСТКА ВСЕХ ОШИБОК =======================
    function clearAllErrors() {
        if (!form) return;
        
        // Удаляем сообщения об ошибках
        form.querySelectorAll('.form-field__error').forEach(el => el.remove());
        
        // Убираем классы ошибок
        form.querySelectorAll('.form-field__input--error, .form-field__textarea--error').forEach(el => {
            el.classList.remove('form-field__input--error', 'form-field__textarea--error');
        });
        
        // Удаляем глобальные сообщения
        const wrapper = formSection.querySelector('.form-section__wrapper');
        if (wrapper) {
            wrapper.querySelectorAll('.form-section__message').forEach(el => el.remove());
        }
    }
    
    // ======================= ГЛОБАЛЬНОЕ СООБЩЕНИЕ =======================
    function showFormMessage(type, message) {
        const wrapper = formSection.querySelector('.form-section__wrapper');
        if (!wrapper) return;
        
        // Удаляем старые сообщения
        wrapper.querySelectorAll('.form-section__message').forEach(el => el.remove());
        
        // Создаём новое
        const messageElement = document.createElement('div');
        messageElement.className = `form-section__message form-section__message--${type}`;
        messageElement.textContent = message;
        
        // Вставляем после формы
        const formElement = wrapper.querySelector('.form-section__form');
        formElement.after(messageElement);
        
        // Автоскрытие через 5 секунд
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // ======================= ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ =======================
    const phoneInput = document.getElementById('formPhone');
    const nameInput = document.getElementById('formName');
    
    [phoneInput, nameInput].forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', function() {
            const errorClass = this.tagName === 'TEXTAREA' ? 'form-field__textarea--error' : 'form-field__input--error';
            
            if (this.classList.contains(errorClass)) {
                const errorElement = this.parentNode.querySelector('.form-field__error');
                if (errorElement) errorElement.remove();
                this.classList.remove(errorClass);
            }
        });
    });
});
