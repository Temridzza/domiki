export async function initRecordsDistricts(token) {
    const container = document.getElementById('recordsDistricts');
    if (!container) return;

    container.innerHTML = '';

    // ---- Создание элементов с уникальными id ----
    const formCard = document.createElement('div');
    formCard.className = 'records-form';
    formCard.innerHTML = `
        <h3>Добавить / редактировать район</h3>
        <button type="button" class="toggle-form-btn" id="toggleDistrictsForm">−</button>
        <form id="districtForm" class="record-form">
            <input type="hidden" id="districtId" value="">
            <div class="form-group">
                <label for="name">Название *</label>
                <input type="text" id="name" required autocomplete="off">
            </div>
            <div class="form-group">
                <label for="description">Описание</label>
                <textarea id="description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="advantages">Преимущества</label>
                <textarea id="advantages" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="image">Изображение (jpg, png, до 2МБ)</label>
                <input type="file" id="image" accept="image/*">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-save btn-save--create" id="submitDistrictBtn">➕ Создать район</button>
                <button type="button" class="btn-cancel" id="cancelDistrictBtn">Отменить</button>
            </div>
        </form>
    `;

    const listContainer = document.createElement('div');
    listContainer.className = 'records-list';
    listContainer.innerHTML = '<div class="loading">Загрузка районов...</div>';

    container.appendChild(formCard);
    container.appendChild(listContainer);

    // ---- Локальные ссылки на элементы (уникальные id) ----
    const form = formCard.querySelector('#districtForm');
    const toggleBtn = formCard.querySelector('#toggleDistrictsForm');
    const submitBtn = formCard.querySelector('#submitDistrictBtn');
    const cancelBtn = formCard.querySelector('#cancelDistrictBtn');
    const districtIdInput = formCard.querySelector('#districtId');
    const nameInput = formCard.querySelector('#name');
    const descriptionInput = formCard.querySelector('#description');
    const advantagesInput = formCard.querySelector('#advantages');
    const imageInput = formCard.querySelector('#image');

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

    // ---- Отмена редактирования / сброс формы (исправлено!) ----
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

    function transliterate(text) {
        const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
            'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return text.toLowerCase().split('').map(char => map[char] || (/[a-z0-9]/i.test(char) ? char : '')).join('').replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
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
            submitBtn.textContent = '➕ Создать район';
        }
    }

    function resetForm() {
        districtIdInput.value = '';
        nameInput.value = '';
        descriptionInput.value = '';
        advantagesInput.value = '';
        imageInput.value = '';
        highlightForm(false);
    }

    // ---- Загрузка списка районов ----
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
                renderDistricts(districts);
            } else {
                throw new Error('Ошибка загрузки');
            }
        } catch (err) {
            console.error(err);
            listContainer.innerHTML = '<div class="error">Не удалось загрузить районы</div>';
        }
    }

    function renderDistricts(districts) {
        if (!districts.length) {
            listContainer.innerHTML = '<div class="empty">Нет районов. Создайте первый.</div>';
            return;
        }
        const cardsHtml = districts.map(district => `
            <div class="record-card" data-id="${district.id}">
                <div class="record-card__image">
                    ${district.image ? `<img src="/storage/${district.image}" alt="${escapeHtml(district.name)}">` : '<div class="no-image">Нет фото</div>'}
                </div>
                <div class="record-card__content">
                    <h4>${escapeHtml(district.name)}</h4>
                    <div class="record-card__slug">slug: ${escapeHtml(district.slug)}</div>
                    <div class="record-card__description">${escapeHtml(district.description || '—')}</div>
                    <div class="record-card__advantages">${escapeHtml(district.advantages || '—')}</div>
                </div>
                <div class="record-card__actions">
                    <button class="btn-edit" data-id="${district.id}" data-name="${escapeHtml(district.name)}" data-description="${escapeHtml(district.description || '')}" data-advantages="${escapeHtml(district.advantages || '')}">✏️ Редактировать</button>
                    <button class="btn-delete" data-id="${district.id}">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
        listContainer.innerHTML = cardsHtml;

        listContainer.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                fillFormForEdit(
                    btn.dataset.id,
                    btn.dataset.name,
                    btn.dataset.description,
                    btn.dataset.advantages
                );
            });
        });
        listContainer.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteDistrict(btn.dataset.id));
        });
    }

    function fillFormForEdit(id, name, description, advantages) {
        districtIdInput.value = id;
        nameInput.value = name;
        descriptionInput.value = description;
        advantagesInput.value = advantages;
        imageInput.value = '';
        highlightForm(true);
        nameInput.focus();
        if (!formVisible) toggleForm();
    }

    // ---- Создание / обновление (с _method=PUT) ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = districtIdInput.value;
        let name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const advantages = advantagesInput.value.trim();
        const imageFile = imageInput.files[0];

        if (!name) {
            showNotification('Введите название района', 'error');
            return;
        }

        const slug = transliterate(name);
        if (!slug) {
            showNotification('Название не может быть преобразовано в slug', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('advantages', advantages);
        if (imageFile) formData.append('image', imageFile);

        let url = '/api/districts';
        let method = 'POST';
        let actionType = 'create';

        if (id) {
            formData.append('_method', 'PUT');
            url = `/api/districts/${id}`;
            method = 'POST';
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
                await loadDistricts();
                showNotification(actionType === 'create' ? `Район "${name}" создан` : `Район "${name}" обновлён`, 'success');
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
    async function deleteDistrict(id) {
        if (!confirm('Удалить район? Это действие нельзя отменить.')) return;
        try {
            const response = await fetch(`/api/districts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                await loadDistricts();
                showNotification('Район удалён', 'success');
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

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    resetForm();
    await loadDistricts();
}
