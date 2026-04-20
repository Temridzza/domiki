// ===== ПЕРЕМЕННЫЕ =====
const SLUG = document.querySelector('.complexes-container')?.getAttribute('data-slug');

// Глобальный объект для хранения данных о квартирах
let apartmentsData = {};

// ===== ФУНКЦИЯ ЗАГРУЗКИ ТИПОВ КВАРТИР ДЛЯ ОДНОГО ЖК =====
async function loadApartmentTypes(buildingId) {
    try {
        const response = await fetch(`/api/buildings/${buildingId}/apartment-types`);
        const apartmentTypes = await response.json();
        return apartmentTypes;
    } catch (error) {
        console.error(`Ошибка загрузки квартир для building_id ${buildingId}:`, error);
        return [];
    }
}

// ===== ФУНКЦИЯ ФОРМАТИРОВАНИЯ ЦЕНЫ =====
function formatPrice(apartmentTypes) {
    if (!apartmentTypes || apartmentTypes.length === 0) {
        return 'Цена не указана';
    }
    const minPrice = Math.min(...apartmentTypes.map(type => type.base_price));
    const priceInMillions = (minPrice / 1000000).toFixed(2);
    return `от ${priceInMillions} млн ₽`;
}

// ===== ФУНКЦИЯ ФОРМАТИРОВАНИЯ ДАТЫ СДАЧИ =====
function formatDeadline(completionDate) {
    if (!completionDate) return 'сдача 2025';
    const year = completionDate.slice(0, 4);
    const month = completionDate.slice(5, 7);
    const monthNames = {
        '01': 'январь', '02': 'февраль', '03': 'март', '04': 'апрель',
        '05': 'май', '06': 'июнь', '07': 'июль', '08': 'август',
        '09': 'сентябрь', '10': 'октябрь', '11': 'ноябрь', '12': 'декабрь'
    };
    return `сдача ${monthNames[month]} ${year}`;
}

// ===== ФУНКЦИЯ ФОРМАТИРОВАНИЯ ЦЕНЫ ДЛЯ КВАРТИРЫ =====
function formatApartmentPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// ===== ФУНКЦИЯ ПОЛУЧЕНИЯ НАЗВАНИЯ КОМНАТ =====
function getRoomsText(rooms) {
    const roomsMap = {
        1: '1-комнатная',
        2: '2-комнатная',
        3: '3-комнатная',
        4: '4-комнатная'
    };
    return roomsMap[rooms] || `${rooms}-комнатная`;
}

// ===== ОБНОВЛЕНИЕ ГЛОБАЛЬНЫХ СЧЁТЧИКОВ =====
function updateGlobalCounters() {
    let total = 0;
    let special = 0;
    
    for (let key in apartmentsData) {
        total += apartmentsData[key].length;
        special += apartmentsData[key].filter(a => a.special).length;
    }
    
    const totalElement = document.getElementById('totalApartmentsCount');
    const specialElement = document.getElementById('specialPriceCount');
    
    if (totalElement) totalElement.innerText = total;
    if (specialElement) specialElement.innerText = special;
}

// ===== ОТРИСОВКА КВАРТИР =====
function renderApartments(complexKey, containerId, badgeId) {
    const apartments = apartmentsData[complexKey];
    const container = document.getElementById(containerId);
    
    if (!container || !apartments) return;
    
    container.innerHTML = '';
    
    apartments.forEach((apt, idx) => {
        const card = document.createElement('div');
        card.className = 'apartment-card';
        if (apt.special) card.classList.add('special-offer');
        card.setAttribute('data-apt-idx', idx);
        card.setAttribute('data-complex', complexKey);
        
        card.innerHTML = `
            <div class="apartment-details">
                <div class="apt-type">${apt.rooms}</div>
                <div class="apt-area">${apt.area}м²</div>
                <div class="apt-price">${apt.price}</div>
                <div class="apt-floor">Этаж: ${apt.floor || 'разные'}</div>
            </div>
            <div class="apt-actions">
                <button class="btn-sm view-detail-btn">Смотреть ▼</button>
                <button class="btn-sm btn-sm-primary request-apartment-btn">Оставить заявку</button>
            </div>
        `;
        
        const viewBtn = card.querySelector('.view-detail-btn');
        const requestBtn = card.querySelector('.request-apartment-btn');
        
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            expandCardByView(card, apt, complexKey);
        });
        
        requestBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(`✅ Заявка на ${apt.rooms} в ЖК ${apt.complexName} принята! Менеджер свяжется.`);
        });
        
        container.appendChild(card);
    });
    
    const badge = document.getElementById(badgeId);
    if (badge) badge.innerText = apartments.length;
}

