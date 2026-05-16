// Генерация карточек районов на главной странице через API
export async function renderDistrictsCards() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;

    // Показываем индикатор загрузки
    container.innerHTML = '<div class="districts__loader">Загрузка районов...</div>';

    try {
        const response = await fetch('/api/districts');
        if (!response.ok) throw new Error('Ошибка загрузки');

        const districts = await response.json();

        if (!districts.length) {
            container.innerHTML = '<p class="districts__error">Нет доступных районов</p>';
            return;
        }

        // Очищаем контейнер и рендерим карточки
        container.innerHTML = '';

        districts.forEach(district => {
            const card = document.createElement('article');
            card.className = 'district-card';
            card.setAttribute('data-district', district.slug);

            card.addEventListener('click', () => {
                window.location.href = `/choice/${district.slug}`;
            });

            const imageContainer = document.createElement('div');
            imageContainer.className = 'district-card__image';
            const imageUrl = district.image && district.image !== 'default.png'
                ? `/storage/${district.image}`
                : '/storage/default.png';
            imageContainer.style.backgroundImage = `url('${imageUrl}')`;

            const title = document.createElement('h3');
            title.className = 'district-card__title';
            title.textContent = district.name;

            const desc = document.createElement('p');
            desc.className = 'district-card__description';
            desc.textContent = district.description || 'Описание отсутствует';

            card.appendChild(imageContainer);
            card.appendChild(title);
            card.appendChild(desc);

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки районов:', error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить районы. Попробуйте позже.</p>';
    }
}
