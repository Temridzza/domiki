import './bootstrap';

console.log('Laravel + Vite + Docker работает!');

document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const districtsList = document.getElementById('districtsList');
    
    let isMenuOpen = false;
    let districtsLoaded = false;

    // Функция закрытия меню
    function closeMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
        isMenuOpen = false;
    }

    // Функция открытия меню и загрузки районов
    function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('mobile-menu--open');
        document.body.style.overflow = 'hidden'; // блокируем прокрутку фона
        isMenuOpen = true;
        
        // Загружаем районы, если ещё не загружены
        if (!districtsLoaded) {
            loadDistricts();
        }
    }

    // Загрузка районов из API
    async function loadDistricts() {
        if (!districtsList) return;
        
        try {
            districtsList.innerHTML = '<li class="mobile-menu__loader">Загрузка районов...</li>';
            const response = await fetch('/api/districts');
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки районов');
            }
            
            const districts = await response.json();
            
            if (!districts.length) {
                districtsList.innerHTML = '<li class="mobile-menu__empty">Районы не найдены</li>';
                return;
            }
            
            // Строим список районов: только название и полное описание
            const itemsHtml = districts.map(district => `
                <li class="mobile-menu__item" data-slug="${district.slug}">
                    <span class="mobile-menu__item-name">${escapeHtml(district.name)}</span>
                    ${district.description ? `<span class="mobile-menu__item-desc">${escapeHtml(district.description)}</span>` : ''}
                </li>
            `).join('');
            
            districtsList.innerHTML = itemsHtml;
            
            // Добавляем обработчики кликов по районам
            document.querySelectorAll('.mobile-menu__item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const slug = item.dataset.slug;
                    if (slug) {
                        window.location.href = `/choice/${slug}`;
                    }
                });
            });
            
            districtsLoaded = true;
        } catch (error) {
            console.error('Ошибка загрузки районов:', error);
            districtsList.innerHTML = '<li class="mobile-menu__error">Не удалось загрузить районы. Попробуйте позже.</li>';
        }
    }

    // Простая защита от XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Обработчик клика по бургеру
    if (burgerBtn) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Закрытие при клике вне меню (на overlay)
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
});
