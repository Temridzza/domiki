// Генерация карточек районов на главной странице через API
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

        container.innerHTML = '';
        districts.forEach(district => {
            const card = createDistrictCard(district);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки районов:', error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить районы. Попробуйте позже.</p>';
    }
}

// Генерация карточек новостроек
export async function renderNewBuildingsCards() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;

    container.innerHTML = '<div class="districts__loader">Загрузка новостроек...</div>';

    try {
        const response = await fetch('/api/new-buildings');
        if (!response.ok) throw new Error('Ошибка загрузки');

        const result = await response.json();
        const newBuildings = result.data || result; // поддержка разных форматов ответа

        if (!newBuildings.length) {
            container.innerHTML = '<p class="districts__error">Нет доступных новостроек</p>';
            return;
        }

        container.innerHTML = '';
        newBuildings.forEach(building => {
            const card = createNewBuildingCard(building);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки новостроек:', error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить новостройки. Попробуйте позже.</p>';
    }
}

// Вспомогательная функция: создание карточки района
function createDistrictCard(district) {
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

    return card;
}

// Вспомогательная функция: создание карточки новостройки
function createNewBuildingCard(building) {
    const card = document.createElement('article');
    card.className = 'newbuilding-card';
    card.setAttribute('data-id', building.id);

    card.addEventListener('click', () => {
        // пример перехода на детальную страницу новостройки
        window.location.href = `/new-building/${building.id}`;
    });

    const imageContainer = document.createElement('div');
    imageContainer.className = 'newbuilding-card__image';
    const imageUrl = building.image && building.image !== 'default.png'
        ? `/storage/${building.image}`
        : '/storage/default.png';
    imageContainer.style.backgroundImage = `url('${imageUrl}')`;

    const title = document.createElement('h3');
    title.className = 'newbuilding-card__title';
    title.textContent = building.name;

    const address = document.createElement('p');
    address.className = 'newbuilding-card__address';
    address.textContent = building.address;

    const districtName = document.createElement('p');
    districtName.className = 'newbuilding-card__description';
    districtName.textContent = building.district ? building.district.name : '';

    card.appendChild(imageContainer);
    card.appendChild(title);
    card.appendChild(address);
    if (building.district) card.appendChild(districtName);

    return card;
}

// Инициализация: слушаем переключатель и рендерим начальное состояние
export function initDistrictsToggle() {
    const toggle = document.getElementById('districtToggle');
    if (!toggle) return;

    // Функция переключения контента
    const switchContent = () => {
        if (toggle.checked) {
            renderNewBuildingsCards();
        } else {
            renderDistrictsCards();
        }
    };

    toggle.addEventListener('change', switchContent);
    // Начальный рендер (районы)
    renderDistrictsCards();
}
