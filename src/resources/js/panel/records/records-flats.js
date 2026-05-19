export async function initRecordsFlats(token) {
    const container = document.getElementById('recordsFlats');
    if (!container) return;

    container.innerHTML = '';

    // ---- Форма для добавления/редактирования квартиры ----
    const formCard = document.createElement('div');
    formCard.className = 'records-form';
    formCard.innerHTML = `
        <h3>Добавить / редактировать квартиру</h3>
        <button type="button" class="toggle-form-btn" id="toggleFlatsForm">−</button>
        <form id="flatForm" class="record-form">
            <input type="hidden" id="flatId" value="">
            <div class="form-group">
                <label for="new_building_id">Новостройка *</label>
                <select id="new_building_id" required>
                    <option value="">Выберите новостройку</option>
                </select>
            </div>
            <div class="form-group">
                <label for="apartment_type_id">Тип квартиры *</label>
                <select id="apartment_type_id" required disabled>
                    <option value="">Сначала выберите новостройку</option>
                </select>
            </div>
            <div class="form-group">
                <label for="floor">Этаж *</label>
                <input type="number" id="floor" required min="1">
            </div>
            <div class="form-group">
                <label for="entrance">Подъезд *</label>
                <input type="number" id="entrance" required min="1">
            </div>
            <div class="form-group">
                <label for="number">Номер квартиры *</label>
                <input type="text" id="number" required autocomplete="off">
            </div>
            <div class="form-group">
                <label for="price">Цена (₽) – опционально</label>
                <input type="number" id="price" placeholder="Оставьте пустым для базовой цены типа">
            </div>
            <div class="form-group">
                <label for="status">Статус *</label>
                <select id="status" required>
                    <option value="available">Доступна</option>
                    <option value="reserved">Забронирована</option>
                    <option value="sold">Продана</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-save btn-save--create" id="submitFlatBtn">➕ Создать квартиру</button>
                <button type="button" class="btn-cancel" id="cancelFlatBtn">Отменить</button>
            </div>
        </form>
    `;

    // Контейнер для списка квартир (группировка по новостройкам и типам)
    const listContainer = document.createElement('div');
    listContainer.className = 'flats-list';
    listContainer.innerHTML = '<div class="loading">Загрузка квартир...</div>';

    container.appendChild(formCard);
    container.appendChild(listContainer);

    // ---- Локальные ссылки на элементы ----
    const form = formCard.querySelector('#flatForm');
    const toggleBtn = formCard.querySelector('#toggleFlatsForm');
    const submitBtn = formCard.querySelector('#submitFlatBtn');
    const cancelBtn = formCard.querySelector('#cancelFlatBtn');
    const flatIdInput = formCard.querySelector('#flatId');
    const newBuildingSelect = formCard.querySelector('#new_building_id');
    const apartmentTypeSelect = formCard.querySelector('#apartment_type_id');
    const floorInput = formCard.querySelector('#floor');
    const entranceInput = formCard.querySelector('#entrance');
    const numberInput = formCard.querySelector('#number');
    const priceInput = formCard.querySelector('#price');
    const statusSelect = formCard.querySelector('#status');

    let formVisible = true;

    // Сворачивание формы
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

    // Отмена редактирования / сброс формы
    cancelBtn.addEventListener('click', resetForm);

    // ---- Утилиты ----
    function showNotification(message, type = 'success') {
        const notif = document.createElement('div');
        notif.className = `admin-notification admin-notification--${type}`;
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
            form.style.transition = 'background-color 0.2s';
            submitBtn.classList.remove('btn-save--create');
            submitBtn.classList.add('btn-save--edit');
            submitBtn.textContent = '✏️ Сохранить изменения';
        } else {
            form.style.backgroundColor = '';
            submitBtn.classList.remove('btn-save--edit');
            submitBtn.classList.add('btn-save--create');
            submitBtn.textContent = '➕ Создать квартиру';
        }
    }

    function resetForm() {
        flatIdInput.value = '';
        newBuildingSelect.value = '';
        apartmentTypeSelect.innerHTML = '<option value="">Сначала выберите новостройку</option>';
        apartmentTypeSelect.disabled = true;
        floorInput.value = '';
        entranceInput.value = '';
        numberInput.value = '';
        priceInput.value = '';
        statusSelect.value = 'available';
        highlightForm(false);
    }

    // ---- Загрузка новостроек для выбора ----
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
                newBuildingSelect.innerHTML = '<option value="">Выберите новостройку</option>';
                buildings.forEach(b => {
                    const option = document.createElement('option');
                    option.value = b.id;
                    option.textContent = `${b.name} (${b.address})`;
                    option.dataset.slug = b.slug;
                    newBuildingSelect.appendChild(option);
                });
                return buildings;
            }
            return [];
        } catch (err) {
            console.error('Ошибка загрузки новостроек:', err);
            return [];
        }
    }

    // Загрузка типов квартир по выбранной новостройке
    async function loadApartmentTypes(buildingId) {
        if (!buildingId) {
            apartmentTypeSelect.innerHTML = '<option value="">Сначала выберите новостройку</option>';
            apartmentTypeSelect.disabled = true;
            return;
        }
        try {
            const response = await fetch(`/api/buildings/${buildingId}/apartment-types`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const types = await response.json();
                apartmentTypeSelect.innerHTML = '<option value="">Выберите тип квартиры</option>';
                types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.id;
                    const roomsText = getRoomsText(type.rooms);
                    option.textContent = `${roomsText} • ${type.area} м² • от ${formatPriceShort(type.base_price)}`;
                    option.dataset.area = type.area;
                    option.dataset.rooms = type.rooms;
                    option.dataset.basePrice = type.base_price;
                    apartmentTypeSelect.appendChild(option);
                });
                apartmentTypeSelect.disabled = false;
            } else {
                throw new Error('Ошибка загрузки типов');
            }
        } catch (err) {
            console.error(err);
            apartmentTypeSelect.innerHTML = '<option value="">Ошибка загрузки типов</option>';
            apartmentTypeSelect.disabled = true;
        }
    }

    // ---- Вспомогательная функция задержки ----
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ---- Загрузка всех квартир с ограничением частоты запросов ----
    async function loadAllFlats() {
        try {
            // Загружаем новостройки (не дублируем вызов loadBuildings, он уже есть)
            const buildings = await loadBuildings();
            if (!buildings.length) {
                listContainer.innerHTML = '<div class="empty">Нет новостроек. Сначала создайте новостройку.</div>';
                return;
            }

            let allGroupsHtml = '';
            // Используем обычный цикл с задержкой, чтобы не перегружать сервер
            for (let i = 0; i < buildings.length; i++) {
                const building = buildings[i];
                
                // Задержка между запросами разных новостроек
                if (i > 0) await delay(300); // 300 мс между новостройками

                const typesResponse = await fetch(`/api/buildings/${building.id}/apartment-types`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                let types = [];
                if (typesResponse.ok) {
                    types = await typesResponse.json();
                } else {
                    console.warn(`Ошибка загрузки типов для ${building.name}`);
                }

                if (types.length === 0) {
                    allGroupsHtml += `
                        <div class="building-group" data-building-id="${building.id}">
                            <div class="building-group__header">
                                <div class="building-group__info">
                                    <h4 class="building-group__title">${escapeHtml(building.name)}</h4>
                                    <p class="building-group__address">${escapeHtml(building.address)}</p>
                                </div>
                                <button class="building-group__toggle">▼</button>
                            </div>
                            <div class="building-group__content">
                                <div class="empty-types">Нет типов квартир для этой новостройки</div>
                            </div>
                        </div>
                    `;
                    continue;
                }

                let typesHtml = '';
                for (let j = 0; j < types.length; j++) {
                    const type = types[j];
                    
                    // Задержка между запросами разных типов
                    if (j > 0) await delay(200);
                    
                    const flatsResponse = await fetch(`/api/apartment-types/${type.id}/apartments`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });
                    let flats = [];
                    if (flatsResponse.ok) {
                        const flatsData = await flatsResponse.json();
                        flats = flatsData.data || [];
                    } else {
                        console.warn(`Ошибка загрузки квартир для типа ${type.id}`);
                    }
                    typesHtml += renderApartmentTypeGroup(building, type, flats);
                }

                allGroupsHtml += `
                    <div class="building-group" data-building-id="${building.id}">
                        <div class="building-group__header">
                            <div class="building-group__info">
                                <h4 class="building-group__title">${escapeHtml(building.name)}</h4>
                                <p class="building-group__address">${escapeHtml(building.address)}</p>
                            </div>
                            <button class="building-group__toggle">▼</button>
                        </div>
                        <div class="building-group__content">
                            ${typesHtml}
                        </div>
                    </div>
                `;
            }
            listContainer.innerHTML = allGroupsHtml;

            // Аккордеон для новостроек
            listContainer.querySelectorAll('.building-group__toggle').forEach(btn => {
                btn.removeEventListener('click', toggleBuildingHandler);
                btn.addEventListener('click', toggleBuildingHandler);
            });
            function toggleBuildingHandler(e) {
                const group = e.currentTarget.closest('.building-group');
                group.classList.toggle('building-group--open');
                e.currentTarget.textContent = group.classList.contains('building-group--open') ? '▲' : '▼';
            }

            // Аккордеон для типов квартир (внутри каждой новостройки)
            listContainer.querySelectorAll('.apartment-type-group__toggle').forEach(btn => {
                btn.removeEventListener('click', toggleTypeHandler);
                btn.addEventListener('click', toggleTypeHandler);
            });
            function toggleTypeHandler(e) {
                e.stopPropagation();
                const typeGroup = e.currentTarget.closest('.apartment-type-group');
                typeGroup.classList.toggle('apartment-type-group--open');
                e.currentTarget.textContent = typeGroup.classList.contains('apartment-type-group--open') ? '▲' : '▼';
            }

            // Кнопки редактирования квартир
            listContainer.querySelectorAll('.flat-edit').forEach(btn => {
                btn.removeEventListener('click', editFlatHandler);
                btn.addEventListener('click', editFlatHandler);
            });
            // Кнопки удаления квартир
            listContainer.querySelectorAll('.flat-delete').forEach(btn => {
                btn.removeEventListener('click', deleteFlatHandler);
                btn.addEventListener('click', deleteFlatHandler);
            });
        } catch (err) {
            console.error('Ошибка загрузки квартир:', err);
            listContainer.innerHTML = '<div class="error">Не удалось загрузить данные</div>';
        }
    }

    function renderApartmentTypeGroup(building, type, flats) {
        const hasFlats = flats && flats.length;
        const toggleIcon = hasFlats ? '▼' : '';
        return `
            <div class="apartment-type-group" data-type-id="${type.id}" data-building-id="${building.id}">
                <div class="apartment-type-group__header">
                    <div class="apartment-type-group__info">
                        <h5 class="apartment-type-group__title">
                            ${getRoomsText(type.rooms)} • ${type.area} м² • от ${formatPriceShort(type.base_price)}
                        </h5>
                        <p class="apartment-type-group__count">${flats.length} квартир</p>
                    </div>
                    <button class="apartment-type-group__toggle">${toggleIcon}</button>
                </div>
                <div class="apartment-type-group__content">
                    ${hasFlats ? `
                        <div class="flats-grid">
                            ${flats.map(flat => `
                                <div class="flat-card" data-id="${flat.id}">
                                    <div class="flat-card__content">
                                        <div class="flat-card__title">
                                            Кв. ${escapeHtml(flat.number)}
                                        </div>
                                        <div class="flat-card__details">
                                            <span><i class="fas fa-layer-group"></i> Этаж: ${flat.floor}</span>
                                            <span><i class="fas fa-door-open"></i> Подъезд: ${flat.entrance}</span>
                                        </div>
                                        <div class="flat-card__price">
                                            ${formatPrice(flat.price)}
                                        </div>
                                        <div class="flat-card__status status-${flat.status}">
                                            ${getStatusText(flat.status)}
                                        </div>
                                    </div>
                                    <div class="flat-card__actions">
                                        <button class="flat-edit" 
                                            data-id="${flat.id}"
                                            data-building-id="${building.id}"
                                            data-type-id="${type.id}"
                                            data-floor="${flat.floor}"
                                            data-entrance="${flat.entrance}"
                                            data-number="${escapeHtml(flat.number)}"
                                            data-price="${flat.price}"
                                            data-status="${flat.status}">
                                            ✏️ Редактировать
                                        </button>
                                        <button class="flat-delete" data-id="${flat.id}">
                                            🗑️ Удалить
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="empty-flats">Нет квартир в этом типе</div>'}
                </div>
            </div>
        `;
    }

    function editFlatHandler(e) {
        const btn = e.currentTarget;
        fillFormForEdit(
            btn.dataset.id,
            btn.dataset.buildingId,
            btn.dataset.typeId,
            btn.dataset.floor,
            btn.dataset.entrance,
            btn.dataset.number,
            btn.dataset.price,
            btn.dataset.status
        );
    }

    function deleteFlatHandler(e) {
        deleteFlat(e.currentTarget.dataset.id);
    }

    function fillFormForEdit(id, buildingId, typeId, floor, entrance, number, price, status) {
        flatIdInput.value = id;
        newBuildingSelect.value = buildingId;
        // загружаем типы для выбранной новостройки и устанавливаем выбранный тип
        loadApartmentTypes(buildingId).then(() => {
            apartmentTypeSelect.value = typeId;
        });
        floorInput.value = floor;
        entranceInput.value = entrance;
        numberInput.value = number;
        priceInput.value = price || '';
        statusSelect.value = status;
        highlightForm(true);
        if (!formVisible) toggleForm();
    }

    // ---- Создание / обновление квартиры ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = flatIdInput.value;
        const apartment_type_id = apartmentTypeSelect.value;
        const floor = floorInput.value;
        const entrance = entranceInput.value;
        const number = numberInput.value.trim();
        const price = priceInput.value ? parseInt(priceInput.value) : null;
        const status = statusSelect.value;

        if (!apartment_type_id) {
            showNotification('Выберите тип квартиры', 'error');
            return;
        }
        if (!floor || !entrance || !number) {
            showNotification('Заполните все обязательные поля (этаж, подъезд, номер)', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('apartment_type_id', apartment_type_id);
        formData.append('floor', floor);
        formData.append('entrance', entrance);
        formData.append('number', number);
        if (price !== null) formData.append('price', price);
        formData.append('status', status);

        let url = '/api/apartments';
        let method = 'POST';
        let actionType = 'create';

        if (id) {
            formData.append('_method', 'PUT');
            url = `/api/apartments/${id}`;
            method = 'POST';
            actionType = 'update';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                resetForm();
                await loadAllFlats();
                showNotification(actionType === 'create' ? 'Квартира создана' : 'Квартира обновлена', 'success');
            } else {
                let errorMsg = 'Ошибка сохранения';
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || JSON.stringify(errData);
                } catch (e) {}
                throw new Error(errorMsg);
            }
        } catch (err) {
            showNotification(err.message, 'error');
        }
    });

    // ---- Удаление квартиры ----
    async function deleteFlat(id) {
        if (!confirm('Удалить квартиру? Это действие нельзя отменить.')) return;
        try {
            const response = await fetch(`/api/apartments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                await loadAllFlats();
                showNotification('Квартира удалена', 'success');
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

    function formatPriceShort(price) {
        if (!price) return '0 ₽';
        return Number(price).toLocaleString('ru-RU') + ' ₽';
    }

    function getStatusText(status) {
        const map = {
            'available': 'Доступна',
            'reserved': 'Забронирована',
            'sold': 'Продана'
        };
        return map[status] || status;
    }

    // Событие при смене новостройки в форме
    newBuildingSelect.addEventListener('change', (e) => {
        const buildingId = e.target.value;
        loadApartmentTypes(buildingId);
    });

    // Инициализация
    resetForm();
    await loadAllFlats();
}
