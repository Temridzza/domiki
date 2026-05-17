import './bootstrap';

console.log('Laravel + Vite + Docker работает!');

// Импортируем модули
import { initMobileMenu } from './index/mobile-menu';
import { renderDistrictsCards } from './home/districts-grid';
import { initFormHandler } from './home/form';
import { renderStocks } from './home/stocks';
import { fetchAndUpdateTotalCount } from './choice/count';

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    // home
    renderDistrictsCards();
    initFormHandler();
    renderStocks();
    // choice
    if (window.districtSlug) {
        fetchAndUpdateTotalCount(window.districtSlug);
    }
});
