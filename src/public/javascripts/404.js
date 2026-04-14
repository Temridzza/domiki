// ========== УПРАВЛЕНИЕ РАЙОНАМИ ЧЕРЕЗ JS ==========

// Используем данные из внешнего файла data.js
let districts = [];

// Загрузка районов из districtsData
function loadDistrictsFromData() {
    // Проверяем, существует ли districtsData
    if (typeof districtsData !== 'undefined' && Array.isArray(districtsData)) {
        districts = districtsData.map(district => ({
            id: district.id,
            name: district.name,
            description: district.description,
            imageUrl: district.imageUrl,
            icon: district.icon || this.getIconForDistrict(district.name)
        }));
        console.log('Районы загружены из districtsData:', districts.length);
    } else {
        // Fallback - если data.js не загружен
        console.warn('districtsData не найден, использую стандартные районы');
        loadDefaultDistricts();
    }
}

// Получение иконки для района (fallback)
function getIconForDistrict(name) {
    const icons = {
        'Центр': 'fa-star',
        'Север': 'fa-snowflake',
        'Юг': 'fa-sun',
        'Запад': 'fa-cloud-sun',
        'Восток': 'fa-city',
        'Пригород': 'fa-tree'
    };
    return icons[name] || 'fa-building';
}

// Стандартные районы (fallback)
function loadDefaultDistricts() {
    districts = [
        { id: 1, name: 'Центр', description: 'Исторический центр', icon: 'fa-star' },
        { id: 2, name: 'Север', description: 'Современные ЖК', icon: 'fa-snowflake' },
        { id: 3, name: 'Юг', description: 'Экология и школы', icon: 'fa-sun' },
        { id: 4, name: 'Запад', description: 'Бизнес-класс', icon: 'fa-cloud-sun' },
        { id: 5, name: 'Восток', description: 'Развитая инфраструктура', icon: 'fa-city' },
        { id: 6, name: 'Пригород', description: 'Тишина и природа', icon: 'fa-tree' }
    ];
}

// Рендер районов
function renderDistricts() {
    const container = document.getElementById('districtLinks');
    if (!container) return;
    
    container.innerHTML = '';
    districts.forEach(district => {
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('data-district-id', district.id);
        link.setAttribute('data-district-name', district.name);
        link.setAttribute('data-district-description', district.description || '');
        
        // Используем иконку из данных или стандартную
        const icon = district.icon || getIconForDistrict(district.name);
        
        link.innerHTML = `<i class="fas ${icon}"></i> ${district.name}`;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectDistrict(district);
        });
        container.appendChild(link);
    });
    
    console.log('Районы отображены:', districts.map(d => d.name));
}

// Выбор района (только уведомление, без открытия формы)
function selectDistrict(district) {
    const message = `🏙️ Район «${district.name}» — отличный выбор! ${district.description ? district.description : 'Посмотрите новостройки на главной странице.'}`;
    showToast(message);
    
    // Дополнительная информация в консоль
    console.log(`Выбран район: ${district.name}`, {
        id: district.id,
        description: district.description,
        imageUrl: district.imageUrl
    });
}

// ========== ФОРМА ЗАЯВКИ ==========

// Показать форму (только по кнопке "Оставить заявку")
function showForm() {
    const formSection = document.getElementById('applicationForm');
    if (formSection) {
        formSection.classList.add('show');
        showToast('📝 Форма заявки открыта, заполните поля');
        
        setTimeout(() => {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            formSection.style.transition = 'background 0.3s';
            formSection.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            setTimeout(() => { formSection.style.backgroundColor = ''; }, 1200);
        }, 100);
    }
}

// Валидация телефона
function validatePhone(phone) {
    const phoneClean = phone.replace(/[\s\-\(\)\+]/g, '');
    return phoneClean.length >= 10;
}

// Показать ошибку на поле
function showFieldError(field, message) {
    field.classList.add('error');
    showToast(message);
    setTimeout(() => {
        field.classList.remove('error');
    }, 2000);
}

