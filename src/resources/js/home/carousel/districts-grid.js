// resources/js/home/carousel/districts-grid.js
import { createCarousel } from './carousel.js';

export async function renderDistrictsCards() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;

    container.innerHTML = '<div class="districts__loader">Загрузка районов...</div>';

    try {
        const response = await fetch('/api/districts');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const districts = await response.json();

        if (!districts.length) {
            container.innerHTML = '<p class="districts__error">Нет доступных районов</p>';
            return;
        }

        const createDistrictCard = (district) => {
            const card = document.createElement('article');
            card.className = 'carousel-card';
            card.setAttribute('data-district', district.slug);

            const imageContainer = document.createElement('div');
            imageContainer.className = 'carousel-card__image';
            const imageUrl = district.image && district.image !== 'default.png'
                ? `/storage/${district.image}`
                : '/storage/default.png';
            imageContainer.style.backgroundImage = `url('${imageUrl}')`;

            const title = document.createElement('h3');
            title.className = 'carousel-card__title';
            title.textContent = district.name;

            const desc = document.createElement('p');
            desc.className = 'carousel-card__description';
            desc.textContent = district.description || 'Описание отсутствует';

            card.appendChild(imageContainer);
            card.appendChild(title);
            card.appendChild(desc);
            return card;
        };

        const onCardClick = (district) => {
            window.location.href = `/choice/${district.slug}`;
        };

        createCarousel(container, districts, createDistrictCard, onCardClick);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить районы.</p>';
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const toggle = document.getElementById('viewToggle');
        if (toggle && !toggle.checked) {
            renderDistrictsCards();
        }
    }, 250);
});