// ===== РАЗВОРОТ КАРТОЧКИ С ДЕТАЛЯМИ =====
function expandCardByView(card, aptData, complexKey) {
    if (card.classList.contains('expanded')) return;
    
    const originalHtml = card.innerHTML;
    card.setAttribute('data-original-html', originalHtml);
    card.classList.add('expanded');
    card.innerHTML = '';
    
    const complexName = aptData.complexName || (complexKey === 'solar' ? 'ЖК Солнечный' : 'ЖК');
    
    // Формируем путь к изображению
    let imageUrl = '';
    if (aptData.layout_image) {
        // Проверяем, начинается ли путь с /storage/
        if (aptData.layout_image.startsWith('/storage/')) {
            imageUrl = aptData.layout_image;
        } else if (aptData.layout_image.startsWith('storage/')) {
            imageUrl = '/' + aptData.layout_image;
        } else {
            imageUrl = '/storage/' + aptData.layout_image;
        }
    }
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'expanded-header';
    headerDiv.innerHTML = `
        <div class="expanded-title">✨ ${aptData.rooms}</div>
        <div class="expanded-actions">
            <button class="btn-sm btn-sm-primary expanded-request-btn">Оставить заявку</button>
        </div>
    `;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'expanded-content';
    
    // Создаём блок изображения
    const imageDiv = document.createElement('div');
    imageDiv.className = 'expanded-image';
    // Устанавливаем стили, чтобы блок занимал всё пространство
    imageDiv.style.position = 'relative';
    imageDiv.style.overflow = 'hidden';
    imageDiv.style.padding = '0'; // Убираем отступы
    imageDiv.style.minHeight = '240px';
    
    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'img-placeholder-lg';
    imgPlaceholder.style.position = 'absolute';
    imgPlaceholder.style.top = '0';
    imgPlaceholder.style.left = '0';
    imgPlaceholder.style.width = '100%';
    imgPlaceholder.style.height = '100%';
    
    if (imageUrl) {
        // Если есть изображение - показываем его на весь блок
        imgPlaceholder.style.backgroundImage = `url('${imageUrl}')`;
        imgPlaceholder.style.backgroundSize = 'cover';
        imgPlaceholder.style.backgroundPosition = 'center';
        imgPlaceholder.style.backgroundRepeat = 'no-repeat';
        imgPlaceholder.innerHTML = '';
    } else {
        // Если нет изображения - центрируем плейсхолдер
        imgPlaceholder.style.display = 'flex';
        imgPlaceholder.style.flexDirection = 'column';
        imgPlaceholder.style.alignItems = 'center';
        imgPlaceholder.style.justifyContent = 'center';
        imgPlaceholder.style.textAlign = 'center';
        imgPlaceholder.style.fontSize = '4rem';
        imgPlaceholder.style.color = '#144d5e';
        imgPlaceholder.style.backgroundColor = '#fafcff';
        imgPlaceholder.innerHTML = `
            🏙️🌟
            <span style="display: block; font-size: 0.75rem; color: #5f7e90; margin-top: 8px;">Планировка премиум</span>
        `;
    }
    
    imageDiv.appendChild(imgPlaceholder);
    
    // Создаём блок с деталями
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'expanded-details-list';
    detailsDiv.innerHTML = `
        <div class="detail-row"><div class="detail-label">📐 Площадь:</div><div class="detail-value">${aptData.area}м²</div></div>
        <div class="detail-row"><div class="detail-label">💰 Цена:</div><div class="detail-value">${aptData.price}</div></div>
        <div class="detail-row"><div class="detail-label">🏢 Этаж:</div><div class="detail-value">${aptData.floor || 'разные'}</div></div>
        <div class="detail-row"><div class="detail-label">🏗️ Жилой комплекс:</div><div class="detail-value">${complexName}</div></div>
        <div class="detail-row"><div class="detail-label">📝 Описание:</div><div class="detail-value">${aptData.desc || 'Отличная планировка, развитая инфраструктура.'}</div></div>
    `;
    
    contentDiv.appendChild(imageDiv);
    contentDiv.appendChild(detailsDiv);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-expand-btn';
    closeBtn.textContent = 'Свернуть ▲';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        collapseCard(card, aptData, complexKey);
    });
    
    card.appendChild(headerDiv);
    card.appendChild(contentDiv);
    card.appendChild(closeBtn);
    
    const expandedRequest = card.querySelector('.expanded-request-btn');
    if (expandedRequest) {
        expandedRequest.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(`✅ Заявка на ${aptData.rooms} в ${complexName} принята!`);
        });
    }
}

// ===== СВОРАЧИВАНИЕ КАРТОЧКИ =====
function collapseCard(card, aptData, complexKey) {
    if (!card.classList.contains('expanded')) return;
    
    const original = card.getAttribute('data-original-html');
    if (original) {
        card.innerHTML = original;
        card.classList.remove('expanded');
        
        const newViewBtn = card.querySelector('.view-detail-btn');
        const newRequestBtn = card.querySelector('.request-apartment-btn');
        
        if (newViewBtn) {
            newViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                expandCardByView(card, aptData, complexKey);
            });
        }
        if (newRequestBtn) {
            newRequestBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert(`✅ Заявка на ${aptData.rooms} в ЖК ${aptData.complexName} принята!`);
            });
        }
    }
}

