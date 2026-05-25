@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')
@section('description', 'Новостройки в Ярославле — поиск и покупка квартир')
@section('keywords', 'застройщик, ипотека, скидки')

@section('style')
    @vite('resources/css/app.css')
@endsection

@section('content')

<div class="site-wrapper">
    {{-- Заголовок --}}
    <div class="header">
        <h1 class="header__title" id="buildingName">Загрузка...</h1>
    </div>

    {{-- Основная информация --}}
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

    {{-- Счетчик квартир (как в choice) --}}
    <div class="district-header-stats">
        <div class="district-header-stats__container">
            <div class="district-header-stats__headline">КВАРТИРЫ В ЖК</div>
            <div class="district-header-stats__counter">
                <span class="district-header-stats__counter-label">Всего:</span>
                <span class="district-header-stats__counter-value" id="totalApartmentsCount">0</span>
            </div>
        </div>
    </div>

    {{-- Список типов квартир --}}
    <div class="apartment-types-container" id="apartmentTypesContainer"></div>

    {{-- Форма заявки (как в choice) --}}
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

<script>
    // ID новостройки из URL (передан через контроллер веб-маршрута)
    window.buildingId = @json($buildingId ?? null);

    if (!window.buildingId) {
        // Если ID не передан, пытаемся взять из последнего сегмента URL
        const pathSegments = window.location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (!isNaN(lastSegment)) {
            window.buildingId = parseInt(lastSegment);
        }
    }

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

    function renderBuilding(building) {
        // Заголовок
        document.getElementById('buildingName').innerText = building.name;

        // Изображение
        const imgEl = document.getElementById('buildingImage');
        if (building.image) {
            imgEl.src = `/storage/${building.image}`;
        } else {
            imgEl.src = '/storage/default.png';
        }

        // Адрес, дата, преимущества
        document.getElementById('buildingAddress').innerText = building.address || '—';
        document.getElementById('buildingCompletionDate').innerText = building.completion_date || '—';
        document.getElementById('buildingAdvantages').innerText = building.advantages || '—';

        // PDF ссылка
        const pdfContainer = document.getElementById('buildingPdfLink');
        if (building.developer_pdf) {
            pdfContainer.innerHTML = `<a href="/storage/${building.developer_pdf}" target="_blank" class="btn-pdf">📄 Скачать PDF от застройщика</a>`;
        } else {
            pdfContainer.innerHTML = '';
        }

        // Отрисовка типов квартир
        renderApartmentTypes(building.apartment_types);
    }
    function renderApartmentTypes(types) {
    const container = document.getElementById('apartmentTypesContainer');
    container.innerHTML = '';

    if (!types || types.length === 0) {
        container.innerHTML = '<p class="no-data">Типы квартир не добавлены</p>';
        document.getElementById('totalApartmentsCount').innerText = '0';
        return;
    }

    let totalApartments = 0;

    types.forEach(type => {
        const typeBlock = document.createElement('div');
        typeBlock.className = 'apartment-type-card';

        const title = document.createElement('h3');
        title.innerText = `${type.rooms ?? '?'} комнатные`;
        typeBlock.appendChild(title);

        const apartments = type.apartments || [];
        totalApartments += apartments.length;

        if (apartments.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.innerText = 'Нет доступных квартир';
            typeBlock.appendChild(emptyMsg);
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
               
                // Отображаем планировку (поле layout или planning)
                const layoutValue = apt.layout || apt.planning /*|| '—'*/;
                row.insertCell().innerText = layoutValue;
                row.insertCell().innerText = apt.price ? `${apt.price.toLocaleString()} ₽` : '—';
                row.insertCell().innerText = apt.floor || '—';
                let statusText = '';
                if (apt.status === 'available') statusText = 'Доступна';
                else if (apt.status === 'reserved') statusText = 'Забронирована';
                else if (apt.status === 'sold') statusText = 'Продана';
                else statusText = apt.status || '—';
                row.insertCell().innerText = statusText;
            });

            typeBlock.appendChild(table);
        }

        container.appendChild(typeBlock);
    });

    document.getElementById('totalApartmentsCount').innerText = totalApartments;
}
</script>*/
  
<style>
    /* Стили для всей строки (метка + значение) */
    .building-info__details p {
        font-size: 1.15rem;          /* общий размер строки */
        margin-bottom: 1rem;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
    }

/* Стили для меток (Адрес:, Срок сдачи:, Преимущества:) */
    .building-info__details p strong {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e3a5f;
        background: #eef2f7;
        padding: 4px 12px;
        border-radius: 6px;
        margin-right: 15px;
        min-width: 140px;
        display: inline-block;
    }

/* Стили для значений (то, что идёт после метки) */
    .building-info__details p span {
        font-size: 1.15rem;
        font-weight: 500;
        color: #2c3e50;
        background: transparent;
        padding: 4px 0;
    }

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
    .btn-pdf {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #2c3e66;
        color: white;
        border-radius: 6px;
        text-decoration: none;
    }
    .apartment-type-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .apartments-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    .apartments-table th,
    .apartments-table td {
        border: 1px solid #ddd;
        padding: 0.5rem;
        text-align: left;
    }
    .apartments-table th {
        background: #f1f1f1;
    }
    .no-data {
        text-align: center;
        padding: 2rem;
        color: #666;
    }
    @media (max-width: 768px) {
        .building-info__container {
            flex-direction: column;
        }
        .building-info__image img {
            max-width: 100%;
        }
    }
</style>

@endsection

@section('scripts')
    @vite('resources/js/app.js')
@endsection