// Отправка заявки
function submitForm(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('userName');
    const phoneInput = document.getElementById('userPhone');
    const wishesInput = document.getElementById('userWishes');
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const wishes = wishesInput.value.trim();
    
    // Валидация
    if (name === '') {
        showFieldError(nameInput, '⚠️ Пожалуйста, укажите ваше имя');
        return;
    }
    
    if (phone === '') {
        showFieldError(phoneInput, '⚠️ Введите номер телефона для связи');
        return;
    }
    
    if (!validatePhone(phone)) {
        showFieldError(phoneInput, '📞 Укажите корректный телефон (минимум 10 цифр)');
        return;
    }
    
    // Успешная отправка
    let wishesText = wishes ? ` Пожелания: "${wishes.substring(0, 70)}${wishes.length > 70 ? '…' : ''}"` : '';
    showToast(`✅ Спасибо, ${name}! Наш менеджер свяжется с вами в ближайшее время.${wishesText}`);
    
    // Логирование в консоль с деталями
    console.log('Заявка с 404 страницы:', {
        name: name,
        phone: phone,
        wishes: wishes,
        timestamp: new Date().toISOString(),
        page: '404'
    });
    
    // Очистка формы
    nameInput.value = '';
    phoneInput.value = '';
    wishesInput.value = '';
    
    // Опционально: скрыть форму после отправки (раскомментировать если нужно)
    // const formSection = document.getElementById('applicationForm');
    // formSection.classList.remove('show');
}

// ========== TOAST УВЕДОМЛЕНИЯ ==========

let toastTimeout = null;

function showToast(text, isError = false) {
    const toast = document.getElementById('toastMsg');
    const toastText = document.getElementById('toastText');
    
    if (!toast || !toastText) return;
    
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    toastText.innerHTML = text;
    toast.classList.add('show');
    
    if (isError) {
        toast.style.backgroundColor = '#c0392b';
        setTimeout(() => {
            toast.style.backgroundColor = '#0f2c38';
        }, 2800);
    }
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
    
    console.log('Уведомление:', text);
}

// ========== ПЕРЕХОД НА ГЛАВНУЮ ==========

function goToHome() {
    showToast('🏠 Перенаправляем на главную страницу...');
    setTimeout(() => {
        window.location.href = '/';
    }, 800);
}

// ========== АНИМАЦИИ ==========

function initAnimations() {
    // Анимация 404 при клике
    const errorCode = document.getElementById('errorCode');
    if (errorCode) {
        errorCode.addEventListener('click', () => {
            errorCode.style.transform = 'scale(1.1)';
            setTimeout(() => {
                errorCode.style.transform = '';
            }, 200);
            showToast('✨ 404 - но мы поможем найти вашу квартиру!');
        });
    }
    
    // Домашняя иконка
    const houseIcon = document.getElementById('houseIcon');
    if (houseIcon) {
        const icons = ['🏠', '🏗️', '🔑', '🏘️', '💎', '🌟', '🏰', '🌆'];
        let iconIndex = 0;
        
        houseIcon.addEventListener('click', () => {
            iconIndex = (iconIndex + 1) % icons.length;
            houseIcon.textContent = icons[iconIndex];
            showToast('✨ Дом мечты ждет вас!');
        });
        
        houseIcon.title = 'Кликни для смены иконки!';
    }
}

// ========== ЧАСТИЦЫ ==========

function createParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;
    
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 8 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 10 + 5 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        particlesContainer.appendChild(particle);
    }
}

// ========== ПОЛУЧЕНИЕ ИНФОРМАЦИИ О РАЙОНЕ ==========

// Функция для получения района по ID
function getDistrictById(id) {
    return districts.find(d => d.id === id);
}

// Функция для получения района по имени
function getDistrictByName(name) {
    return districts.find(d => d.name === name);
}

// Функция для получения всех районов
function getAllDistricts() {
    return [...districts];
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', () => {
    // Загрузка районов из districtsData
    loadDistrictsFromData();
    
    // Создание частиц
    createParticles();
    
    // Рендер районов
    renderDistricts();
    
    // Анимации
    initAnimations();
    
    // Кнопка "На главную"
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToHome();
        });
    }
    
    // Кнопка "Оставить заявку" - ТОЛЬКО ОНА ОТКРЫВАЕТ ФОРМУ
    const showFormBtn = document.getElementById('showFormBtn');
    if (showFormBtn) {
        showFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showForm();
        });
    }
    
    // Отправка формы
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', submitForm);
    }
});