// ===== СОЗДАНИЕ КАРТОЧКИ ЖК =====
function createComplexCard(complex, index) {
    const uniqueId = `complex-${complex.id}`;
    const imageUrl = complex.image && complex.image !== 'default.png' 
        ? `/storage/${complex.image}` 
        : '/storage/default.png';
    
    return `
        <div class="complex-card" data-building-id="${complex.id}">
            <div class="complex-header">
                <div class="complex-image">
                    <div class="card-img" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; width: 100%; height: 100%;"></div>
                </div>
                <div class="complex-info">
                    <div class="info-row-1">
                        <span class="complex-name">${escapeHtml(complex.name)}</span>
                        <div class="price-deadline">
                            <span class="price">${complex.price}</span>
                            <span class="deadline">${complex.deadline}</span>
                        </div>
                    </div>
                    <div class="info-row-2">
                        <button class="btn-primary request-complex" data-complex="${escapeHtml(complex.name)}">ЗАЯВКА НА ЖК</button>
                    </div>
                </div>
            </div>
            <div class="apartments-wrapper">
                <div class="apartments-header">
                    <div class="apartments-title">
                        <span>КВАРТИРЫ</span>
                        <span class="apartment-badge" id="${uniqueId}Badge">0</span>
                    </div>
                    <button class="toggle-details-btn-header" data-target="${uniqueId}">ПОДРОБНЕЕ ▼</button>
                </div>
                <div class="apartments-list" id="${uniqueId}ApartmentsList">
                    <div class="apartments-grid" id="${uniqueId}ApartmentsGrid"></div>
                </div>
            </div>
        </div>
    `;
}

// ===== ЗАГРУЗКА ДАННЫХ И ОТРИСОВКА =====
async function load_Complex() {
    if (!SLUG) {
        console.error('Элемент .complexes-container или атрибут data-slug не найден');
        updateGlobalCounters();
        return;
    }
    
    const container = document.querySelector('.complexes-container');
    if (!container) return;
    
    // Показываем загрузку
    container.innerHTML = '<div class="loading">Загрузка новостроек...</div>';
    
    try {
        // Загружаем список новостроек
        const response = await fetch(`/api/districts/${SLUG}/new-buildings`);
        const result = await response.json();
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Обрабатываем каждую новостройку
        for (const building of result.data) {
            // Загружаем типы квартир
            const apartmentTypes = await loadApartmentTypes(building.id);
            
            // Формируем цену
            const price = formatPrice(apartmentTypes);
            const deadline = formatDeadline(building.completion_date);
            
            // Сохраняем данные о квартирах в глобальный объект
            const complexKey = `complex-${building.id}`;
            apartmentsData[complexKey] = apartmentTypes.map(type => ({
                id: type.id,
                rooms: getRoomsText(type.rooms),
                area: type.area,
                price: formatApartmentPrice(type.base_price),
                floor: 'разные',
                special: false,
                desc: `${getRoomsText(type.rooms)} квартира площадью ${type.area}м². Отличная планировка, развитая инфраструктура.`,
                complexName: building.name,
                available_count: type.available_count,
                layout_image: type.layout_image
            }));
            
            // Создаём карточку
            const complexData = {
                id: building.id,
                name: building.name,
                image: building.image,
                price: price,
                deadline: deadline
            };
            
            const cardHtml = createComplexCard(complexData, building.id);
            container.insertAdjacentHTML('beforeend', cardHtml);
            
            // Отрисовываем квартиры
            renderApartments(complexKey, `${complexKey}ApartmentsGrid`, `${complexKey}Badge`);
        }
        
        // Обновляем глобальные счётчики
        updateGlobalCounters();
        
        // Инициализируем обработчики
        initDropdowns();
        bindCommon();
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = '<div class="error">Ошибка загрузки данных</div>';
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ВЫПАДАЮЩИХ СПИСКОВ =====
function initDropdowns() {
    const toggles = document.querySelectorAll('.toggle-details-btn-header');
    
    toggles.forEach(btn => {
        // Удаляем старые обработчики, чтобы избежать дублирования
        btn.removeEventListener('click', btn._listener);
        
        const handler = (e) => {
            e.stopPropagation();
            const target = btn.getAttribute('data-target');
            const list = document.getElementById(`${target}ApartmentsList`);
            
            if (list) {
                list.classList.toggle('open');
                btn.innerHTML = list.classList.contains('open') ? 'ПОДРОБНЕЕ ▲ ' : 'ПОДРОБНЕЕ ▼';
            }
        };
        
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });
}

// ===== ОБЩИЕ ОБРАБОТЧИКИ =====
function bindCommon() {
    // Обработчик для кнопок "ЗАЯВКА НА ЖК"
    const requestComplexBtns = document.querySelectorAll('.request-complex');
    requestComplexBtns.forEach(btn => {
        btn.removeEventListener('click', btn._complexHandler);
        
        const handler = (e) => {
            e.stopPropagation();
            const complexName = btn.getAttribute('data-complex');
            alert(`✅ Заявка на ЖК "${complexName}" принята! Менеджер свяжется с вами.`);
        };
        
        btn._complexHandler = handler;
        btn.addEventListener('click', handler);
    });
}

// ===== ЭКРАНИРОВАНИЕ HTML =====
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    load_Complex();
});
