// Функция загрузки страницы
        function loadPage(pageName) {
            // Обновляем URL без перезагрузки
            const url = new URL(window.location.href);
            url.searchParams.set('page', pageName);
            window.history.pushState({}, '', url);
            
            // Показываем загрузку
            const contentDiv = document.getElementById('page-content');
            contentDiv.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    Загрузка...
                </div>
            `;
            
            // Загружаем контент через AJAX
            fetch(`/api/page/${pageName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Страница не найдена');
                    }
                    return response.text();
                })
                .then(html => {
                    contentDiv.innerHTML = html;
                })
                .catch(error => {
                    contentDiv.innerHTML = `
                        <div class="error">
                            <h2>❌ Ошибка</h2>
                            <p>${error.message}</p>
                        </div>
                    `;
                });
        }
        
        // Загружаем страницу при загрузке
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page') || 'home';
            loadPage(page);
        });
        
        // Обрабатываем кнопки назад/вперед
        window.addEventListener('popstate', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page') || 'home';
            loadPage(page);
        });
