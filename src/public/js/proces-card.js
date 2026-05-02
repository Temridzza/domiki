// ======================= ДАННЫЕ =======================
let districtsData = [];

// ======================= API ЗАПРОС =======================
async function fetchDistricts() {
    try {
        const response = await fetch('/api/districts');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        districtsData = await response.json();
        renderDistricts();
    } catch (error) {
        console.error('Ошибка при загрузке районов:', error);
        const container = document.getElementById('districtsContainer');
        if (container) {
            container.innerHTML = '<p class="districts__error" style="color: red;">Не удалось загрузить список районов</p>';
        }
    }
}

// ======================= ОТРИСОВКА КАРТОЧЕК =======================
function renderDistricts() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    districtsData.forEach(district => {
        const card = document.createElement('article'); // Семантичнее, чем div
        card.className = 'district-card';
        card.setAttribute('data-district', district.slug);
        
        // Обработчик клика
        card.addEventListener('click', () => {
            window.location.href = `сhoice/${district.slug}&${district.name}`;
        });
        
        // Изображение
        const imageContainer = document.createElement('div');
        imageContainer.className = 'district-card__image';
        // Используем атрибут style для фонового изображения, 
        // так как это декоративный элемент, а не контентный img
        imageContainer.style.backgroundImage = `url('/storage/${district.image}')`;
        
        // Заголовок
        const title = document.createElement('h3');
        title.className = 'district-card__title';
        title.textContent = district.name;
        
        // Описание
        const desc = document.createElement('p');
        desc.className = 'district-card__description';
        desc.textContent = district.description;
        
        // Собираем карточку
        card.appendChild(imageContainer);
        card.appendChild(title);
        card.appendChild(desc);
        
        container.appendChild(card);
    });
}

// ======================= ЗАПУСК =======================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchDistricts);
} else {
    fetchDistricts();
}
