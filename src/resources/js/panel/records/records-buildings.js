export async function initRecordsBuildings(token) {
    const container = document.getElementById('recordsBuildings');
    if (!container) return;

    container.innerHTML = '';

    // ---- Форма для добавления/редактирования новостройки ----
    const formCard = document.createElement('div');
    formCard.className = 'records-form';
    formCard.innerHTML = `
        <h3>Добавить / редактировать новостройку (ЖК)</h3>
        <button type="button" class="toggle-form-btn" id="toggleBuildingsForm">−</button>
        <form id="buildingForm" class="record-form">
            <input type="hidden" id="buildingId" value="">
            <div class="form-group">
                <label for="district_id">Район *</label>
                <select id="district_id" required>
                    <option value="">Выберите район</option>
                </select>
            </div>
            <div class="form-group">
                <label for="name">Название ЖК *</label>
                <input type="text" id="name" required autocomplete="off">
            </div>
            <div class="form-group">
                <label for="address">Адрес *</label>
                <input type="text" id="address" required autocomplete="off">
            </div>
            <div class="form-group">
                <label for="completion_date">Год сдачи</label>
                <input type="text" id="completion_date" placeholder="например, 2025">
            </div>
            <div class="form-group">
                <label for="advantages">Преимущества</label>
                <textarea id="advantages" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="image">Изображение (jpg, png, до 2МБ)</label>
                <input type="file" id="image" accept="image/*">
            </div>
            <div class="form-group">
                <label for="developer_pdf">PDF от застройщика (до 5МБ)</label>
                <input type="file" id="developer_pdf" accept=".pdf">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-save btn-save--create" id="submitBuildingBtn">➕ Создать ЖК</button>
                <button type="button" class="btn-cancel" id="cancelBuildingBtn">Отменить</button>
            </div>
        </form>
    `;

    // Контейнер для списка новостроек (используем общий класс records-list)
    const listContainer = document.createElement('div');
    listContainer.className = 'records-list';
    listContainer.innerHTML = '<div class="loading">Загрузка новостроек...</div>';

    container.appendChild(formCard);
    container.appendChild(listContainer);

    // ---- Локальные ссылки на элементы (уникальные id) ----
    const form = formCard.querySelector('#buildingForm');
    const toggleBtn = formCard.querySelector('#toggleBuildingsForm');
    const submitBtn = formCard.querySelector('#submitBuildingBtn');
    const cancelBtn = formCard.querySelector('#cancelBuildingBtn');
    const buildingIdInput = formCard.querySelector('#buildingId');
    const districtSelect = formCard.querySelector('#district_id');
    const nameInput = formCard.querySelector('#name');
    const addressInput = formCard.querySelector('#address');
    const completionDateInput = formCard.querySelector('#completion_date');
    const advantagesInput = formCard.querySelector('#advantages');
    const imageInput = formCard.querySelector('#image');
    const pdfInput = formCard.querySelector('#developer_pdf');

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
            submitBtn.textContent = '➕ Создать ЖК';
        }
    }

    function resetForm() {
        buildingIdInput.value = '';
        districtSelect.value = '';
        nameInput.value = '';
        addressInput.value = '';
        completionDateInput.value = '';
        advantagesInput.value = '';
        imageInput.value = '';
        pdfInput.value = '';
        highlightForm(false);
    }

    // ---- Загрузка районов для select ----
    async function loadDistricts() {
        try {
            const response = await fetch('/api/districts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const districts = await response.json();
                districtSelect.innerHTML = '<option value="">Выберите район</option>';
                districts.forEach(d => {
                    const option = document.createElement('option');
                    option.value = d.id;
                    option.textContent = `${d.name} (slug: ${d.slug})`;
                    option.dataset.slug = d.slug;
                    districtSelect.appendChild(option);
                });
                return districts;
            }
            return [];
        } catch (err) {
            console.error('Ошибка загрузки районов:', err);
            return [];
        }
    }

    // ---- Загрузка списка новостроек ----
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
                renderBuildings(buildings);
            } else {
                throw new Error('Ошибка загрузки');
            }
        } catch (err) {
            console.error(err);
            listContainer.innerHTML = '<div class="error">Не удалось загрузить новостройки</div>';
        }
    }

    function renderBuildings(buildings) {
        if (!buildings.length) {
            listContainer.innerHTML = '<div class="empty">Нет новостроек. Создайте первую.</div>';
            return;
        }

        const cardsHtml = buildings.map(building => `
            <div class="record-card" data-id="${building.id}">
                <div class="record-card__image">
                    ${building.image && building.image !== 'default.png'
                        ? `<img src="/storage/${building.image}" alt="${escapeHtml(building.name)}">`
                        : '<div class="no-image">Нет фото</div>'}
                </div>
                <div class="record-card__content">
                    <h4>${escapeHtml(building.name)}</h4>
                    <div class="record-card__address">📍 ${escapeHtml(building.address)}</div>
                    <div class="record-card__district">🏘️ Район: ${escapeHtml(building.district?.name || '—')}</div>
                    ${building.completion_date ? `<div class="record-card__completion">📅 Сдача: ${escapeHtml(building.completion_date)}</div>` : ''}
                    <div class="record-card__advantages">⭐ ${escapeHtml(building.advantages || '—')}</div>
                    ${building.developer_pdf ? `<div class="record-card__pdf"><a href="/storage/${building.developer_pdf}" target="_blank">📄 PDF застройщика</a></div>` : ''}
                </div>
                <div class="record-card__actions">
                    <button class="btn-edit" 
                        data-id="${building.id}"
                        data-district-id="${building.district_id}"
                        data-name="${escapeHtml(building.name)}"
                        data-address="${escapeHtml(building.address)}"
                        data-completion-date="${escapeHtml(building.completion_date || '')}"
                        data-advantages="${escapeHtml(building.advantages || '')}">
                        ✏️ Редактировать
                    </button>
                    <button class="btn-delete" data-id="${building.id}">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = cardsHtml;

        // Обработчики редактирования
        listContainer.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                fillFormForEdit(
                    btn.dataset.id,
                    btn.dataset.districtId,
                    btn.dataset.name,
                    btn.dataset.address,
                    btn.dataset.completionDate,
                    btn.dataset.advantages
                );
            });
        });
        // Обработчики удаления
        listContainer.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteBuilding(btn.dataset.id));
        });
    }

    function fillFormForEdit(id, districtId, name, address, completionDate, advantages) {
        buildingIdInput.value = id;
        districtSelect.value = districtId;
        nameInput.value = name;
        addressInput.value = address;
        completionDateInput.value = completionDate || '';
        advantagesInput.value = advantages || '';
        imageInput.value = '';
        pdfInput.value = '';
        highlightForm(true);
        nameInput.focus();
        if (!formVisible) toggleForm();
    }

    // ---- Создание / обновление (с _method=PUT) ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = buildingIdInput.value;
        const districtId = districtSelect.value;
        const name = nameInput.value.trim();
        const address = addressInput.value.trim();
        const completion_date = completionDateInput.value.trim();   // может быть пустой строкой
        const advantages = advantagesInput.value.trim();           // может быть пустой строкой
        const imageFile = imageInput.files[0];
        const pdfFile = pdfInput.files[0];

        // Валидация
        if (!districtId) {
            showNotification('Выберите район', 'error');
            return;
        }
        if (!name) {
            showNotification('Введите название ЖК', 'error');
            return;
        }
        if (!address) {
            showNotification('Введите адрес', 'error');
            return;
        }

        // Получаем slug района для создания
        const selectedOption = districtSelect.options[districtSelect.selectedIndex];
        const districtSlug = selectedOption?.dataset?.slug;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('address', address);
        // Всегда передаём completion_date и advantages (даже пустые строки)
        formData.append('completion_date', completion_date);
        formData.append('advantages', advantages);
        if (imageFile) formData.append('image', imageFile);
        if (pdfFile) formData.append('developer_pdf', pdfFile);

        let url, method, actionType;

        if (id) {
            // Обновление
            formData.append('_method', 'PUT');
            formData.append('district_id', districtId);
            url = `/api/new-buildings/${id}`;
            method = 'POST';
            actionType = 'update';
        } else {
            // Создание
            if (!districtSlug) {
                showNotification('Ошибка: не удалось определить slug района', 'error');
                return;
            }
            url = `/api/districts/${districtSlug}/new-buildings`;
            method = 'POST';
            actionType = 'create';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            // Подробный лог ошибки для отладки
            if (!response.ok) {
                let errorText = '';
                try {
                    const errorData = await response.json();
                    errorText = errorData.message || JSON.stringify(errorData);
                } catch (e) {
                    errorText = await response.text();
                }
                console.error('Ошибка ответа сервера:', response.status, errorText);
                throw new Error(`Ошибка ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Успешно:', result);

            resetForm();
            await loadBuildings();
            showNotification(actionType === 'create' ? `ЖК "${name}" создан` : `ЖК "${name}" обновлён`, 'success');

        } catch (err) {
            console.error('Ошибка сохранения:', err);
            showNotification(err.message, 'error');
        }
    });

    // ---- Удаление ----
    async function deleteBuilding(id) {
        if (!confirm('Удалить новостройку? Это действие нельзя отменить.')) return;
        try {
            const response = await fetch(`/api/new-buildings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                let errorMsg = 'Ошибка удаления';
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            await loadBuildings();
            showNotification('Новостройка удалена', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        }
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

    // Инициализация
    resetForm();
    await loadDistricts();
    await loadBuildings();
}
