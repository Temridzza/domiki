export async function fetchAndUpdateTotalCount(slug) {
    const totalElement = document.getElementById('totalApartmentsCount');
    if (!totalElement) return;

    try {
        const response = await fetch(`/api/districts/${slug}/new-buildings`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const total = data.meta?.total ?? 0;
        totalElement.textContent = total;
    } catch (error) {
        console.error('Ошибка при получении количества новостроек:', error);
        totalElement.textContent = '—';
    }
}
