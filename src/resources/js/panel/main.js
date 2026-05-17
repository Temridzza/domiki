/* -------------------------------------------------
   Основной JavaScript для админ-панели (с горизонтальными формами)
   ------------------------------------------------- */

/* ---------------------------------
   Глобальные переменные
   --------------------------------- */
let activeTab = "districts";
let authToken = null;

// Кэш для данных
const dataCache = {
    districts: null,
    newBuildings: null,
    lastUpdate: {}
};

const CACHE_TTL = 5 * 60 * 1000; // 5 минут

/* ---------------------------------
   API базовый URL
   --------------------------------- */
const API_BASE = '/api';

/* ---------------------------------
   Вспомогательные функции
   --------------------------------- */
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatPrice(price) {
    if (!price) return '0';
    return Number(price).toLocaleString('ru-RU') + ' ₽';
}

function getRoomsText(rooms) {
    const roomsMap = {
        1: '1-комнатная',
        2: '2-комнатная',
        3: '3-комнатная',
        4: '4-комнатная'
    };
    return roomsMap[rooms] || `${rooms}-комнатная`;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('notification--show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('notification--show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Загрузка с кэшем
async function loadWithCache(key, loader, forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && dataCache[key] && (now - dataCache.lastUpdate[key]) < CACHE_TTL) {
        return dataCache[key];
    }
    
    dataCache[key] = await loader();
    dataCache.lastUpdate[key] = now;
    return dataCache[key];
}

// Скелетон для быстрого отображения
function getSkeletonHTML() {
    return `
        <div class="skeleton">
            <div class="skeleton__header"></div>
            <div class="skeleton__grid">
                ${Array(3).fill('<div class="skeleton__card"></div>').join('')}
            </div>
        </div>
    `;
}

/* ---------------------------------
   API запросы
   --------------------------------- */
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    const response = await fetch(`${API_BASE}${endpoint}`, mergedOptions);
    
    if (response.status === 401) {
        showNotification('Сессия истекла, войдите снова', 'error');
        setTimeout(() => location.reload(), 1500);
        throw new Error('Unauthorized');
    }
    
    return response;
}

/* ---------------------------------
   Загрузка данных с API
   --------------------------------- */
async function loadDistricts() {
    try {
        const response = await apiRequest('/districts', { method: 'GET' });
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('Ошибка загрузки районов:', error);
        return [];
    }
}

