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

// ========== ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', () => {
    // Создание частиц
    createParticles();
    
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
});
