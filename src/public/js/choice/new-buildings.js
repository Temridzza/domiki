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
    const complexCards = document.querySelectorAll('.complex-card');
    const totalComplexes = complexCards.length;
    
    const totalElement = document.getElementById('totalApartmentsCount');
    if (totalElement) totalElement.innerText = totalComplexes;
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
        if (apt.special) card.classList.add('apartment-card_special-offer');
        card.setAttribute('data-apt-idx', idx);
        card.setAttribute('data-complex', complexKey);
        
        card.innerHTML = `
            <div class="apartment-card__details">
                <div class="apartment-card__type">${apt.rooms}</div>
                <div class="apartment-card__area">${apt.area}м²</div>
                <div class="apartment-card__price">${apt.price}</div>
                <div class="apartment-card__floor">Этаж: ${apt.floor || 'разные'}</div>
            </div>
            <div class="apartment-card__actions">
                <button class="btn btn_sm apartment-card__view-btn">Смотреть ▼</button>
                <button class="btn btn_sm btn_primary apartment-card__request-btn">Оставить заявку</button>
            </div>
        `;
        
        const viewBtn = card.querySelector('.apartment-card__view-btn');
        const requestBtn = card.querySelector('.apartment-card__request-btn');
        
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
    if (card.classList.contains('apartment-card_expanded')) return;
    
    const originalHtml = card.innerHTML;
    card.setAttribute('data-original-html', originalHtml);
    card.classList.add('apartment-card_expanded');
    card.innerHTML = '';
    
    const complexName = aptData.complexName || (complexKey === 'solar' ? 'ЖК Солнечный' : 'ЖК');
    
    // Формируем путь к изображению
    let imageUrl = '';
    if (aptData.layout_image) {
        if (aptData.layout_image.startsWith('/storage/')) {
            imageUrl = aptData.layout_image;
        } else if (aptData.layout_image.startsWith('storage/')) {
            imageUrl = '/' + aptData.layout_image;
        } else {
            imageUrl = '/storage/' + aptData.layout_image;
        }
    }
    
    // Header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'apartment-card__header';
    headerDiv.innerHTML = `
        <div class="apartment-card__title">✨ ${aptData.rooms}</div>
        <div class="apartment-card__header-actions">
            <button class="btn btn_sm btn_primary apartment-card__expanded-request-btn">Оставить заявку</button>
        </div>
    `;
    
    // Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'apartment-card__content';
    
    // Image block
    const imageDiv = document.createElement('div');
    imageDiv.className = 'apartment-card__image';
    
    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'apartment-card__image-placeholder';
    
    if (imageUrl) {
        imgPlaceholder.style.backgroundImage = `url('${imageUrl}')`;
        imgPlaceholder.style.backgroundSize = 'cover';
        imgPlaceholder.style.backgroundPosition = 'center';
        imgPlaceholder.style.backgroundRepeat = 'no-repeat';
        imgPlaceholder.innerHTML = '';
    } else {
        imgPlaceholder.classList.add('apartment-card__image-placeholder_empty');
        imgPlaceholder.innerHTML = `
            🏙️🌟
            <span class="apartment-card__image-placeholder-text">Планировка премиум</span>
        `;
    }
    
    imageDiv.appendChild(imgPlaceholder);
    
    // Details block
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'apartment-card__details-list';
    detailsDiv.innerHTML = `
        <div class="apartment-card__detail-row">
            <div class="apartment-card__detail-label">📐 Площадь:</div>
            <div class="apartment-card__detail-value">${aptData.area}м²</div>
        </div>
        <div class="apartment-card__detail-row">
            <div class="apartment-card__detail-label">💰 Цена:</div>
            <div class="apartment-card__detail-value">${aptData.price}</div>
        </div>
        <div class="apartment-card__detail-row">
            <div class="apartment-card__detail-label">🏢 Этаж:</div>
            <div class="apartment-card__detail-value">${aptData.floor || 'разные'}</div>
        </div>
        <div class="apartment-card__detail-row">
            <div class="apartment-card__detail-label">🏗️ Жилой комплекс:</div>
            <div class="apartment-card__detail-value">${complexName}</div>
        </div>
        <div class="apartment-card__detail-row">
            <div class="apartment-card__detail-label">📝 Описание:</div>
            <div class="apartment-card__detail-value">${aptData.desc || 'Отличная планировка, развитая инфраструктура.'}</div>
        </div>
    `;
    
    contentDiv.appendChild(imageDiv);
    contentDiv.appendChild(detailsDiv);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'apartment-card__close-btn';
    closeBtn.textContent = 'Свернуть ▲';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        collapseCard(card, aptData, complexKey);
    });
    
    card.appendChild(headerDiv);
    card.appendChild(contentDiv);
    card.appendChild(closeBtn);
    
    // Expanded request button handler
    const expandedRequest = card.querySelector('.apartment-card__expanded-request-btn');
    if (expandedRequest) {
        expandedRequest.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(`✅ Заявка на ${aptData.rooms} в ${complexName} принята!`);
        });
    }
}

