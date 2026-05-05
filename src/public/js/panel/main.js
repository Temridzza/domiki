/* -------------------------------------------------
   Основной JavaScript для админ-панели
   ------------------------------------------------- */

/* ---------------------------------
   Данные (примерные) и вспомогательные переменные
   --------------------------------- */
let districts = [
    { id: 1, name: "Центральный", description: "Исторический центр города, развитая инфраструктура" },
    { id: 2, name: "Северный", description: "Новые жилые кварталы, экологичный район" }
];
let complexes = [
    { id: 1, name: "ЖК 'Алые Паруса'", districtId: 1, address: "ул. Ленина 10" },
    { id: 2, name: "Северная Долина", districtId: 2, address: "пр. Мира 55" }
];
let apartments = [
    { id: 1, complexId: 1, rooms: 2, price: 12500000, area: 58.5 },
    { id: 2, complexId: 2, rooms: 3, price: 18900000, area: 82.3 }
];
let requests = [
    { id: 1, userName: "Иван Петров", apartmentId: 1, message: "Хочу записаться на просмотр", status: "новый" },
    { id: 2, userName: "Мария Смирнова", apartmentId: 2, message: "Возможна ли скидка?", status: "в обработке" }
];
let users = [
    { id: 1, fullName: "Алексей Иванов", email: "alex@mail.ru", role: "администратор" },
    { id: 2, fullName: "Ольга Кузнецова", email: "olga@mail.ru", role: "менеджер" }
];

/* ---------------------------------
   Генератор уникальных идентификаторов
   --------------------------------- */
// Вместо использования Date.now() (что дает большие числа вроде 1777990811027)
// используем простой автоинкрементный счётчик, который гарантирует
// последовательные небольшие ID и предсказуемость при тестировании.
let nextId = 100; // стартовое значение, можно изменить при необходимости
function getNextId() {
    return ++nextId;
}

/* ---------------------------------
   Текущее состояние UI
   --------------------------------- */
let currentEditType = null;
let currentEditId = null;
let activeTab = "districts";

/* ---------------------------------
   Вспомогательные функции
   --------------------------------- */
