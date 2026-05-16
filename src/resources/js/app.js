import './bootstrap';

console.log('Laravel + Vite + Docker работает!');

// Импортируем модули
import { initMobileMenu } from './index/mobile-menu';
import { renderDistrictsCards } from './home/districts-grid';

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    renderDistrictsCards();
});
