// resources/js/home/carousel/districts-grid.js
export async function renderDistrictsCards() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;

    container.innerHTML = '<div class="districts__loader">Загрузка районов...</div>';

    try {
        const response = await fetch('/api/districts');
        if (!response.ok) throw new Error('Ошибка загрузки');

        const districts = await response.json();

        if (!districts.length) {
            container.innerHTML = '<p class="districts__error">Нет доступных районов</p>';
            return;
        }

        const cardsPerPage = 6; // 3x2
        const totalPages = Math.ceil(districts.length / cardsPerPage);
        const useCarousel = totalPages > 1;

        if (useCarousel) {
            buildPagedCarousel(container, districts, cardsPerPage, totalPages);
        } else {
            renderGrid(container, districts, cardsPerPage);
        }

    } catch (error) {
        console.error('Ошибка загрузки районов:', error);
        container.innerHTML = '<p class="districts__error">Не удалось загрузить районы. Попробуйте позже.</p>';
    }
}

// Обычный грид (если районов <= 6)
function renderGrid(container, districts, cardsPerPage) {
    container.innerHTML = '';
    container.classList.remove('districts__grid--carousel');
    // показываем все карточки
    districts.forEach(district => {
        container.appendChild(createDistrictCard(district));
    });
}

// Создание DOM-элемента карточки района
function createDistrictCard(district) {
    const card = document.createElement('article');
    card.className = 'district-card';
    card.setAttribute('data-district', district.slug);

    card.addEventListener('click', () => {
        window.location.href = `/choice/${district.slug}`;
    });

    const imageContainer = document.createElement('div');
    imageContainer.className = 'district-card__image';
    const imageUrl = district.image && district.image !== 'default.png'
        ? `/storage/${district.image}`
        : '/storage/default.png';
    imageContainer.style.backgroundImage = `url('${imageUrl}')`;

    const title = document.createElement('h3');
    title.className = 'district-card__title';
    title.textContent = district.name;

    const desc = document.createElement('p');
    desc.className = 'district-card__description';
    desc.textContent = district.description || 'Описание отсутствует';

    card.appendChild(imageContainer);
    card.appendChild(title);
    card.appendChild(desc);

    return card;
}

// Построение карусели со страницами по 6 карточек
function buildPagedCarousel(container, districts, cardsPerPage, totalPages) {
    container.innerHTML = '';
    container.classList.add('districts__grid--carousel');

    // Обёртка карусели
    const carousel = document.createElement('div');
    carousel.className = 'districts-carousel';

    // Кнопки Prev/Next
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-btn--prev';
    prevBtn.innerHTML = '❮';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-btn--next';
    nextBtn.innerHTML = '❯';

    // Контейнер для текущей страницы (сетка 3x2)
    const gridContainer = document.createElement('div');
    gridContainer.className = 'districts__grid districts__grid--paged';

    // Индикаторы (точки)
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    const dots = [];

    let currentPage = 0;

    function renderPage(page) {
        gridContainer.innerHTML = '';
        const start = page * cardsPerPage;
        const end = start + cardsPerPage;
        const pageDistricts = districts.slice(start, end);
        pageDistricts.forEach(district => {
            gridContainer.appendChild(createDistrictCard(district));
        });
        // Обновляем активную точку
        dots.forEach((dot, idx) => {
            dot.classList.toggle('carousel-dot--active', idx === page);
        });
    }

    function nextPage() {
        currentPage = (currentPage + 1) % totalPages;
        renderPage(currentPage);
    }

    function prevPage() {
        currentPage = (currentPage - 1 + totalPages) % totalPages;
        renderPage(currentPage);
    }

    // Создаём точки
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('carousel-dot--active');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => {
            stopAutoplay();
            currentPage = i;
            renderPage(currentPage);
            startAutoplay();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
    }

    carousel.appendChild(prevBtn);
    carousel.appendChild(gridContainer);
    carousel.appendChild(nextBtn);
    carousel.appendChild(dotsContainer);
    container.appendChild(carousel);

    let autoplayInterval = null;

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        if (totalPages > 1) {
            autoplayInterval = setInterval(() => {
                nextPage();
            }, 5000);
        }
    }
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // События на кнопки
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevPage();
        startAutoplay();
    });
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextPage();
        startAutoplay();
    });

    // Пауза при наведении на карусель
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Первая отрисовка
    renderPage(0);
    startAutoplay();
}
