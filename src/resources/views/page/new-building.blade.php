@extends('layouts.app')

@section('title', 'Новостройка')
@section('description', 'Детальная информация о жилом комплексе')
@section('keywords', 'жк, квартиры, планировки, застройщик')

@section('style')
    @vite('resources/css/app.css')
@endsection

@section('content')
<div class="site-wrapper">
    {{-- Заголовок --}}
    <div class="header">
        <h1 class="header__title" id="buildingName">Загрузка...</h1>
    </div>

    {{-- Основная информация о ЖК --}}
    <div class="building-info" id="buildingInfo">
        <div class="building-info__container">
            <div class="building-info__image">
                <img id="buildingImage" src="" alt="Фото ЖК">
            </div>
            <div class="building-info__details">
                <p><strong>Адрес:</strong> <span id="buildingAddress"></span></p>
                <p><strong>Срок сдачи:</strong> <span id="buildingCompletionDate"></span></p>
                <p><strong>Преимущества:</strong> <span id="buildingAdvantages"></span></p>
                <div id="buildingPdfLink"></div>
            </div>
        </div>
    </div>

    {{-- Счетчик квартир --}}
    <div class="district-header-stats">
        <div class="district-header-stats__container">
            <div class="district-header-stats__headline">КВАРТИРЫ В ЖК</div>
            <div class="district-header-stats__counter">
                <span class="district-header-stats__counter-label">Всего:</span>
                <span class="district-header-stats__counter-value" id="totalApartmentsCount">0</span>
            </div>
        </div>
    </div>

    {{-- Контейнер для типов квартир --}}
    <div class="apartment-types-container" id="apartmentTypesContainer"></div>

    {{-- Форма заявки --}}
    <section class="form-section" id="formSection">
        <div class="form-section__wrapper">
            <h3 class="form-section__title">ОСТАВЬТЕ ЗАЯВКУ</h3>
            <p class="form-section__description">Менеджер подберет лучший вариант с выгодой</p>

            <form class="form-section__form" id="leadForm">
                <div class="form-section__fields">
                    <div class="form-field">
                        <input type="text" class="form-field__input" placeholder="Ваше имя" id="userName" name="userName" required>
                    </div>
                    <div class="form-field">
                        <input type="tel" class="form-field__input" placeholder="Номер телефона" id="userPhone" name="userPhone" required>
                    </div>
                    <div class="form-field">
                        <textarea class="form-field__textarea" placeholder="Количество комнат / бюджет / пожелания" id="userComment" name="userComment"></textarea>
                    </div>
                    <button type="submit" class="form-section__submit form_btn form_btn--primary form_btn--full">
                        <i class="fas fa-paper-plane"></i>
                        <span>ОТПРАВИТЬ ЗАЯВКУ</span>
                    </button>
                </div>
                <p class="form-section__consent">Нажимая на кнопку, вы даете согласие на обработку данных</p>
            </form>
        </div>
    </section>
</div>

{{-- Модальное окно для увеличенной планировки --}}
<div id="layoutModal" class="modal">
    <span class="modal-close">&times;</span>
    <img class="modal-content" id="modalImage">
</div>