function getDistrictOptions(selectedId = null) {
    return districts
        .map(d => `<option value="${d.id}" ${selectedId == d.id ? 'selected' : ''}>${escapeHtml(d.name)}</option>`)
        .join('');
}
function getComplexOptions(selectedId = null) {
    return complexes
        .map(c => `<option value="${c.id}" ${selectedId == c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
        .join('');
}
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

/* ---------------------------------
   Рендеринг панелей
   --------------------------------- */
function renderMainPanel() {
    const container = document.getElementById('dynamicPanel');
    if (!container) return;

    if (activeTab === 'districts') {
        container.innerHTML = `
            <div class="section-card">
                <div class="section-card__title"><i class="fas fa-map-marker-alt"></i> Районы</div>
                <div class="section-card__subtitle">Управление районами города: добавление, редактирование, удаление</div>
                
                <div class="admin-form">
                    <h3 style="margin-bottom: 16px;">➕ Добавить район</h3>
                    <div class="admin-form__grid">
                        <div class="form-field"><label class="form-field__label">Название района</label><input type="text" id="districtName" class="form-field__input" placeholder="Например: Приморский"></div>
                        <div class="form-field"><label class="form-field__label">Описание</label><input type="text" id="districtDesc" class="form-field__input" placeholder="Краткое описание"></div>
                        <div><button id="addDistrictBtn" class="btn btn--primary"><i class="fas fa-plus-circle"></i> Создать район</button></div>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 16px;">📋 Список районов</h3>
                <table class="data-table">
                    <thead><tr><th class="data-table__header">ID</th><th class="data-table__header">Название</th><th class="data-table__header">Описание</th><th class="data-table__header">Действия</th></tr></thead>
                    <tbody id="districtsTableBody"></tbody>
                </table>
            </div>
        `;
        renderDistrictsTable();
        document.getElementById('addDistrictBtn')?.addEventListener('click', addDistrict);
    } else if (activeTab === 'complexes') {
        container.innerHTML = `
            <div class="section-card">
                <div class="section-card__title"><i class="fas fa-city"></i> Жилые комплексы</div>
                <div class="section-card__subtitle">Привязка к районам города</div>
                
                <div class="admin-form">
                    <h3 style="margin-bottom: 16px;">📌 Добавить комплекс</h3>
                    <div class="admin-form__grid">
                        <div class="form-field"><label class="form-field__label">Название ЖК</label><input id="complexName" class="form-field__input" placeholder="Например: ЖК Золотая Гавань"></div>
                        <div class="form-field"><label class="form-field__label">Район</label><select id="complexDistrictId" class="form-field__select">${getDistrictOptions()}</select></div>
                        <div class="form-field"><label class="form-field__label">Адрес</label><input id="complexAddress" class="form-field__input" placeholder="ул. Примерная 1"></div>
                        <div><button id="addComplexBtn" class="btn btn--primary"><i class="fas fa-plus"></i> Добавить комплекс</button></div>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 16px;">🏢 Список комплексов</h3>
                <table class="data-table"><thead><tr><th class="data-table__header">ID</th><th class="data-table__header">Название</th><th class="data-table__header">Район</th><th class="data-table__header">Адрес</th><th class="data-table__header">Действия</th></tr></thead><tbody id="complexesTableBody"></tbody></table>
            </div>
        `;
        renderComplexesTable();
        document.getElementById('addComplexBtn')?.addEventListener('click', addComplex);
    } else if (activeTab === 'apartments') {
        container.innerHTML = `
            <div class="section-card">
                <div class="section-card__title"><i class="fas fa-bed"></i> Квартиры</div>
                <div class="section-card__subtitle">Добавление квартир в жилых комплексах</div>
                
                <div class="admin-form">
                    <h3 style="margin-bottom: 16px;">🏠 Добавить квартиру</h3>
                    <div class="admin-form__grid">
                        <div class="form-field"><label class="form-field__label">Жилой комплекс</label><select id="aptComplexId" class="form-field__select">${getComplexOptions()}</select></div>
                        <div class="form-field"><label class="form-field__label">Кол-во комнат</label><input id="aptRooms" type="number" class="form-field__input" placeholder="2"></div>
                        <div class="form-field"><label class="form-field__label">Цена (₽)</label><input id="aptPrice" type="number" class="form-field__input" placeholder="12500000"></div>
                        <div class="form-field"><label class="form-field__label">Площадь (м²)</label><input id="aptArea" step="any" class="form-field__input" placeholder="58.5"></div>
                        <div><button id="addAptBtn" class="btn btn--primary">➕ Добавить квартиру</button></div>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 16px;">📄 Список квартир</h3>
                <table class="data-table"><thead><tr><th class="data-table__header">ID</th><th class="data-table__header">Комплекс</th><th class="data-table__header">Комнат</th><th class="data-table__header">Цена</th><th class="data-table__header">Площадь</th><th class="data-table__header">Действия</th></tr></thead><tbody id="apartmentsTableBody"></tbody></table>
            </div>
        `;
        renderApartmentsTable();
        document.getElementById('addAptBtn')?.addEventListener('click', addApartment);
    } else if (activeTab === 'requests') {
        container.innerHTML = `
            <div class="section-card">
                <div class="section-card__title"><i class="fas fa-headset"></i> Запросы клиентов</div>
                <div class="section-card__subtitle">Обработка и управление заявками от клиентов</div>
                
                <div class="divider"></div>
                
                <div class="admin-form">
                    <h3 style="margin-bottom: 16px;">📩 Добавить запрос</h3>
                    <div class="admin-form__grid">
                        <div class="form-field"><label class="form-field__label">Имя клиента</label><input id="reqName" class="form-field__input" placeholder="Иван Петров"></div>
                        <div class="form-field"><label class="form-field__label">Квартира (ID)</label><input id="reqApartmentId" type="number" class="form-field__input" placeholder="ID квартиры"></div>
                        <div class="form-field"><label class="form-field__label">Сообщение</label><input id="reqMsg" class="form-field__input" placeholder="текст запроса"></div>
                        <div class="form-field"><label class="form-field__label">Статус</label><select id="reqStatus" class="form-field__select"><option>новый</option><option>в обработке</option><option>завершен</option></select></div>
                        <div><button id="addRequestBtn" class="btn btn--primary">📩 Добавить запрос</button></div>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 16px;">📋 Список запросов</h3>
                <table class="data-table"><thead><tr><th class="data-table__header">ID</th><th class="data-table__header">Клиент</th><th class="data-table__header">Квартира ID</th><th class="data-table__header">Сообщение</th><th class="data-table__header">Статус</th><th class="data-table__header">Действия</th></tr></thead><tbody id="requestsTableBody"></tbody></table>
            </div>
        `;
        renderRequestsTable();
        document.getElementById('addRequestBtn')?.addEventListener('click', addRequest);
    } else if (activeTab === 'users') {
        container.innerHTML = `
            <div class="section-card">
                <div class="section-card__title"><i class="fas fa-users"></i> Пользователи системы</div>
                <div class="section-card__subtitle">Управление учетными записями пользователей</div>
                
                <div class="admin-form">
                    <h3 style="margin-bottom: 16px;">👤 Создать пользователя</h3>
                    <div class="admin-form__grid">
                        <div class="form-field"><label class="form-field__label">ФИО</label><input id="userName" class="form-field__input" placeholder="Анна Смирнова"></div>
                        <div class="form-field"><label class="form-field__label">Email</label><input id="userEmail" type="email" class="form-field__input" placeholder="user@example.com"></div>
                        <div class="form-field"><label class="form-field__label">Роль</label><select id="userRole" class="form-field__select"><option>администратор</option><option>менеджер</option><option>клиент</option></select></div>
                        <div><button id="addUserBtn" class="btn btn--primary">👤 Создать пользователя</button></div>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 16px;">📋 Пользователи</h3>
                <table class="data-table"><thead><tr><th class="data-table__header">ID</th><th class="data-table__header">ФИО</th><th class="data-table__header">Email</th><th class="data-table__header">Роль</th><th class="data-table__header">Действия</th></tr></thead><tbody id="usersTableBody"></tbody></table>
            </div>
        `;
        renderUsersTable();
        document.getElementById('addUserBtn')?.addEventListener('click', addUser);
    }
}

/* ---------------------------------
   Рендеринг таблиц
   --------------------------------- */
function renderDistrictsTable() {
    const tbody = document.getElementById('districtsTableBody');
    if (!tbody) return;
    if (districts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="data-table__empty">Нет районов, создайте первый</td></tr>';
        return;
    }
    tbody.innerHTML = districts.map(d => `
        <tr>
            <td class="data-table__cell">${d.id}</td>
            <td class="data-table__cell">${escapeHtml(d.name)}</td>
            <td class="data-table__cell">${escapeHtml(d.description)}</td>
            <td class="data-table__cell action-buttons">
                <button class="btn btn--small edit-btn" data-id="${d.id}" data-type="district"><i class="fas fa-edit"></i> Ред.</button>
                <button class="btn btn--small btn--danger delete-btn" data-id="${d.id}" data-type="district"><i class="fas fa-trash"></i> Удалить</button>
            </td>
        </tr>
    `).join('');
    attachTableEvents('district');
}

function renderComplexesTable() {
    const tbody = document.getElementById('complexesTableBody');
    if (!tbody) return;
    if (complexes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="data-table__empty">Нет комплексов</td</tr>';
        return;
    }
    tbody.innerHTML = complexes.map(c => {
        const districtName = districts.find(d => d.id === c.districtId)?.name || '—';
        return `<tr>
            <td class="data-table__cell">${c.id}</td>
            <td class="data-table__cell">${escapeHtml(c.name)}</td>
            <td class="data-table__cell">${escapeHtml(districtName)}</td>
            <td class="data-table__cell">${escapeHtml(c.address)}</td>
            <td class="data-table__cell action-buttons">
                <button class="btn btn--small edit-btn" data-id="${c.id}" data-type="complex"><i class="fas fa-edit"></i> Ред.</button>
                <button class="btn btn--small btn--danger delete-btn" data-id="${c.id}" data-type="complex"><i class="fas fa-trash"></i> Удалить</button>
            </td>
        </tr>`;
    }).join('');
    attachTableEvents('complex');
}

function renderApartmentsTable() {
    const tbody = document.getElementById('apartmentsTableBody');
    if (!tbody) return;
    if (apartments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="data-table__empty">Нет квартир</td</tr>';
        return;
    }
    tbody.innerHTML = apartments.map(a => {
        const complexName = complexes.find(c => c.id === a.complexId)?.name || '—';
        return `<tr>
            <td class="data-table__cell">${a.id}</td>
            <td class="data-table__cell">${escapeHtml(complexName)}</td>
            <td class="data-table__cell">${a.rooms}</td>
            <td class="data-table__cell">${a.price.toLocaleString()}₽</td>
            <td class="data-table__cell">${a.area} м²</td>
            <td class="data-table__cell action-buttons">
                <button class="btn btn--small edit-btn" data-id="${a.id}" data-type="apartment"><i class="fas fa-edit"></i> Ред.</button>
                <button class="btn btn--small btn--danger delete-btn" data-id="${a.id}" data-type="apartment"><i class="fas fa-trash"></i> Удалить</button>
            </td>
        </tr>`;
    }).join('');
    attachTableEvents('apartment');
}

function renderRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    if (!tbody) return;
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="data-table__empty">Нет запросов</td</tr>';
        return;
    }
    tbody.innerHTML = requests.map(r => `<tr>
        <td class="data-table__cell">${r.id}</td>
        <td class="data-table__cell">${escapeHtml(r.userName)}</td>
        <td class="data-table__cell">${r.apartmentId}</td>
        <td class="data-table__cell">${escapeHtml(r.message)}</td>
        <td class="data-table__cell">${escapeHtml(r.status)}</td>
        <td class="data-table__cell action-buttons">
            <button class="btn btn--small edit-btn" data-id="${r.id}" data-type="request"><i class="fas fa-edit"></i> Ред.</button>
            <button class="btn btn--small btn--danger delete-btn" data-id="${r.id}" data-type="request"><i class="fas fa-trash"></i> Удалить</button>
        </td>
    </tr>`).join('');
    attachTableEvents('request');
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="data-table__empty">Нет пользователей</td</tr>';
        return;
    }
    tbody.innerHTML = users.map(u => `<tr>
        <td class="data-table__cell">${u.id}</td>
        <td class="data-table__cell">${escapeHtml(u.fullName)}</td>
        <td class="data-table__cell">${escapeHtml(u.email)}</td>
        <td class="data-table__cell">${escapeHtml(u.role)}</td>
        <td class="data-table__cell action-buttons">
            <button class="btn btn--small edit-btn" data-id="${u.id}" data-type="user"><i class="fas fa-edit"></i> Ред.</button>
            <button class="btn btn--small btn--danger delete-btn" data-id="${u.id}" data-type="user"><i class="fas fa-trash"></i> Удалить</button>
        </td>
    </tr>`).join('');
    attachTableEvents('user');
}

/* ---------------------------------
   Привязка событий к таблицам
   --------------------------------- */
function attachTableEvents(type) {
    document.querySelectorAll(`.edit-btn[data-type="${type}"]`).forEach(btn => {
        btn.removeEventListener('click', handleEditClick);
        btn.addEventListener('click', handleEditClick);
    });
    document.querySelectorAll(`.delete-btn[data-type="${type}"]`).forEach(btn => {
        btn.removeEventListener('click', handleDeleteClick);
        btn.addEventListener('click', handleDeleteClick);
    });
}

/* ---------------------------------
   Обработчики редактирования и удаления
   --------------------------------- */
function handleEditClick(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.getAttribute('data-id'));
    const entityType = btn.getAttribute('data-type');
    openEditModal(entityType, id);
}

function handleDeleteClick(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.getAttribute('data-id'));
    const entityType = btn.getAttribute('data-type');
    if (confirm(`Удалить запись #${id}?`)) {
        deleteEntity(entityType, id);
        renderMainPanel();
    }
}