// ===== СВОРАЧИВАНИЕ КАРТОЧКИ =====
function collapseCard(card, aptData, complexKey) {
    if (!card.classList.contains('apartment-card_expanded')) return;
    
    const original = card.getAttribute('data-original-html');
    if (original) {
        card.innerHTML = original;
        card.classList.remove('apartment-card_expanded');
        
        const newViewBtn = card.querySelector('.apartment-card__view-btn');
        const newRequestBtn = card.querySelector('.apartment-card__request-btn');
        
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
            <div class="complex-card__header">
                <div class="complex-card__image">
                    <div class="complex-card__image-img" style="background-image: url('${imageUrl}');"></div>
                </div>
                <div class="complex-card__info">
                    <div class="complex-card__info-row">
                        <span class="complex-card__name">${escapeHtml(complex.name)}</span>
                        <div class="complex-card__price-deadline">
                            <span class="complex-card__price">${complex.price}</span>
                            <span class="complex-card__deadline">${complex.deadline}</span>
                        </div>
                    </div>
                    <div class="complex-card__info-row complex-card__info-row_actions">
                        <button class="btn-primary complex-card__request-btn" data-complex="${escapeHtml(complex.name)}">ЗАЯВКА НА ЖК</button>
                    </div>
                </div>
            </div>
            <div class="complex-card__apartments-wrapper">
                <div class="complex-card__apartments-header">
                    <div class="complex-card__apartments-title">
                        <span>КВАРТИРЫ</span>
                        <span class="complex-card__apartments-badge" id="${uniqueId}Badge">0</span>
                    </div>
                    <button class="toggle-btn complex-card__toggle-btn" data-target="${uniqueId}">ПОДРОБНЕЕ ▼</button>
                </div>
                <div class="complex-card__apartments-list" id="${uniqueId}ApartmentsList">
                    <div class="complex-card__apartments-grid" id="${uniqueId}ApartmentsGrid"></div>
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
    
    container.innerHTML = '<div class="loading">Загрузка новостроек...</div>';
    
    let loadedComplexesCount = 0;
    
    try {
        const response = await fetch(`/api/districts/${SLUG}/new-buildings`);
        const result = await response.json();
        
        container.innerHTML = '';
        
        for (const building of result.data) {
            const apartmentTypes = await loadApartmentTypes(building.id);
            const price = formatPrice(apartmentTypes);
            const deadline = formatDeadline(building.completion_date);
            
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
            
            const complexData = {
                id: building.id,
                name: building.name,
                image: building.image,
                price: price,
                deadline: deadline
            };
            
            const cardHtml = createComplexCard(complexData, building.id);
            container.insertAdjacentHTML('beforeend', cardHtml);
            
            loadedComplexesCount++;
            updateGlobalCounters();
            
            renderApartments(complexKey, `${complexKey}ApartmentsGrid`, `${complexKey}Badge`);
        }
        
        initDropdowns();
        bindCommon();
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = '<div class="error">Ошибка загрузки данных</div>';
        updateGlobalCounters();
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ВЫПАДАЮЩИХ СПИСКОВ =====
function initDropdowns() {
    const toggles = document.querySelectorAll('.complex-card__toggle-btn');
    
    toggles.forEach(btn => {
        btn.removeEventListener('click', btn._listener);
        
        const handler = (e) => {
            e.stopPropagation();
            const target = btn.getAttribute('data-target');
            const list = document.getElementById(`${target}ApartmentsList`);
            
            if (list) {
                list.classList.toggle('complex-card__apartments-list_open');
                btn.innerHTML = list.classList.contains('complex-card__apartments-list_open') 
                    ? 'ПОДРОБНЕЕ ▲' 
                    : 'ПОДРОБНЕЕ ▼';
            }
        };
        
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });
}

// ===== ОБЩИЕ ОБРАБОТЧИКИ =====
function bindCommon() {
    const requestComplexBtns = document.querySelectorAll('.complex-card__request-btn');
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
