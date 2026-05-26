import { initRecordsDistricts } from './records/records-districts';
import { initRecordsTypes } from './records/records-types';
import { initRecordsBuildings } from './records/records-buildings';
import { initRecordsFlats } from './records/records-flats';
import { initRecordsUsers } from './records/records-users';

let adminToken = null;
let isSuperAdmin = false;   

export function initAdminPanel(token, superAdminFlag = false) {
    adminToken = token;
    isSuperAdmin = superAdminFlag;

    const loginOverlay = document.getElementById('loginOverlay');
    const adminContent = document.querySelector('.admin-panel-content');

    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';

    const menuItems = document.querySelectorAll('.admin-menu__item');
    const panes = document.querySelectorAll('.admin-menu__pane');

    // Скрываем пункты, требующие прав супер-администратора
    menuItems.forEach(item => {
        const requiredRole = item.getAttribute('data-role');
        if (requiredRole === 'super' && !isSuperAdmin) {
            item.style.display = 'none';
        }
    });

    function switchTab(tabId) {
        panes.forEach(pane => pane.classList.remove('admin-menu__pane--active'));
        const activePane = document.getElementById(tabId);
        if (activePane) activePane.classList.add('admin-menu__pane--active');

        menuItems.forEach(item => {
            const itemTab = item.getAttribute('data-tab');
            if (itemTab === tabId) {
                item.classList.add('admin-menu__item--active');
            } else {
                item.classList.remove('admin-menu__item--active');
            }
        });

        if (tabId === 'recordsDistricts') {
            initRecordsDistricts(adminToken);
        } else if (tabId === 'recordsTypes') {
            initRecordsTypes(adminToken);
        } else if (tabId === 'recordsBuildings') {
            initRecordsBuildings(adminToken);
        } else if (tabId === 'recordsFlats') {
            // Обычный администратор работает с квартирами (без флага super)
            initRecordsFlats(adminToken);
        } else if (tabId === 'recordsUsers') {
            // Только супер-админ видит и использует этот модуль
            initRecordsUsers(adminToken, isSuperAdmin);
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });

    if (menuItems.length) {
        const firstTab = menuItems[0].getAttribute('data-tab');
        if (firstTab) switchTab(firstTab);
    }
}
