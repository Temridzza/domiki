import { initRecordsDistricts } from './records/records-districts';

let adminToken = null;

export function initAdminPanel(token) {
    adminToken = token;

    const loginOverlay = document.getElementById('loginOverlay');
    const adminContent = document.querySelector('.admin-panel-content');

    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';

    const menuItems = document.querySelectorAll('.admin-menu__item');
    const panes = document.querySelectorAll('.admin-menu__pane');

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

        // Если переключились на вкладку районов – инициализируем интерфейс
        if (tabId === 'recordsDistricts') {
            initRecordsDistricts(adminToken);
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });

    // Активируем первую вкладку (районы)
    if (menuItems.length) {
        const firstTab = menuItems[0].getAttribute('data-tab');
        if (firstTab) switchTab(firstTab);
    }
}
