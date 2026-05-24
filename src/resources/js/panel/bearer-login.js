
export async function testAdminBearer(token = null) {
    // Если токен не передан или пустая строка — сразу false (без запроса)
    if (!token || typeof token !== 'string' || token.trim() === '') {
        console.warn('Токен не предоставлен или пуст');
        return false;
    }

    try {
        const response = await fetch(`/api/admin-test`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.trim()}`,
                'Content-Type': 'application/json'
            }
        });

        // Если статус не 2xx (например, 401, 403, 500) — считаем ошибкой авторизации
        if (!response.ok) {
            console.error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
            return false;
        }

        const data = await response.json();

        // Проверяем, что поле message существует и равно 'вы админ'
        if (data && data.message === 'вы админ') {
            // console.log(`✅ Токен принят: ${token}`);
            return true;
        } else {
            // console.warn('❌ Токен недействителен или пользователь не админ');
            return false;
        }
    } catch (error) {
        // Сетевая ошибка, невалидный JSON и т.п.
        console.error('Ошибка при проверке токена:', error);
        return false;
    }
}
