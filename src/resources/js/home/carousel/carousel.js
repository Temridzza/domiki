// resources/js/home/carousel/carousel.js
export function createCarousel(container, items, createCardFn, onCardClick) {
    if (!container || !items.length) return;

    container.innerHTML = '';
    container.classList.add('carousel-root');

    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-btn--prev';
    prevBtn.innerHTML = '❮';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-btn--next';
    nextBtn.innerHTML = '❯';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    items.forEach(item => {
        const card = createCardFn(item);
        if (onCardClick) {
            card.addEventListener('click', () => onCardClick(item));
        }
        track.appendChild(card);
    });

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(track);
    wrapper.appendChild(nextBtn);
    container.appendChild(wrapper);

    let autoScrollInterval = null;
    let isHovered = false;
    let direction = 1; // 1 = вперёд (вправо), -1 = назад (влево)

    // Получение полной ширины карточки (включая gap)
    function getCardWidth() {
        const firstCard = track.querySelector('.carousel-card');
        if (!firstCard) return 0;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.gap) || 0;
        return firstCard.offsetWidth + gap;
    }

    // Обновление видимости кнопок и смена направления при необходимости
    function updateButtonsVisibility() {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const currentScroll = track.scrollLeft;

        const atStart = currentScroll < cardWidth / 2;
        const atEnd = maxScroll - currentScroll < cardWidth / 2;

        // Скрываем/показываем кнопки
        if (atStart) {
            prevBtn.style.opacity = '0';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }

        if (atEnd) {
            nextBtn.style.opacity = '0';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }

        // Если достигли края, меняем направление автопрокрутки
        if (atEnd && direction === 1) {
            direction = -1;
            // Перезапускаем автопрокрутку с новым направлением
            if (!isHovered && autoScrollInterval) {
                stopAutoScroll();
                startAutoScroll();
            }
        } else if (atStart && direction === -1) {
            direction = 1;
            if (!isHovered && autoScrollInterval) {
                stopAutoScroll();
                startAutoScroll();
            }
        }
    }

    function scrollPrev() {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }

    function scrollNext() {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const currentScroll = track.scrollLeft;
        if (maxScroll - currentScroll < cardWidth / 2) {
            return;
        }
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }

    // Единая функция автопрокрутки с учётом направления
    function autoScrollStep() {
        if (direction === 1) {
            scrollNext();
        } else {
            scrollPrev();
        }
    }

    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        if (isHovered) return;
        autoScrollInterval = setInterval(() => {
            autoScrollStep();
        }, 5000); // каждые 5 секунд
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    // Обработчики кнопок (при клике сбрасываем направление? Нет, просто останавливаем и запускаем с текущим направлением)
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoScroll();
        scrollPrev();
        startAutoScroll();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoScroll();
        scrollNext();
        startAutoScroll();
    });

    // Отслеживаем прокрутку для обновления кнопок и смены направления
    track.addEventListener('scroll', () => {
        updateButtonsVisibility();
    });

    // Начальное состояние после рендера
    setTimeout(() => {
        updateButtonsVisibility();
    }, 100);

    // Пауза автопрокрутки при наведении
    const pauseElements = [wrapper, prevBtn, nextBtn];
    pauseElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoScroll();
        });
        el.addEventListener('mouseleave', () => {
            isHovered = false;
            startAutoScroll();
        });
    });

    startAutoScroll();
}
