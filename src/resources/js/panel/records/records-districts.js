export async function initRecordsDistricts(token) {
    const container = document.getElementById('recordsDistricts');
    if (!container) return;

    container.innerHTML = '';

    const formCard = document.createElement('div');
    formCard.className = 'records-form';
    formCard.innerHTML = `
        <h3>Добавить / редактировать район</h3>
        <button type="button" class="toggle-form-btn" id="toggleFormBtn">−</button>
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
                <button type="submit" id="submitBtn" class="btn-save btn-save--create">➕ Создать район</button>
                <button type="button" class="btn-cancel" id="cancelEditBtn">Отменить</button>
            </div>
        </form>
    `;

    const listContainer = document.createElement('div');
    listContainer.className = 'records-list';
    listContainer.innerHTML = '<div class="loading">Загрузка районов...</div>';

    container.appendChild(formCard);
    container.appendChild(listContainer);

    // ----- Утилиты -----
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
        const form = document.querySelector('#districtForm');
        if (isEditMode) {
            form.style.backgroundColor = '#fff9c4';
            form.style.transition = 'background-color 0.2s';
        } else {
            form.style.backgroundColor = '';
        }
        const btn = document.getElementById('submitBtn');
        if (isEditMode) {
            btn.classList.remove('btn-save--create');
            btn.classList.add('btn-save--edit');
            btn.textContent = '✏️ Сохранить изменения';
        } else {
            btn.classList.remove('btn-save--edit');
            btn.classList.add('btn-save--create');
            btn.textContent = '➕ Создать район';
        }
    }

    // ----- Сворачивание формы -----
    const toggleBtn = document.getElementById('toggleFormBtn');
    const districtForm = document.getElementById('districtForm');
    let formVisible = true;
    toggleBtn.addEventListener('click', () => {
        formVisible = !formVisible;
        if (formVisible) {
            districtForm.classList.remove('form-hidden');
            toggleBtn.textContent = '−';
        } else {
            districtForm.classList.add('form-hidden');
            toggleBtn.textContent = '+';
        }
    });

    // ----- Загрузка районов -----
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
            console.error('Ошибка загрузки районов:', err);
            listContainer.innerHTML = '<div class="error">Не удалось загрузить районы</div>';
        }
    }

    // ----- Отображение карточек -----
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

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                fillFormForEdit(
                    btn.dataset.id,
                    btn.dataset.name,
                    btn.dataset.description,
                    btn.dataset.advantages
                );
            });
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteDistrict(btn.dataset.id));
        });
    }

    function fillFormForEdit(id, name, description, advantages) {
        document.getElementById('districtId').value = id;
        document.getElementById('name').value = name;
        document.getElementById('description').value = description;
        document.getElementById('advantages').value = advantages;
        document.getElementById('image').value = '';
        highlightForm(true);
        document.getElementById('name').focus();
    }

    function resetForm() {
        document.getElementById('districtId').value = '';
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        document.getElementById('advantages').value = '';
        document.getElementById('image').value = '';
        highlightForm(false);
    }

    document.getElementById('cancelEditBtn').addEventListener('click', () => resetForm());

    // ----- Создание / обновление -----
    const form = document.getElementById('districtForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('districtId').value;
        let name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const advantages = document.getElementById('advantages').value.trim();
        const imageFile = document.getElementById('image').files[0];

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
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                resetForm();
                await loadDistricts();
                if (actionType === 'create') {
                    showNotification(`Район "${name}" успешно создан`, 'success');
                } else {
                    showNotification(`Район "${name}" обновлён`, 'success');
                }
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

    // ----- Удаление -----
    async function deleteDistrict(id) {
        if (!confirm('Удалить район? Это действие нельзя отменить.')) return;
        try {
            const response = await fetch(`/api/districts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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