function deleteEntity(type, id) {
    if (type === 'district') districts = districts.filter(d => d.id !== id);
    else if (type === 'complex') complexes = complexes.filter(c => c.id !== id);
    else if (type === 'apartment') apartments = apartments.filter(a => a.id !== id);
    else if (type === 'request') requests = requests.filter(r => r.id !== id);
    else if (type === 'user') users = users.filter(u => u.id !== id);
}

/* ---------------------------------
   CRUD операции (создание)
   --------------------------------- */
function addDistrict() {
    const name = document.getElementById('districtName')?.value?.trim();
    const desc = document.getElementById('districtDesc')?.value?.trim();
    if (name) {
        districts.push({ id: getNextId(), name, description: desc });
        renderMainPanel();
    }
}

function addComplex() {
    const name = document.getElementById('complexName')?.value?.trim();
    const districtId = parseInt(document.getElementById('complexDistrictId')?.value);
    const address = document.getElementById('complexAddress')?.value?.trim();
    if (name) {
        complexes.push({ id: getNextId(), name, districtId, address });
        renderMainPanel();
    }
}

function addApartment() {
    const complexId = parseInt(document.getElementById('aptComplexId')?.value);
    const rooms = parseInt(document.getElementById('aptRooms')?.value);
    const price = parseInt(document.getElementById('aptPrice')?.value);
    const area = parseFloat(document.getElementById('aptArea')?.value);
    if (complexId && rooms) {
        apartments.push({ id: getNextId(), complexId, rooms, price, area });
        renderMainPanel();
    }
}

