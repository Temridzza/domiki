// Импортируем модули
import { initMobileMenu } from './index/mobile-menu';
import { initViewToggle } from './home/toggle-view';  // новый импорт
import { initFormHandler } from './home/form';
import { renderStocks } from './home/stocks';
import { fetchAndUpdateTotalCount } from './choice/count';
import { initChoiceBuildings } from './choice/new-buildings';
import { FormManager } from './choice/form-manager';

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    // home
    initViewToggle();           
    initFormHandler();
    renderStocks();
    // choice
    if (window.districtSlug) {
        fetchAndUpdateTotalCount(window.districtSlug);
        if (document.querySelector('.complexes-container')) {
            window.formManager = new FormManager();
            initChoiceBuildings();
        }
    }
});
