// Менеджер заявок для страницы выбора района
export class FormManager {
  constructor() {
    this.requests = []; // массив заявок
    this.badgesContainer = null;
    this.form = document.getElementById('leadForm');
    this.messageBlock = null;

    if (!this.form) return;

    // Создаём контейнер для бейджей, если его нет
    this.createBadgesContainer();
    this.initSubmitHandler();
  }

  createBadgesContainer() {
    // Ищем место для бейджей – вставляем перед полем комментария
    const commentField = this.form.querySelector('#userComment')?.closest('.form-field');
    if (commentField) {
      const container = document.createElement('div');
      container.className = 'request-badges-container';
      container.id = 'requestBadgesContainer';
      commentField.before(container);
      this.badgesContainer = container;
    } else {
      // запасной вариант – в конец формы перед кнопкой
      const submitBtn = this.form.querySelector('.form-section__submit');
      const container = document.createElement('div');
      container.className = 'request-badges-container';
      container.id = 'requestBadgesContainer';
      if (submitBtn) submitBtn.before(container);
      else this.form.appendChild(container);
      this.badgesContainer = container;
    }
  }

  showForm(data) {
    // Добавляем заявку
    this.addRequest(data);
  }

  addRequest(data) {
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random();
    const request = { id, ...data };
    this.requests.push(request);
    this.renderBadges();
  }

  removeRequest(id) {
    this.requests = this.requests.filter(req => req.id !== id);
    this.renderBadges();
  }

  clearAllRequests() {
    this.requests = [];
    this.renderBadges();
  }

  renderBadges() {
    if (!this.badgesContainer) return;
    if (this.requests.length === 0) {
      this.badgesContainer.style.display = 'none';
      return;
    }
    this.badgesContainer.style.display = 'flex';
    this.badgesContainer.innerHTML = '';

    this.requests.forEach(req => {
      const badge = document.createElement('div');
      badge.className = 'request-badge';
      badge.dataset.id = req.id;

      let text = '';
      if (req.buildingName) {
        text = `🏢 ${req.buildingName}`;
        if (req.rooms) text += ` | ${req.rooms}`;
        if (req.area) text += ` | ${req.area}м²`;
        if (req.price) text += ` | ${req.price}`;
        if (req.floor) text += ` | этаж ${req.floor}`;
        if (req.count) text += ` (доступно ${req.count})`;
      } else {
        text = `🏢 ${req.complexName || 'ЖК'} | Заявка`;
      }

      badge.innerHTML = `
        <div class="request-badge__content">
          <div class="request-badge__info">
            <div class="request-badge__details">${escapeHtml(text)}</div>
          </div>
          <button class="request-badge__close" data-id="${req.id}">✕</button>
        </div>
      `;

      badge.addEventListener('click', (e) => {
        if (e.target.classList.contains('request-badge__close')) return;
        // выделение бейджа (можно по желанию)
        badge.classList.toggle('request-badge_selected');
      });

      const closeBtn = badge.querySelector('.request-badge__close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeRequest(req.id);
      });

      this.badgesContainer.appendChild(badge);
    });
  }

  initSubmitHandler() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Собираем поля
      const userName = this.form.querySelector('#userName')?.value.trim() || '';
      const userPhone = this.form.querySelector('#userPhone')?.value.trim() || '';
      const userComment = this.form.querySelector('#userComment')?.value.trim() || '';

      // Валидация
      let hasError = false;
      const fields = [
        { element: this.form.querySelector('#userName'), name: 'Имя' },
        { element: this.form.querySelector('#userPhone'), name: 'Телефон' }
      ];
      fields.forEach(field => {
        if (!field.element?.value.trim()) {
          this.showFieldError(field.element, `Введите ${field.name}`);
          hasError = true;
        } else {
          this.clearFieldError(field.element);
        }
      });

      if (hasError) return;

      // Формируем данные для отправки
      const requestsData = this.requests.map(req => ({
        type: req.buildingName ? 'apartment' : 'complex',
        buildingName: req.buildingName || req.complexName,
        rooms: req.rooms || null,
        area: req.area || null,
        price: req.price || null,
        floor: req.floor || null,
        count: req.count || null
      }));

      // Информация о странице
      const pageUrl = window.location.href;
      const pageTitle = document.title || 'Страница выбора района';
      const districtSlug = window.districtSlug || 'неизвестный район';

      const payload = {
        name: userName,
        phone: userPhone,
        comment: userComment,
        requests: requestsData,
        page: {
          url: pageUrl,
          title: pageTitle,
          district: districtSlug
        }
      };

      // Отправка
      try {
        // Замените URL на реальный эндпоинт
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Ошибка сервера');

        this.showMessage('✅ Заявка успешно отправлена!', 'success');
        this.form.reset();
        this.clearAllRequests();
      } catch (error) {
        console.error(error);
        this.showMessage('❌ Ошибка отправки. Попробуйте позже.', 'error');
      }
    });
  }

  showMessage(text, type) {
    if (!this.messageBlock) {
      this.messageBlock = document.createElement('div');
      this.messageBlock.className = 'form-section__message';
      this.form.appendChild(this.messageBlock);
    }
    this.messageBlock.textContent = text;
    this.messageBlock.classList.add(`form-section__message--${type}`);
    this.messageBlock.style.display = 'block';
    setTimeout(() => {
      this.messageBlock.style.display = 'none';
      this.messageBlock.classList.remove(`form-section__message--${type}`);
    }, 5000);
  }

  showFieldError(field, message) {
    field.classList.add('form-field__input_error');
    let errorDiv = field.parentNode.querySelector('.form-field__error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-field__error';
      field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('form-field__input_error');
    const errorDiv = field.parentNode.querySelector('.form-field__error');
    if (errorDiv) errorDiv.remove();
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