function addRequest() {
    const name = document.getElementById('reqName')?.value?.trim();
    const aptId = parseInt(document.getElementById('reqApartmentId')?.value);
    const msg = document.getElementById('reqMsg')?.value?.trim();
    const status = document.getElementById('reqStatus')?.value;
    if (name) {
        requests.push({ id: getNextId(), userName: name, apartmentId: aptId, message: msg, status });
        renderMainPanel();
    }
}

function addUser() {
    const full = document.getElementById('userName')?.value?.trim();
    const email = document.getElementById('userEmail')?.value?.trim();
    const role = document.getElementById('userRole')?.value;
    if (full && email) {
        users.push({ id: getNextId(), fullName: full, email, role });
        renderMainPanel();
    }
}

/* ---------------------------------
   Модальное окно редактирования
   --------------------------------- */
function openEditModal(type, id) {
    let entity = null;
    if (type === 'district') entity = districts.find(d => d.id === id);
    else if (type === 'complex') entity = complexes.find(c => c.id === id);
    else if (type === 'apartment') entity = apartments.find(a => a.id === id);
    else if (type === 'request') entity = requests.find(r => r.id === id);
    else if (type === 'user') entity = users.find(u => u.id === id);
    if (!entity) return;

    currentEditType = type;
    currentEditId = id;

    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const fieldsDiv = document.getElementById('modalFormFields');

    const typeNames = { district: 'район', complex: 'комплекс', apartment: 'квартиру', request: 'запрос', user: 'пользователя' };
    title.innerText = `Редактировать ${typeNames[type]}`;

    if (type === 'district') {
        fieldsDiv.innerHTML = `
            <div class="form-field"><label class="form-field__label">Название</label><input id="edit_name" class="form-field__input" value="${escapeHtml(entity.name)}"></div>
            <div class="form-field"><label class="form-field__label">Описание</label><input id="edit_desc" class="form-field__input" value="${escapeHtml(entity.description)}"></div>
        `;
    } else if (type === 'complex') {
        fieldsDiv.innerHTML = `
            <div class="form-field"><label class="form-field__label">Название</label><input id="edit_name" class="form-field__input" value="${escapeHtml(entity.name)}"></div>
            <div class="form-field"><label class="form-field__label">Район</label><select id="edit_districtId" class="form-field__select">${getDistrictOptions(entity.districtId)}</select></div>
            <div class="form-field"><label class="form-field__label">Адрес</label><input id="edit_address" class="form-field__input" value="${escapeHtml(entity.address)}"></div>
        `;
    } else if (type === 'apartment') {
        fieldsDiv.innerHTML = `
            <div class="form-field"><label class="form-field__label">Комплекс</label><select id="edit_complexId" class="form-field__select">${getComplexOptions(entity.complexId)}</select></div>
            <div class="form-field"><label class="form-field__label">Комнат</label><input id="edit_rooms" type="number" class="form-field__input" value="${entity.rooms}"></div>
            <div class="form-field"><label class="form-field__label">Цена</label><input id="edit_price" type="number" class="form-field__input" value="${entity.price}"></div>
            <div class="form-field"><label class="form-field__label">Площадь</label><input id="edit_area" step="any" class="form-field__input" value="${entity.area}"></div>
        `;
    } else if (type === 'request') {
        fieldsDiv.innerHTML = `
            <div class="form-field"><label class="form-field__label">Имя клиента</label><input id="edit_userName" class="form-field__input" value="${escapeHtml(entity.userName)}"></div>
            <div class="form-field"><label class="form-field__label">ID квартиры</label><input id="edit_apartmentId" class="form-field__input" value="${entity.apartmentId}"></div>
            <div class="form-field"><label class="form-field__label">Сообщение</label><input id="edit_message" class="form-field__input" value="${escapeHtml(entity.message)}"></div>
            <div class="form-field"><label class="form-field__label">Статус</label><select id="edit_status" class="form-field__select">
                <option ${entity.status === 'новый' ? 'selected' : ''}>новый</option>
                <option ${entity.status === 'в обработке' ? 'selected' : ''}>в обработке</option>
                <option ${entity.status === 'завершен' ? 'selected' : ''}>завершен</option>
            </select></div>
        `;
    } else if (type === 'user') {
        fieldsDiv.innerHTML = `
            <div class="form-field"><label class="form-field__label">ФИО</label><input id="edit_fullName" class="form-field__input" value="${escapeHtml(entity.fullName)}"></div>
            <div class="form-field"><label class="form-field__label">Email</label><input id="edit_email" class="form-field__input" value="${escapeHtml(entity.email)}"></div>
            <div class="form-field"><label class="form-field__label">Роль</label><input id="edit_role" class="form-field__input" value="${escapeHtml(entity.role)}"></div>
        `;
    }
    modal.style.display = 'flex';
}

