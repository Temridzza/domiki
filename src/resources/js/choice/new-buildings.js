// ========== Утилиты ==========
function formatPriceRange(apartmentTypes) {
    if (!apartmentTypes?.length) return 'Цена не указана';
    const prices = apartmentTypes.map(t => t.base_price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minMln = (minPrice / 1_000_000).toFixed(2);
    const maxMln = (maxPrice / 1_000_000).toFixed(2);
    if (minPrice === maxPrice) {
        return `от ${minMln} млн ₽`;
    }
    return `от ${minMln} до ${maxMln} млн ₽`;
}

function formatDeadline(dateStr) {
    if (!dateStr) return 'сдача 2026';
    const [year, month] = dateStr.split('-');
    const months = {
        '01': 'января', '02': 'февраля', '03': 'марта', '04': 'апреля',
        '05': 'мая', '06': 'июня', '07': 'июля', '08': 'августа',
        '09': 'сентября', '10': 'октября', '11': 'ноября', '12': 'декабря'
    };
    return `сдача ${months[month]} ${year}`;
}

function formatApartmentPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function getRoomsText(rooms) {
    const map = {1:'1-комнатная',2:'2-комнатная',3:'3-комнатная',4:'4-комнатная'};
    return map[rooms] || `${rooms}-комнатная`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== Вспомогательная функция для нахождения самой дешёвой доступной квартиры ==========
function getCheapestAvailableInfo(building) {
    let minPrice = Infinity;
    let totalCount = 0;
    let targetTypeId = null;
    let targetGroupFloor = null;
    
    building.apartment_types.forEach(type => {
        type.groupedApartments.forEach(group => {
            if (group.status === 'available' && group.price < minPrice) {
                minPrice = group.price;
                totalCount = group.count;
                targetTypeId = type.id;
                targetGroupFloor = group.floor;
            } else if (group.status === 'available' && group.price === minPrice) {
                totalCount += group.count;
            }
        });
    });
    
    if (minPrice === Infinity) return null;
    return {
        price: minPrice,
        count: totalCount,
        typeId: targetTypeId,
        floor: targetGroupFloor,
        formattedPrice: formatApartmentPrice(minPrice)
    };
}

// ========== Загрузка всех страниц новостроек ==========
async function fetchAllBuildings(slug) {
    let currentPage = 1;
    let allBuildings = [];
    let lastPage = 1;

    do {
        const url = `/api/districts/${slug}/new-buildings?page=${currentPage}&per_page=10`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        allBuildings.push(...data.data);
        lastPage = data.meta.last_page;
        currentPage++;
    } while (currentPage <= lastPage);

    return allBuildings;
}

// ========== Загрузка данных с группировкой квартир ==========
async function loadBuildingData(slug) {
    const buildings = await fetchAllBuildings(slug);
    if (!buildings.length) return [];

    const buildingsWithTypes = await Promise.all(buildings.map(async (building) => {
        const types = await fetchJSON(`/api/buildings/${building.id}/apartment-types`);
        const typesWithGrouped = await Promise.all(types.map(async (type) => {
            const apartmentsRes = await fetchJSON(`/api/apartment-types/${type.id}/apartments`);
            const apartments = apartmentsRes.data || [];
            
            const groups = new Map();
            apartments.forEach(apt => {
                const key = `${apt.floor}_${apt.price}_${apt.status}`;
                if (groups.has(key)) {
                    groups.get(key).count++;
                } else {
                    groups.set(key, {
                        floor: apt.floor,
                        price: apt.price,
                        status: apt.status,
                        count: 1,
                        sampleApt: apt
                    });
                }
            });
            
            return {
                ...type,
                groupedApartments: Array.from(groups.values())
            };
        }));
        
        return {
            ...building,
            apartment_types: typesWithGrouped
        };
    }));

    return buildingsWithTypes;
}

// ========== Отрисовка карточки новостройки ==========
function renderBuildingCard(building) {
    const imageUrl = building.image && building.image !== 'default.png'
        ? `/storage/${building.image}`
        : '/storage/default.png';

    const priceRange = formatPriceRange(building.apartment_types);
    const deadline = formatDeadline(building.completion_date);
    const buildingId = `building-${building.id}`;
    
    let advantagesHtml = '';
    if (building.advantages) {
        advantagesHtml = `<div class="building-card__advantages">${escapeHtml(building.advantages)}</div>`;
    }
    
    let pdfHtml = '';
    if (building.developer_pdf) {
        const pdfUrl = `/storage/${building.developer_pdf}`;
        pdfHtml = `<a href="${pdfUrl}" class="building-card__pdf-link" target="_blank">📄 Скачать PDF от застройщика</a>`;
    }

    let typesHtml = '';
    building.apartment_types.forEach(type => {
        const typeId = `${buildingId}-type-${type.id}`;
        const roomsText = getRoomsText(type.rooms);
        const areaText = `${type.area} м²`;
        const priceFrom = formatApartmentPrice(type.base_price);
        const totalAvailable = type.groupedApartments.reduce((sum, g) => sum + (g.status === 'available' ? g.count : 0), 0);
        
        let apartmentsHtml = '';
        if (type.groupedApartments.length) {
            apartmentsHtml = `
                <div class="building-card__apartments-list" id="${typeId}-list">
                    ${type.groupedApartments.map(group => {
                        const statusText = group.status === 'available' ? '✓ доступно' : '🔒 забронировано';
                        return `
                            <div class="building-card__apartment-group" data-floor="${group.floor}" data-price="${group.price}">
                                <span class="apartment-floor">Этаж: ${group.floor}</span>
                                <span class="apartment-price">${formatApartmentPrice(group.price)}</span>
                                <span class="apartment-status">${statusText}: ${group.count}</span>
                                <button class="btn btn_sm building-card__request-apartment" 
                                    data-apartment='${JSON.stringify({
                                        buildingName: building.name,
                                        rooms: roomsText,
                                        area: type.area,
                                        price: formatApartmentPrice(group.price),
                                        floor: group.floor,
                                        count: group.count
                                    })}'>
                                    Заявка
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            apartmentsHtml = '<div class="building-card__apartments-list">Нет доступных квартир</div>';
        }

        typesHtml += `
            <div class="building-card__type" data-type-id="${type.id}">
                <div class="building-card__type-header" data-toggle="${typeId}">
                    <div class="building-card__type-title">
                        <span>${roomsText}</span>
                        <span class="building-card__type-meta">${areaText} | от ${priceFrom}</span>
                        <span class="building-card__type-count">${totalAvailable} кв.</span>
                    </div>
                    <button class="building-card__type-toggle">▼</button>
                </div>
                <div class="building-card__type-body" id="${typeId}" style="display: none;">
                    ${apartmentsHtml}
                </div>
            </div>
        `;
    });

    // Призывной блок (самые дешёвые доступные квартиры)
    let urgentBlockHtml = '';
    const cheapest = getCheapestAvailableInfo(building);
    if (cheapest && cheapest.count > 0) {
        urgentBlockHtml = `
            <div class="urgent-block" data-building-id="${building.id}" data-min-price="${cheapest.price}" data-type-id="${cheapest.typeId}" data-floor="${cheapest.floor}">
                <div class="urgent-block__content">
                    <h3 class="urgent-block__title">⚡ ОСТАЛОСЬ ВСЕГО ${cheapest.count} ОБЪЕКТА</h3>
                    <p class="urgent-block__subtitle">Квартиры по специальной цене ${cheapest.formattedPrice}</p>
                </div>
                <button class="urgent-block__button">🔥 ПОДОБРАТЬ</button>
            </div>
        `;
    }

    const cardHtml = `
        <article class="building-card" data-building-id="${building.id}">
            <div class="building-card__header">
                <div class="building-card__image" style="background-image: url('${imageUrl}');"></div>
                <div class="building-card__info">
                    <h2 class="building-card__name">${escapeHtml(building.name)}</h2>
                    <div class="building-card__address">${escapeHtml(building.address)}</div>
                    <div class="building-card__price-deadline">
                        <span class="building-card__price">${priceRange}</span>
                        <span class="building-card__deadline">${deadline}</span>
                    </div>
                    ${advantagesHtml}
                    ${pdfHtml}
                    <button class="btn building-card__request-building" data-building-name="${escapeHtml(building.name)}">Заявка на ЖК</button>
                </div>
            </div>
            <div class="building-card__apartments">
                <div class="building-card__apartments-title">Квартиры</div>
                ${typesHtml}
                ${urgentBlockHtml}
            </div>
        </article>
    `;
    return cardHtml;
}

