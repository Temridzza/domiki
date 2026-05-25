// resources/js/home/toggle-view.js
import { renderDistrictsCards } from './carousel/districts-grid';
import { renderNewBuildingsCards } from './carousel/new-buildings-grid';

export function initViewToggle() {
    const toggle = document.getElementById('viewToggle');
    const subtitle = document.getElementById('districtsSubtitle');
    const titleEl = document.querySelector('.districts__title');

    if (!toggle || !subtitle || !titleEl) return;

    const subtitles = {
        districts: 'Престижные локации с развитой инфраструктурой',
        buildings: 'Современные новостройки напрямую от застройщика'
    };

    const switchView = async () => {
        const isDistricts = !toggle.checked;
        if (isDistricts) {
            titleEl.textContent = 'Выбрать';
            subtitle.textContent = subtitles.districts;
            await renderDistrictsCards();
        } else {
            titleEl.textContent = 'Выбрать';
            subtitle.textContent = subtitles.buildings;
            await renderNewBuildingsCards();
        }
    };

    toggle.addEventListener('change', switchView);
    renderDistrictsCards(); // начальный рендер
}
