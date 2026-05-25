// resources/js/home/new-buildings-grid.js
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

        container.innerHTML = '';

        buildings.forEach(building => {
            const card = document.createElement('article');
            card.className = 'district-card';
            card.addEventListener('click', () => {
                // Переход на страницу новостройки (если нужно)
                // window.location.href = `/new-building/${building.id}`;
                console.log('Клик по новостройке', building.id);
            });

            const imageContainer = document.createElement('div');
            imageContainer.className = 'district-card__image';
            const imageUrl = building.image && building.image !== 'default.png'
                ? `/storage/${building.image}`
                : '/storage/default.png';
            imageContainer.style.backgroundImage = `url('${imageUrl}')`;

            const title = document.createElement('h3');
            title.className = 'district-card__title';
            title.textContent = building.name;

            const desc = document.createElement('p');
            desc.className = 'district-card__description';
            desc.textContent = building.advantages || 'Нет информации о преимуществах';

            card.appendChild(imageContainer);
            card.appendChild(title);
            card.appendChild(desc);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки новостроек:', error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить новостройки. Попробуйте позже.</p>';
    }
}