/* ---------------------------------
   Сохранение изменений
   --------------------------------- */
function saveEdit() {
    if (!currentEditType || !currentEditId) return;

    if (currentEditType === 'district') {
        const item = districts.find(d => d.id === currentEditId);
        if (item) {
            item.name = document.getElementById('edit_name')?.value?.trim();
            item.description = document.getElementById('edit_desc')?.value?.trim();
        }
    } else if (currentEditType === 'complex') {
        const item = complexes.find(c => c.id === currentEditId);
        if (item) {
            item.name = document.getElementById('edit_name')?.value?.trim();
            item.districtId = parseInt(document.getElementById('edit_districtId')?.value);
            item.address = document.getElementById('edit_address')?.value?.trim();
        }
    } else if (currentEditType === 'apartment') {
        const item = apartments.find(a => a.id === currentEditId);
        if (item) {
            item.complexId = parseInt(document.getElementById('edit_complexId')?.value);
            item.rooms = parseInt(document.getElementById('edit_rooms')?.value);
            item.price = parseInt(document.getElementById('edit_price')?.value);
            item.area = parseFloat(document.getElementById('edit_area')?.value);
        }
    } else if (currentEditType === 'request') {
        const item = requests.find(r => r.id === currentEditId);
        if (item) {
            item.userName = document.getElementById('edit_userName')?.value?.trim();
            item.apartmentId = parseInt(document.getElementById('edit_apartmentId')?.value);
            item.message = document.getElementById('edit_message')?.value?.trim();
            item.status = document.getElementById('edit_status')?.value;
        }
    } else if (currentEditType === 'user') {
        const item = users.find(u => u.id === currentEditId);
        if (item) {
            item.fullName = document.getElementById('edit_fullName')?.value?.trim();
            item.email = document.getElementById('edit_email')?.value?.trim();
            item.role = document.getElementById('edit_role')?.value;
        }
    }
    document.getElementById('editModal').style.display = 'none';
    renderMainPanel();
}

