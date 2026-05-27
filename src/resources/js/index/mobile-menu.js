// Мобильное меню (бургер, overlay, загрузка районов)
export function initMobileMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const districtsList = document.getElementById('districtsList');
    
    let isMenuOpen = false;
    let districtsLoaded = false;

    function closeMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
        isMenuOpen = false;
    }

    function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('mobile-menu--open');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
        
        if (!districtsLoaded) {
            loadDistrictsForMenu();
        }
    }

    async function loadDistrictsForMenu() {
        if (!districtsList) return;
        
        try {
            districtsList.innerHTML = '<li class="mobile-menu__loader">Загрузка районов...</li>';
            const response = await fetch('/api/districts');
            
            if (!response.ok) throw new Error('Ошибка загрузки районов');
            
            const districts = await response.json();
            
            if (!districts.length) {
                districtsList.innerHTML = '<li class="mobile-menu__empty">Районы не найдены</li>';
                return;
            }
            
            const itemsHtml = districts.map(district => `
                <li class="mobile-menu__item" data-slug="${escapeHtml(district.slug)}">
                    <span class="mobile-menu__item-name">${escapeHtml(district.name)}</span>
                    ${district.description ? `<span class="mobile-menu__item-desc">${escapeHtml(district.description)}</span>` : ''}
                </li>
            `).join('');
            
            districtsList.innerHTML = itemsHtml;
            
            /*document.querySelectorAll('.mobile-menu__item').forEach(item => {
                item.addEventListener('click', () => {
                    const slug = item.dataset.slug;
                    if (slug) window.location.href = `/choice/${slug}`;
                });
            });*/

            document.querySelectorAll('.mobile-menu__item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // Обработка прямого URL (для "О нас", "Услуги")
                    const url = item.getAttribute('data-url');
                    if (url) {
                        window.location.href = url;
                        return;
                    }
                    // Обработка slug (для районов)
                    const slug = item.getAttribute('data-slug');
                    if (slug) {
                        window.location.href = `/choice/${slug}`;
                    }
                });
            }); 
            
            districtsLoaded = true;
        } catch (error) {
            console.error(error);
            districtsList.innerHTML = '<li class="mobile-menu__error">Не удалось загрузить районы</li>';
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isMenuOpen ? closeMenu() : openMenu();
        });
    }

    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });
}