function renderBuildings(buildings) {
    const container = document.querySelector('.complexes-container');
    if (!container) return;

    if (!buildings.length) {
        container.innerHTML = '<div class="error-message">В этом районе пока нет новостроек</div>';
        return;
    }

    container.innerHTML = buildings.map(b => renderBuildingCard(b)).join('');

    // Обновляем счётчик новостроек
    const totalCountSpan = document.getElementById('totalApartmentsCount');
    if (totalCountSpan) totalCountSpan.innerText = buildings.length;

    // Переключатели типов квартир
    document.querySelectorAll('.building-card__type-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-toggle');
            const body = document.getElementById(targetId);
            if (body) {
                const isVisible = body.style.display !== 'none';
                body.style.display = isVisible ? 'none' : 'block';
                const toggleBtn = header.querySelector('.building-card__type-toggle');
                if (toggleBtn) toggleBtn.textContent = isVisible ? '▼' : '▲';
            }
        });
    });

    // Заявка на ЖК
    document.querySelectorAll('.building-card__request-building').forEach(btn => {
        btn.addEventListener('click', () => {
            const buildingName = btn.getAttribute('data-building-name');
            if (window.formManager) {
                window.formManager.showForm({ complexName: buildingName });
            } else {
                alert(`Заявка на ЖК "${buildingName}"`);
            }
        });
    });

    // Заявка на квартиру (группа)
    document.querySelectorAll('.building-card__request-apartment').forEach(btn => {
        btn.addEventListener('click', () => {
            const aptData = JSON.parse(btn.getAttribute('data-apartment'));
            if (window.formManager) {
                window.formManager.showForm(aptData);
            } else {
                alert(`Заявка на квартиру: ${aptData.rooms}, ${aptData.area}, ${aptData.price} (доступно ${aptData.count} шт.)`);
            }
        });
    });

    // Обработчики для блока "Осталось всего N объектов" – прокрутка к самым дешёвым
    document.querySelectorAll('.urgent-block__button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const urgentBlock = btn.closest('.urgent-block');
            if (!urgentBlock) return;
            
            const buildingId = urgentBlock.getAttribute('data-building-id');
            const targetTypeId = parseInt(urgentBlock.getAttribute('data-type-id'));
            const targetFloor = parseInt(urgentBlock.getAttribute('data-floor'));
            const targetPrice = parseInt(urgentBlock.getAttribute('data-min-price'));
            
            const buildingCard = document.querySelector(`.building-card[data-building-id="${buildingId}"]`);
            if (!buildingCard) return;
            
            const targetTypeDiv = buildingCard.querySelector(`.building-card__type[data-type-id="${targetTypeId}"]`);
            if (!targetTypeDiv) return;
            
            // Раскрываем тело типа, если оно свёрнуто
            const typeBody = targetTypeDiv.querySelector('.building-card__type-body');
            const toggleBtn = targetTypeDiv.querySelector('.building-card__type-toggle');
            if (typeBody && typeBody.style.display === 'none') {
                typeBody.style.display = 'block';
                if (toggleBtn) toggleBtn.textContent = '▲';
            }
            
            // Находим группу с нужным этажом и ценой
            const targetGroup = targetTypeDiv.querySelector(`.building-card__apartment-group[data-floor="${targetFloor}"][data-price="${targetPrice}"]`);
            if (targetGroup) {
                targetGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetGroup.style.transition = 'background 0.3s';
                targetGroup.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    targetGroup.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

// ========== Общая функция загрузки ==========
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// ========== Инициализация ==========
export async function initChoiceBuildings() {
    const slug = window.districtSlug;
    if (!slug) {
        console.error('districtSlug не определён');
        return;
    }

    const container = document.querySelector('.complexes-container');
    if (container) {
        container.innerHTML = '<div class="loading-spinner">Загрузка новостроек...</div>';
    }

    try {
        const buildings = await loadBuildingData(slug);
        renderBuildings(buildings);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        if (container) {
            container.innerHTML = '<div class="error-message">Не удалось загрузить данные. Попробуйте позже.</div>';
        }
    }
}
