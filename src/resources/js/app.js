// resources/js/app.js
import { initMobileMenu } from './index/mobile-menu';
import { initViewToggle } from './home/toggle-view';   // правильный импорт
import { initFormHandler } from './home/form';
import { renderStocks } from './home/stocks';
import { fetchAndUpdateTotalCount } from './choice/count';
import { initChoiceBuildings } from './choice/new-buildings';
import { FormManager } from './choice/form-manager';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initViewToggle();      // ← инициализация переключателя и рендер карусели
    initFormHandler();
    renderStocks();

    if (window.districtSlug) {
        fetchAndUpdateTotalCount(window.districtSlug);
        if (document.querySelector('.complexes-container')) {
            window.formManager = new FormManager();
            initChoiceBuildings();
        }
    }
});