/* ---------------------------------
   Навигация по вкладкам
   --------------------------------- */
function initNavigation() {
    document.querySelectorAll('.sidebar-nav__item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-nav__item').forEach(nav => nav.classList.remove('sidebar-nav__item--active'));
            item.classList.add('sidebar-nav__item--active');
            activeTab = item.getAttribute('data-tab');
            renderMainPanel();
        });
    });
    const firstTab = document.querySelector('.sidebar-nav__item');
    if (firstTab) firstTab.classList.add('sidebar-nav__item--active');
}

/* ---------------------------------
   Авторизация
   --------------------------------- */
const loginOverlay = document.getElementById('loginOverlay');
const adminApp = document.getElementById('adminApp');
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitLoginBtn');
const errorDiv = document.getElementById('loginError');

function handleLogin() {
    if (passwordInput.value === 'test') {
        loginOverlay.style.display = 'none';
        adminApp.classList.remove('admin--hidden');
        initNavigation();
        renderMainPanel();
    } else {
        errorDiv.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
    }
}
submitBtn.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });

/* ---------------------------------
   Управление модальными окнами
   --------------------------------- */
document.getElementById('modalCancelBtn')?.addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});
document.getElementById('modalSaveBtn')?.addEventListener('click', saveEdit);
window.onclick = e => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) modal.style.display = 'none';
};
