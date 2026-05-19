export async function initRecordsTypes(token) {
    const container = document.getElementById('recordsTypes');
    if (!container) return;

    container.innerHTML = '';

    // ---- Создание формы с уникальными id ----
    const formCard = document.createElement('div');
    formCard.className = 'records-form';
    formCard.innerHTML = `
        <h3>Добавить / редактировать тип квартиры</h3>
        <button type="button" class="toggle-form-btn" id="toggleTypesForm">−</button>
        <form id="apartmentTypeForm" class="record-form">
            <input type="hidden" id="typeId" value="">
            <div class="form-group">
                <label for="building_id">Новостройка *</label>
                <select id="building_id" required>
                    <option value="">Выберите новостройку</option>
                </select>
            </div>
            <div class="form-group">
                <label for="area">Площадь (м²) *</label>
                <input type="number" id="area" step="0.1" required>
            </div>
            <div class="form-group">
                <label for="rooms">Количество комнат *</label>
                <select id="rooms" required>
                    <option value="1">1-комнатная</option>
                    <option value="2">2-комнатная</option>
                    <option value="3">3-комнатная</option>
                    <option value="4">4-комнатная</option>
                </select>
            </div>
            <div class="form-group">
                <label for="base_price">Базовая цена (₽) *</label>
                <input type="number" id="base_price" required>
            </div>
            <div class="form-group">
                <label for="layout_image">Изображение планировки</label>
                <input type="file" id="layout_image" accept="image/*">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-save btn-save--create" id="submitTypeBtn">➕ Создать тип</button>
                <button type="button" class="btn-cancel" id="cancelTypeBtn">Отменить</button>
            </div>
        </form>
    `;

    // Контейнер для списка
    const listWrapper = document.createElement('div');
    listWrapper.className = 'apartment-types-wrapper';
    listWrapper.innerHTML = `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
            <button id="refreshTypesBtn" class="btn-refresh" style="padding: 6px 12px; background: #144d5e; color: white; border: none; border-radius: 8px; cursor: pointer;">
                🔄 Обновить список
            </button>
        </div>
        <div id="apartmentTypesList" class="apartment-types-list">
            <div class="loading">Загрузка типов квартир...</div>
        </div>
    `;

    container.appendChild(formCard);
    container.appendChild(listWrapper);

    // ---- Локальные ссылки на элементы (уникальные id) ----
    const form = formCard.querySelector('#apartmentTypeForm');
    const toggleBtn = formCard.querySelector('#toggleTypesForm');
    const submitBtn = formCard.querySelector('#submitTypeBtn');
    const cancelBtn = formCard.querySelector('#cancelTypeBtn');
    const typeIdInput = formCard.querySelector('#typeId');
    const buildingSelect = formCard.querySelector('#building_id');
    const areaInput = formCard.querySelector('#area');
    const roomsSelect = formCard.querySelector('#rooms');
    const priceInput = formCard.querySelector('#base_price');
    const layoutImageInput = formCard.querySelector('#layout_image');

    const listContainer = listWrapper.querySelector('#apartmentTypesList');
    const refreshBtn = listWrapper.querySelector('#refreshTypesBtn');

    let formVisible = true;

    // Сворачивание
    const toggleForm = () => {
        formVisible = !formVisible;
        if (formVisible) {
            form.classList.remove('form-hidden');
            toggleBtn.textContent = '−';
        } else {
            form.classList.add('form-hidden');
            toggleBtn.textContent = '+';
        }
    };
    toggleBtn.addEventListener('click', toggleForm);

    // ---- Утилиты ----
    function showNotification(message, type = 'success') {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#ff9800'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    function highlightForm(isEditMode) {
        if (isEditMode) {
            form.style.backgroundColor = '#fff9c4';
            submitBtn.classList.remove('btn-save--create');
            submitBtn.classList.add('btn-save--edit');
            submitBtn.textContent = '✏️ Сохранить изменения';
        } else {
            form.style.backgroundColor = '';
            submitBtn.classList.remove('btn-save--edit');
            submitBtn.classList.add('btn-save--create');
            submitBtn.textContent = '➕ Создать тип';
        }
    }

    function resetForm() {
        typeIdInput.value = '';
        buildingSelect.value = '';
        areaInput.value = '';
        roomsSelect.value = '1';
        priceInput.value = '';
        layoutImageInput.value = '';
        highlightForm(false);
    }

    // ---- Загрузка новостроек ----
    async function loadBuildings() {
        try {
            const response = await fetch('/api/new-buildings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                const buildings = data.data || [];
                buildingSelect.innerHTML = '<option value="">Выберите новостройку</option>';
                buildings.forEach(b => {
                    const option = document.createElement('option');
                    option.value = b.id;
                    option.textContent = `${b.name} (${b.address})`;
                    buildingSelect.appendChild(option);
                });
                return buildings;
            }
            return [];
        } catch (err) {
            console.error('Ошибка загрузки новостроек:', err);
            return [];
        }
    }

    // ---- Загрузка всех типов квартир (без лишнего вызова loadBuildings перед ней) ----
    async function loadAllApartmentTypes() {
        try {
            const buildings = await loadBuildings();   // ← единственный вызов
            if (!buildings.length) {
                listContainer.innerHTML = '<div class="empty">Нет новостроек. Сначала создайте новостройку.</div>';
                return;
            }

            let allGroupsHtml = '';
            for (const building of buildings) {
                const typesResponse = await fetch(`/api/buildings/${building.id}/apartment-types`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                let types = [];
                if (typesResponse.ok) {
                    types = await typesResponse.json();
                }
                allGroupsHtml += renderBuildingGroup(building, types);
            }
            listContainer.innerHTML = allGroupsHtml;

            // Аккордеон
            listContainer.querySelectorAll('.building-group__toggle').forEach(btn => {
                btn.removeEventListener('click', toggleGroupHandler);
                btn.addEventListener('click', toggleGroupHandler);
            });
            function toggleGroupHandler(e) {
                const group = e.currentTarget.closest('.building-group');
                group.classList.toggle('building-group--open');
                e.currentTarget.textContent = group.classList.contains('building-group--open') ? '▲' : '▼';
            }

            // Кнопки редактирования/удаления
            listContainer.querySelectorAll('.type-edit').forEach(btn => {
                btn.removeEventListener('click', editHandler);
                btn.addEventListener('click', editHandler);
            });
            listContainer.querySelectorAll('.type-delete').forEach(btn => {
                btn.removeEventListener('click', deleteHandler);
                btn.addEventListener('click', deleteHandler);
            });
        } catch (err) {
            console.error(err);
            listContainer.innerHTML = '<div class="error">Не удалось загрузить данные</div>';
        }
    }

    function editHandler(e) {
        const btn = e.currentTarget;
        fillFormForEdit(
            btn.dataset.id,
            btn.dataset.buildingId,
            btn.dataset.area,
            btn.dataset.rooms,
            btn.dataset.price
        );
    }

    function deleteHandler(e) {
        deleteApartmentType(e.currentTarget.dataset.id);
    }

    function renderBuildingGroup(building, types) {
        const hasTypes = types && types.length;
        const toggleIcon = hasTypes ? '▼' : '';
        return `
            <div class="building-group" data-building-id="${building.id}">
                <div class="building-group__header">
                    <div class="building-group__info">
                        <h4 class="building-group__title">${escapeHtml(building.name)}</h4>
                        <p class="building-group__address">${escapeHtml(building.address)}</p>
                    </div>
                    <span class="building-group__count">${types.length} типов</span>
                    <button class="building-group__toggle">${toggleIcon}</button>
                </div>
                <div class="building-group__content">
                    ${hasTypes ? `
                        <div class="apartment-types-grid">
                            ${types.map(type => `
                                <div class="apartment-type-card">
                                    ${type.layout_image ? `
                                        <div class="apartment-type-card__image">
                                            <img src="/storage/${type.layout_image}" alt="Планировка">
                                        </div>
                                    ` : `
                                        <div class="apartment-type-card__image no-image">
                                            <i class="fas fa-building"></i>
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
                                        <div class="apartment-type-card__availability">
                                            <i class="fas fa-check-circle"></i> Доступно: ${type.available_count || 0} шт.
                                        </div>
                                    </div>
                                    <div class="apartment-type-card__actions">
                                        <button class="type-edit" 
                                            data-id="${type.id}"
                                            data-building-id="${type.building_id}"
                                            data-area="${type.area}"
                                            data-rooms="${type.rooms}"
                                            data-price="${type.base_price}">
                                            ✏️ Редактировать
                                        </button>
                                        <button class="type-delete" data-id="${type.id}">
                                            🗑️ Удалить
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="empty-types">Нет типов квартир для этой новостройки</div>'}
                </div>
            </div>
        `;
    }

    function fillFormForEdit(id, buildingId, area, rooms, price) {
        typeIdInput.value = id;
        buildingSelect.value = buildingId;
        areaInput.value = area;
        roomsSelect.value = rooms;
        priceInput.value = price;
        layoutImageInput.value = '';
        highlightForm(true);
        buildingSelect.focus();
        if (!formVisible) toggleForm();
    }

    // ---- Создание / обновление (с _method=PUT) ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = typeIdInput.value;
        const building_id = buildingSelect.value;
        const area = areaInput.value;
        const rooms = roomsSelect.value;
        const base_price = priceInput.value;
        const layout_image = layoutImageInput.files[0];

        if (!building_id || !area || !rooms || !base_price) {
            showNotification('Заполните все обязательные поля', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('building_id', building_id);
        formData.append('area', area);
        formData.append('rooms', rooms);
        formData.append('base_price', base_price);
        if (layout_image) formData.append('layout_image', layout_image);

        let url = '/api/apartment-types';
        let method = 'POST';
        let actionType = 'create';

        if (id) {
            formData.append('_method', 'PUT');   // ← ключевое исправление
            url = `/api/apartment-types/${id}`;
            method = 'POST';                     // ← метод POST
            actionType = 'update';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                resetForm();
                await loadAllApartmentTypes();
                showNotification(actionType === 'create' ? 'Тип квартиры создан' : 'Тип квартиры обновлён', 'success');
            } else {
                let errorMsg = 'Ошибка сохранения';
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
        } catch (err) {
            showNotification(err.message, 'error');
        }
    });

    // ---- Удаление ----
    async function deleteApartmentType(id) {
        if (!confirm('Удалить тип квартиры? Это действие нельзя отменить.')) return;
        try {
            const response = await fetch(`/api/apartment-types/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                await loadAllApartmentTypes();
                showNotification('Тип квартиры удалён', 'success');
            } else {
                let errorMsg = 'Ошибка удаления';
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }

    // ---- Вспомогательные функции ----
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function getRoomsText(rooms) {
        const map = { 1: '1-комнатная', 2: '2-комнатная', 3: '3-комнатная', 4: '4-комнатная' };
        return map[rooms] || `${rooms}-комнатная`;
    }

    function formatPrice(price) {
        if (!price) return '0 ₽';
        return Number(price).toLocaleString('ru-RU') + ' ₽';
    }

    // Кнопка обновления
    refreshBtn.addEventListener('click', async () => {
        listContainer.innerHTML = '<div class="loading">Обновление...</div>';
        await loadAllApartmentTypes();
        showNotification('Список обновлён', 'success');
    });

    cancelBtn.addEventListener('click', resetForm);
    resetForm();
    // Удалён лишний вызов await loadBuildings();
    await loadAllApartmentTypes();
}