async function loadNewBuildings() {
    try {
        const response = await apiRequest('/new-buildings', { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            const buildings = data.data || [];
            
            // Параллельная загрузка типов квартир для всех новостроек
            const buildingsWithTypes = await Promise.all(
                buildings.map(async (building) => {
                    const types = await loadApartmentTypes(building.id);
                    return { ...building, apartment_types: types };
                })
            );
            
            return buildingsWithTypes;
        }
        return [];
    } catch (error) {
        console.error('Ошибка загрузки новостроек:', error);
        return [];
    }
}

async function loadApartmentTypes(buildingId) {
    try {
        const response = await apiRequest(`/buildings/${buildingId}/apartment-types`, { method: 'GET' });
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('Ошибка загрузки типов квартир:', error);
        return [];
    }
}

/* ---------------------------------
   Создание записей через API
   --------------------------------- */
async function createDistrict(formData) {
    try {
        const response = await fetch(`${API_BASE}/districts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (response.ok) {
            showNotification('Район успешно создан');
            dataCache.districts = null;
            return true;
        } else {
            const error = await response.json();
            showNotification(error.message || 'Ошибка создания района', 'error');
            return false;
        }
    } catch (error) {
        showNotification('Ошибка подключения к серверу', 'error');
        return false;
    }
}

async function createNewBuilding(slug, formData) {
    try {
        const response = await fetch(`${API_BASE}/districts/${slug}/new-buildings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (response.ok) {
            showNotification('Новостройка успешно создана');
            dataCache.newBuildings = null;
            return true;
        } else {
            const error = await response.json();
            showNotification(error.message || 'Ошибка создания новостройки', 'error');
            return false;
        }
    } catch (error) {
        showNotification('Ошибка подключения к серверу', 'error');
        return false;
    }
}

async function createApartmentType(formData) {
    try {
        const response = await fetch(`${API_BASE}/apartment-types`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (response.ok) {
            showNotification('Тип квартиры успешно создан');
            dataCache.newBuildings = null;
            return true;
        } else {
            const error = await response.json();
            showNotification(error.message || 'Ошибка создания типа квартиры', 'error');
            return false;
        }
    } catch (error) {
        showNotification('Ошибка подключения к серверу', 'error');
        return false;
    }
}

/* ---------------------------------
   Рендеринг панели
   --------------------------------- */
async function renderMainPanel() {
    const container = document.getElementById('dynamicPanel');
    if (!container) return;

    container.innerHTML = getSkeletonHTML();
    
    if (activeTab === 'districts') {
        await renderDistrictsTab(container);
    } else if (activeTab === 'new-buildings') {
        await renderNewBuildingsTab(container);
    } else if (activeTab === 'apartments') {
        await renderApartmentsTab(container);
    }
}

async function renderDistrictsTab(container) {
    const districts = await loadWithCache('districts', loadDistricts);
    
    container.innerHTML = `
        <div class="section-card">
            <div class="section-card__title">
                <i class="fas fa-map-marker-alt"></i> 
                <span>Управление районами</span>
            </div>
            
            <div class="admin-form">
                <h3 class="admin-form__title">➕ Создать новый район</h3>
                <form id="createDistrictForm" enctype="multipart/form-data">
                    <div class="form-row">
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Название района *</label>
                            <input type="text" name="name" class="form-field__input" required placeholder="Например: Центральный">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Slug *</label>
                            <input type="text" name="slug" class="form-field__input" required placeholder="central">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Изображение</label>
                            <input type="file" name="image" class="form-field__file" accept="image/*">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--inline form-field--full">
                            <label class="form-field__label">Описание</label>
                            <textarea name="description" class="form-field__textarea" rows="2" placeholder="Краткое описание района"></textarea>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--inline form-field--full">
                            <label class="form-field__label">Преимущества</label>
                            <textarea name="advantages" class="form-field__textarea" rows="2" placeholder="Преимущества района через запятую"></textarea>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--actions">
                            <button type="submit" class="btn btn--primary">
                                <i class="fas fa-plus-circle"></i> Создать район
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <h3 class="section-card__subtitle">📋 Список районов</h3>
            <div id="districtsList"></div>
        </div>
    `;
    
    renderDistrictsList(districts);
    
    document.getElementById('createDistrictForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await createDistrict(formData);
        if (success) {
            e.target.reset();
            await renderDistrictsTab(container);
        }
    });
}

async function renderNewBuildingsTab(container) {
    const districts = await loadWithCache('districts', loadDistricts);
    const newBuildings = await loadWithCache('newBuildings', loadNewBuildings);
    
    container.innerHTML = `
        <div class="section-card">
            <div class="section-card__title">
                <i class="fas fa-city"></i> 
                <span>Управление новостройками</span>
            </div>
            
            <div class="admin-form">
                <h3 class="admin-form__title">🏗️ Создать новостройку</h3>
                <form id="createNewBuildingForm" enctype="multipart/form-data">
                    <div class="form-row">
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Район *</label>
                            <select name="district_slug" class="form-field__select" required>
                                <option value="">Выберите район</option>
                                ${districts.map(d => `<option value="${d.slug}">${escapeHtml(d.name)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Название ЖК *</label>
                            <input type="text" name="name" class="form-field__input" required placeholder="ЖК Солнечный">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Адрес *</label>
                            <input type="text" name="address" class="form-field__input" required placeholder="ул. Ленина 10">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Год сдачи</label>
                            <input type="text" name="completion_date" class="form-field__input" placeholder="2026">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Изображение</label>
                            <input type="file" name="image" class="form-field__file" accept="image/*">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">PDF от застройщика</label>
                            <input type="file" name="developer_pdf" class="form-field__file" accept=".pdf">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--inline form-field--full">
                            <label class="form-field__label">Преимущества</label>
                            <textarea name="advantages" class="form-field__textarea" rows="2" placeholder="Преимущества новостройки"></textarea>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--actions">
                            <button type="submit" class="btn btn--primary">
                                <i class="fas fa-plus-circle"></i> Создать новостройку
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <h3 class="section-card__subtitle">📋 Список новостроек</h3>
            <div id="newBuildingsList"></div>
        </div>
    `;
    
    renderNewBuildingsList(newBuildings);
    
    document.getElementById('createNewBuildingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const slug = formData.get('district_slug');
        formData.delete('district_slug');
        const success = await createNewBuilding(slug, formData);
        if (success) {
            e.target.reset();
            await renderNewBuildingsTab(container);
        }
    });
}

async function renderApartmentsTab(container) {
    const newBuildings = await loadWithCache('newBuildings', loadNewBuildings);
    
    container.innerHTML = `
        <div class="section-card">
            <div class="section-card__title">
                <i class="fas fa-bed"></i> 
                <span>Управление типами квартир</span>
            </div>
            
            <div class="admin-form">
                <h3 class="admin-form__title">➕ Добавить тип квартиры</h3>
                <form id="createApartmentTypeForm" enctype="multipart/form-data">
                    <div class="form-row">
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Новостройка *</label>
                            <select name="building_id" class="form-field__select" required>
                                <option value="">Выберите новостройку</option>
                                ${newBuildings.map(b => 
                                    `<option value="${b.id}">${escapeHtml(b.name)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Площадь (м²) *</label>
                            <input type="number" name="area" class="form-field__input" step="0.1" required placeholder="45.5">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Кол-во комнат *</label>
                            <select name="rooms" class="form-field__select" required>
                                <option value="1">1-комнатная</option>
                                <option value="2">2-комнатная</option>
                                <option value="3">3-комнатная</option>
                                <option value="4">4-комнатная</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Базовая цена *</label>
                            <input type="number" name="base_price" class="form-field__input" required placeholder="12000000">
                        </div>
                        <div class="form-field form-field--inline">
                            <label class="form-field__label">Изображение планировки</label>
                            <input type="file" name="layout_image" class="form-field__file" accept="image/*">
                        </div>
                        <div class="form-field form-field--actions">
                            <button type="submit" class="btn btn--primary">
                                <i class="fas fa-plus-circle"></i> Добавить
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <h3 class="section-card__subtitle">📋 Все типы квартир по новостройкам</h3>
            <div id="apartmentsByBuildings"></div>
        </div>
    `;
    
    await renderApartmentsByBuildings(newBuildings);
    
    document.getElementById('createApartmentTypeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await createApartmentType(formData);
        if (success) {
            e.target.reset();
            await renderApartmentsTab(container);
        }
    });
}

/* ---------------------------------
   Рендеринг списков
   --------------------------------- */
function renderDistrictsList(districts) {
    const container = document.getElementById('districtsList');
    if (!container) return;
    
    if (districts.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет районов. Создайте первый!</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="cards-grid">
            ${districts.map(district => `
                <div class="district-card">
                    ${district.image ? `<div class="district-card__image"><img src="/storage/${district.image}" alt="${escapeHtml(district.name)}"></div>` : ''}
                    <div class="district-card__content">
                        <h4 class="district-card__title">${escapeHtml(district.name)}</h4>
                        <p class="district-card__slug">slug: ${escapeHtml(district.slug)}</p>
                        ${district.description ? `<p class="district-card__description">${escapeHtml(district.description)}</p>` : ''}
                        ${district.advantages ? `<p class="district-card__advantages"><strong>Преимущества:</strong> ${escapeHtml(district.advantages)}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderNewBuildingsList(newBuildings) {
    const container = document.getElementById('newBuildingsList');
    if (!container) return;
    
    if (newBuildings.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет новостроек. Создайте первую!</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="cards-grid">
            ${newBuildings.map(building => `
                <div class="building-card">
                    ${building.image ? `<div class="building-card__image"><img src="/storage/${building.image}" alt="${escapeHtml(building.name)}"></div>` : ''}
                    <div class="building-card__content">
                        <h4 class="building-card__title">${escapeHtml(building.name)}</h4>
                        <p class="building-card__address"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(building.address)}</p>
                        <p class="building-card__district"><i class="fas fa-building"></i> Район: ${escapeHtml(building.district?.name || '—')}</p>
                        ${building.completion_date ? `<p class="building-card__date"><i class="fas fa-calendar"></i> Сдача: ${building.completion_date}</p>` : ''}
                        ${building.advantages ? `<p class="building-card__advantages">${escapeHtml(building.advantages)}</p>` : ''}
                        ${building.developer_pdf ? `<a href="/storage/${building.developer_pdf}" class="btn btn--small" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                        <div class="building-card__stats">
                            <i class="fas fa-bed"></i> Типов квартир: ${building.apartment_types?.length || 0}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function renderApartmentsByBuildings(newBuildings) {
    const container = document.getElementById('apartmentsByBuildings');
    if (!container) return;
    
    if (!newBuildings || newBuildings.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет новостроек. Сначала создайте новостройку!</div>';
        return;
    }
    
    let html = '<div class="buildings-accordion">';
    
    for (const building of newBuildings) {
        const apartmentTypes = building.apartment_types || [];
        
        html += `
            <div class="building-group" data-building-id="${building.id}">
                <div class="building-group__header">
                    <div class="building-group__info">
                        <h4 class="building-group__title">${escapeHtml(building.name)}</h4>
                        <p class="building-group__address">${escapeHtml(building.address)}</p>
                    </div>
                    <span class="building-group__count">${apartmentTypes.length} типов</span>
                    <button class="building-group__toggle">▼</button>
                </div>
                <div class="building-group__content">
                    <div class="apartment-types-grid">
                        ${apartmentTypes.map(type => `
                            <div class="apartment-type-card">
                                ${type.layout_image ? `
                                    <div class="apartment-type-card__image">
                                        <img src="/storage/${type.layout_image}" alt="Планировка">
                                    </div>
                                ` : `
                                    <div class="apartment-type-card__image" style="background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-building" style="font-size: 48px; color: #9ca3af;"></i>
                                    </div>
                                `}
                                <div class="apartment-type-card__content">
                                    <h5 class="apartment-type-card__title">
                                        ${getRoomsText(type.rooms)} • ${type.area} м²
                                    </h5>
                                    <div class="apartment-type-card__price">
                                        ${formatPrice(type.base_price)}
                                    </div>
                                    <div class="apartment-type-card__details">
                                        <span><i class="fas fa-ruler-combined"></i> ${type.area} м²</span>
                                        <span><i class="fas fa-door-open"></i> ${type.rooms} комн.</span>
                                    </div>
                                    ${type.available_count !== undefined ? `
                                        <div class="apartment-type-card__availability">
                                            <i class="fas fa-check-circle"></i> Доступно: ${type.available_count} шт.
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Инициализируем аккордеон
    document.querySelectorAll('.building-group__toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = btn.closest('.building-group');
            group.classList.toggle('building-group--open');
            btn.textContent = group.classList.contains('building-group--open') ? '▲' : '▼';
        });
    });
}

/* ---------------------------------
   Навигация по вкладкам
   --------------------------------- */
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav__item');
    const pageTitle = document.getElementById('pageTitle');
    const titles = {
        'districts': 'Управление районами',
        'new-buildings': 'Управление новостройками',
        'apartments': 'Управление типами квартир'
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', async () => {
            navItems.forEach(nav => nav.classList.remove('sidebar-nav__item--active'));
            item.classList.add('sidebar-nav__item--active');
            activeTab = item.getAttribute('data-tab');
            pageTitle.textContent = titles[activeTab] || 'Управление';
            await renderMainPanel();
        });
    });
}

/* ---------------------------------
   Авторизация
   --------------------------------- */
const loginOverlay = document.getElementById('loginOverlay');
const adminApp = document.getElementById('adminApp');
const tokenInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitLoginBtn');
const errorDiv = document.getElementById('loginError');

window.initAdminPanel = async function(token) {
    authToken = token;
    loginOverlay.style.display = 'none';
    adminApp.classList.remove('admin--hidden');
    initNavigation();
    await renderMainPanel();
};

async function handleLogin() {
    authToken = tokenInput.value.trim();
    
    if (!authToken) {
        showError('Введите токен');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin-test`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        
        if (data.message === 'вы админ') {
            await window.initAdminPanel(authToken);
        } else {
            showError('Неверный токен или недостаточно прав');
        }
    } catch (error) {
        showError('Ошибка подключения к серверу');
        console.error('Ошибка авторизации:', error);
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    tokenInput.value = '';
    tokenInput.focus();
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

submitBtn.addEventListener('click', handleLogin);
tokenInput.addEventListener('keypress', e => { 
    if (e.key === 'Enter') handleLogin(); 
});