<script>
    // ID новостройки из URL (передан через контроллер)
    window.buildingId = @json($buildingId ?? null);

    if (!window.buildingId) {
        const pathSegments = window.location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (!isNaN(lastSegment)) {
            window.buildingId = parseInt(lastSegment);
        }
    }

    // Загрузка данных о новостройке
    if (window.buildingId) {
        fetch(`/api/new-buildings/${window.buildingId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    renderBuilding(data.data);
                } else {
                    document.getElementById('buildingName').innerText = 'Ошибка загрузки';
                }
            })
            .catch(err => {
                console.error(err);
                document.getElementById('buildingName').innerText = 'Не удалось загрузить данные';
            });
    } else {
        document.getElementById('buildingName').innerText = 'ID новостройки не указан';
    }

    // Отображение основной информации
    function renderBuilding(building) {
        document.getElementById('buildingName').innerText = building.name;
        const imgEl = document.getElementById('buildingImage');
        imgEl.src = building.image ? `/storage/${building.image}` : '/storage/default.png';
        document.getElementById('buildingAddress').innerText = building.address || '—';
        document.getElementById('buildingCompletionDate').innerText = building.completion_date || '—';
        document.getElementById('buildingAdvantages').innerText = building.advantages || '—';
        const pdfContainer = document.getElementById('buildingPdfLink');
        if (building.developer_pdf) {
            pdfContainer.innerHTML = `<a href="/storage/${building.developer_pdf}" target="_blank" class="btn-pdf">📄 Скачать PDF от застройщика</a>`;
        } else {
            pdfContainer.innerHTML = '';
        }
        renderApartmentTypes(building.apartment_types);
    }

    // Генерация таблиц типов квартир (сворачиваемые, с изображениями планировок)
    function renderApartmentTypes(types) {
        const container = document.getElementById('apartmentTypesContainer');
        container.innerHTML = '';

        if (!types || types.length === 0) {
            container.innerHTML = '<p class="no-data">Типы квартир не добавлены</p>';
            document.getElementById('totalApartmentsCount').innerText = '0';
            return;
        }

        let totalApartments = 0;

        types.forEach((type, index) => {
            const typeBlock = document.createElement('div');
            typeBlock.className = 'apartment-type-card';

            const header = document.createElement('div');
            header.className = 'apartment-type-header';
            header.setAttribute('data-type-id', index);

            const title = document.createElement('h3');
            title.innerText = ` ${type.rooms ?? '?'} комнатные`;

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-table-btn';
            toggleBtn.innerHTML = '▲'; // свёрнуто по умолчанию
            toggleBtn.setAttribute('aria-label', 'Развернуть таблицу');

            header.appendChild(title);
            header.appendChild(toggleBtn);

            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-wrapper';
            tableWrapper.style.display = 'none'; // по умолчанию скрыта

            const apartments = type.apartments || [];
            totalApartments += apartments.length;

            if (apartments.length === 0) {
                const emptyMsg = document.createElement('p');
                emptyMsg.className = 'empty-apartments';
                emptyMsg.innerText = 'Нет доступных квартир';
                tableWrapper.appendChild(emptyMsg);
            } else {
                const table = document.createElement('table');
                table.className = 'apartments-table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Планировка</th>
                            <th>Цена</th>
                            <th>Этаж</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const tbody = table.querySelector('tbody');

                apartments.forEach(apt => {
                    const row = tbody.insertRow();

                    // Ячейка с изображением планировки
                    const layoutCell = row.insertCell();
                    const layoutImage = apt.layout_image || apt.planning_image || null;
                    if (layoutImage) {
                        const imgUrl = layoutImage.startsWith('http') ? layoutImage : `/storage/${layoutImage}`;
                        const img = document.createElement('img');
                        img.src = imgUrl;
                        img.alt = 'Планировка';
                        img.className = 'layout-thumbnail';
                        img.loading = 'lazy';
                        img.style.cursor = 'pointer';
                        img.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openModal(imgUrl);
                        });
                        layoutCell.appendChild(img);
                    } else {
                        layoutCell.innerText = apt.layout || apt.planning || 'Нет схемы';
                    }

                    // Цена
                    row.insertCell().innerText = apt.price ? `${apt.price.toLocaleString()} ₽` : '—';
                    // Этаж
                    row.insertCell().innerText = apt.floor || '—';

                    // Статус
                    let statusText = '';
                    if (apt.status === 'available') statusText = 'Доступна';
                    else if (apt.status === 'reserved') statusText = 'Забронированна';
                    else if (apt.status === 'sold') statusText = 'Продана';
                    else statusText = apt.status || '—';

                    const statusCell = row.insertCell();
                    statusCell.innerText = statusText;
                    statusCell.className = `status-cell ${apt.status === 'available' ? 'status-available' : (apt.status === 'booked' ? 'status-booked' : (apt.status === 'sold' ? 'status-sold' : 'status-unknown'))}`;
                });

                tableWrapper.appendChild(table);
            }

            typeBlock.appendChild(header);
            typeBlock.appendChild(tableWrapper);

            toggleBtn.addEventListener('click', () => {
                const isCollapsed = tableWrapper.style.display === 'none';
                tableWrapper.style.display = isCollapsed ? 'block' : 'none';
                toggleBtn.innerHTML = isCollapsed ? '▼' : '▲';
                toggleBtn.setAttribute('aria-label', isCollapsed ? 'Свернуть таблицу' : 'Развернуть таблицу');
            });

            container.appendChild(typeBlock);
        });

        document.getElementById('totalApartmentsCount').innerText = totalApartments;
    }

    // Модальное окно – увеличенное изображение
    function openModal(imageUrl) {
        const modal = document.getElementById('layoutModal');
        const modalImg = document.getElementById('modalImage');
        modal.style.display = 'flex';
        modalImg.src = imageUrl;
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
    }

    function closeModal() {
        const modal = document.getElementById('layoutModal');
        modal.style.display = 'none';
    }

    // Закрытие модалки по крестику и Escape
    document.addEventListener('DOMContentLoaded', () => {
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    });
</script>

<style>
    /* Дополнительные стили (можно вынести в app.css) */
    .building-info__container {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 12px;
        margin-bottom: 2rem;
    }
    .building-info__image img {
        max-width: 300px;
        border-radius: 8px;
        object-fit: cover;
    }
    .building-info__details {
        flex: 1;
    }
    .building-info__details p strong {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e3a5f;
        display: inline-block;
        min-width: 130px;
        letter-spacing: 0.5px;
        background: #eef2f7;
        padding: 4px 8px;
        border-radius: 6px;
    }
    .building-info__details p span {
        font-size: 1.15rem;
        font-weight: 500;
        color: #2c3e50;
        padding: 4px 0;
    }
    .btn-pdf {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #2c3e66;
        color: white;
        border-radius: 6px;
        text-decoration: none;
    }
    /* Карточки типов квартир */
    .apartment-type-card {
        background: white;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        overflow: hidden;
    }
    .apartment-type-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        cursor: pointer;
    }
    .apartment-type-header h3 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 600;
        color: #0f172a;
    }
    .toggle-table-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #3b82f6;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        transition: background 0.2s;
    }
    .toggle-table-btn:hover {
        background: #e2e8f0;
    }
    .table-wrapper {
        padding: 1rem 1.5rem 1.5rem;
        overflow-x: auto;
    }
    /* Таблица */
    .apartments-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
    }
    .apartments-table th,
    .apartments-table td {
        border: 1px solid #e2e8f0;
        padding: 12px 16px;
        text-align: left;
        vertical-align: middle;
    }
    .apartments-table th {
        background: #f1f5f9;
        font-weight: 600;
        color: #1e293b;
    }
    .apartments-table tbody tr:nth-child(even) {
        background: #fefefe;
    }
    .apartments-table tbody tr:nth-child(odd) {
        background: #ffffff;
    }
    .apartments-table tbody tr:hover {
        background: #f8fafc;
    }
    /* Статусы: центрирование и бейджи */
    .status-cell {
        text-align: center;
    }
    /* Миниатюры планировок */
    .layout-thumbnail {
        max-width: 120px;
        max-height: 80px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }
    .layout-thumbnail:hover {
        transform: scale(1.05);
    }
    .empty-apartments {
        text-align: center;
        padding: 2rem;
        color: #64748b;
        background: #f8fafc;
        border-radius: 12px;
    }
    /* Модальное окно */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.9);
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: zoomIn 0.3s;
    }
    .modal-close {
        position: absolute;
        top: 20px;
        right: 35px;
        color: #f1f1f1;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
        z-index: 1001;
    }
    .modal-close:hover {
        color: #bbb;
    }
    @keyframes zoomIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    @media (max-width: 768px) {
        .building-info__container {
            flex-direction: column;
        }
        .building-info__image img {
            max-width: 100%;
        }
        .layout-thumbnail {
            max-width: 80px;
            max-height: 60px;
        }
        .modal-close {
            top: 15px;
            right: 25px;
            font-size: 30px;
        }
    }
</style>
@endsection

@section('scripts')
    @vite('resources/js/app.js')
@endsection
