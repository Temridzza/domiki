export async function initRecordsUsers(token, isSuperAdmin) {
    // Если не супер-админ – ничего не делаем (хотя пункт меню уже скрыт, на всякий случай)
    if (!isSuperAdmin) return;

    const container = document.getElementById('recordsUsers');
    if (!container) return;

    container.innerHTML = '';

    // ---- Форма создания/редактирования ----
    const formCard = document.createElement('div');
    formCard.className = 'records-form';
    formCard.innerHTML = `
        <h3>Добавить / редактировать пользователя</h3>
        <button type="button" class="toggle-form-btn" id="toggleUsersForm">−</button>
        <form id="userForm" class="record-form">
            <input type="hidden" id="userId" value="">
            <div class="form-group">
                <label for="userName">Имя *</label>
                <input type="text" id="userName" required autocomplete="off">
            </div>
            <div class="form-group">
                <label for="userEmail">Email *</label>
                <input type="email" id="userEmail" required autocomplete="off">
            </div>
            <div class="form-group">
                <label for="userPassword">Пароль ${'<span style="font-weight:normal;">(оставьте пустым, чтобы не менять)</span>'}</label>
                <input type="password" id="userPassword" autocomplete="off">
                <small style="color:#666;">Минимум 6 символов. Для создания пользователя пароль обязателен.</small>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="userIsAdmin"> Администратор (is_admin)
                </label>
            </div>
            <div class="form-group" id="superAdminCheckboxGroup">
                <label class="checkbox-label">
                    <input type="checkbox" id="userIsSuperAdmin"> Супер-администратор (is_superAdmin)
                </label>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-save btn-save--create" id="submitUserBtn">➕ Создать пользователя</button>
                <button type="button" class="btn-cancel" id="cancelUserBtn">Отменить</button>
            </div>
        </form>
    `;

    const listContainer = document.createElement('div');
    listContainer.className = 'records-list';
    listContainer.innerHTML = '<div class="loading">Загрузка пользователей...</div>';

    container.appendChild(formCard);
    container.appendChild(listContainer);

    // ---- Локальные ссылки ----
    const form = formCard.querySelector('#userForm');
    const toggleBtn = formCard.querySelector('#toggleUsersForm');
    const submitBtn = formCard.querySelector('#submitUserBtn');
    const cancelBtn = formCard.querySelector('#cancelUserBtn');
    const userIdInput = formCard.querySelector('#userId');
    const nameInput = formCard.querySelector('#userName');
    const emailInput = formCard.querySelector('#userEmail');
    const passwordInput = formCard.querySelector('#userPassword');
    const isAdminCheck = formCard.querySelector('#userIsAdmin');
    const isSuperAdminCheck = formCard.querySelector('#userIsSuperAdmin');

    // Показываем чекбокс супер-админа только если текущий пользователь – супер-админ
    if (!isSuperAdmin) {
        const group = formCard.querySelector('#superAdminCheckboxGroup');
        if (group) group.style.display = 'none';
    }

    let formVisible = true;

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

    cancelBtn.addEventListener('click', resetForm);

    // ---- Уведомления ----
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
            submitBtn.textContent = '➕ Создать пользователя';
        }
    }

    function resetForm() {
        userIdInput.value = '';
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        isAdminCheck.checked = false;
        isSuperAdminCheck.checked = false;
        highlightForm(false);
    }

    // ---- Загрузка списка пользователей ----
    async function loadUsers() {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                renderUsers(data.data);
            } else {
                throw new Error('Ошибка загрузки');
            }
        } catch (err) {
            console.error(err);
            listContainer.innerHTML = '<div class="error">Не удалось загрузить пользователей</div>';
        }
    }

    function renderUsers(users) {
        if (!users.length) {
            listContainer.innerHTML = '<div class="empty">Нет пользователей</div>';
            return;
        }
        // Таблица для наглядности
        const tableHtml = `
            <table class="users-table">
                <thead>
                    <tr><th>ID</th><th>Имя</th><th>Email</th><th>Админ</th><th>Супер-админ</th><th>Действия</th></tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr data-id="${user.id}">
                            <td>${user.id}</td>
                            <td>${escapeHtml(user.name)}</td>
                            <td>${escapeHtml(user.email)}</td>
                            <td>${user.is_admin ? '✅' : '❌'}</td>
                            <td>${user.is_superAdmin ? '⭐' : '—'}</td>
                            <td class="actions-cell">
                                <button class="btn-edit-user" data-id="${user.id}" data-name="${escapeHtml(user.name)}" data-email="${escapeHtml(user.email)}" data-is-admin="${user.is_admin}" data-is-super="${user.is_superAdmin}">✏️</button>
                                <button class="btn-delete-user" data-id="${user.id}" ${user.id === currentUserId ? 'disabled title="Нельзя удалить самого себя"' : ''}>🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listContainer.innerHTML = tableHtml;

        // Получаем ID текущего пользователя из токена (можно сохранить при логине)
        // Для простоты – из localStorage или глобальной переменной. Сделаем через запрос к /api/user.
        fetchCurrentUser();

        listContainer.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', () => {
                fillFormForEdit(
                    btn.dataset.id,
                    btn.dataset.name,
                    btn.dataset.email,
                    btn.dataset.isAdmin === '1' || btn.dataset.isAdmin === 'true',
                    btn.dataset.isSuper === '1' || btn.dataset.isSuper === 'true'
                );
            });
        });
        listContainer.querySelectorAll('.btn-delete-user:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => deleteUser(btn.dataset.id));
        });
    }

    let currentUserId = null;

    async function fetchCurrentUser() {
        try {
            const res = await fetch('/api/user', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                currentUserId = data.id;
            }
        } catch (e) {}
    }

    function fillFormForEdit(id, name, email, isAdmin, isSuper) {
        userIdInput.value = id;
        nameInput.value = name;
        emailInput.value = email;
        passwordInput.value = '';
        isAdminCheck.checked = isAdmin;
        isSuperAdminCheck.checked = isSuper;
        highlightForm(true);
        nameInput.focus();
        if (!formVisible) toggleForm();
    }

    // ---- Создание / обновление ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = userIdInput.value;
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const isAdmin = isAdminCheck.checked;
        const isSuper = isSuperAdminCheck.checked;

        if (!name || !email) {
            showNotification('Имя и email обязательны', 'error');
            return;
        }
        if (!id && !password) {
            showNotification('При создании пользователя укажите пароль', 'error');
            return;
        }
        if (password && password.length < 6) {
            showNotification('Пароль должен быть не менее 6 символов', 'error');
            return;
        }

        const payload = {
            name, email, is_admin: isAdmin, is_superAdmin: isSuper
        };
        if (password) payload.password = password;

        let url = '/api/users';
        let method = 'POST';
        let actionType = 'create';

        if (id) {
            url = `/api/users/${id}`;
            method = 'PUT';
            actionType = 'update';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                resetForm();
                await loadUsers();
                showNotification(actionType === 'create' ? `Пользователь "${name}" создан` : `Пользователь "${name}" обновлён`, 'success');
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

    // ---- Удаление пользователя ----
    async function deleteUser(id) {
        if (!confirm('Удалить пользователя? Это действие нельзя отменить.')) return;
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                await loadUsers();
                showNotification('Пользователь удалён', 'success');
                // Если удалили сами себя – редирект или перезагрузка
                if (id == currentUserId) {
                    showNotification('Вы удалили себя. Страница будет перезагружена.', 'warning');
                    setTimeout(() => location.reload(), 2000);
                }
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
    await loadUsers();
}
