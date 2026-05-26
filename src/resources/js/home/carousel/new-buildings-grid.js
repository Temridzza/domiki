// resources/js/home/carousel/new-buildings-grid.js
import { createCarousel } from './carousel.js';

export async function renderNewBuildingsCards() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;

    container.innerHTML = '<div class="districts__loader">Загрузка новостроек...</div>';

    try {
        const response = await fetch('/api/new-buildings');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const { data: buildings } = await response.json();

        if (!buildings.length) {
            container.innerHTML = '<p class="districts__error">Нет доступных новостроек</p>';
            return;
        }

        const createBuildingCard = (building) => {
            const card = document.createElement('article');
            card.className = 'carousel-card';
            card.setAttribute('data-building-id', building.id);

            const imageContainer = document.createElement('div');
            imageContainer.className = 'carousel-card__image';
            const imageUrl = building.image && building.image !== 'default.png'
                ? `/storage/${building.image}`
                : '/storage/default.png';
            imageContainer.style.backgroundImage = `url('${imageUrl}')`;

            const title = document.createElement('h3');
            title.className = 'carousel-card__title';
            title.textContent = building.name;

            const desc = document.createElement('p');
            desc.className = 'carousel-card__description';
            desc.textContent = building.advantages || 'Нет информации о преимуществах';

            card.appendChild(imageContainer);
            card.appendChild(title);
            card.appendChild(desc);
            return card;
        };

        const onCardClick = (building) => {
            window.location.href = `/new-building/${building.id}`;
        };

        createCarousel(container, buildings, createBuildingCard, onCardClick);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить новостройки.</p>';
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const toggle = document.getElementById('viewToggle');
        if (toggle && toggle.checked) {
            renderNewBuildingsCards();
        }
    }, 250);
});
