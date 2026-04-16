// Функция загрузки страницы
        function loadPage(pageName) {
            // Обновляем URL без перезагрузки
            const url = new URL(window.location.href);
            url.searchParams.set('page', pageName);
            window.history.pushState({}, '', url);
            
            // Обновляем активный класс в навигации
            document.querySelectorAll('.nav ul li a').forEach(link => {
                link.classList.remove('active');
                if(link.textContent.toLowerCase().includes(pageName)) {
                    link.classList.add('active');
                }
            });
            
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

        // test
        function selectPlan(plan) {
            const messageDiv = document.getElementById('selection-message');
            messageDiv.style.display = 'block';
            messageDiv.style.background = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
            messageDiv.innerHTML = `✅ Спасибо! Вы выбрали тариф "${plan}". Наш менеджер свяжется с вами в ближайшее время.`;
            
            // Прокрутка к сообщению
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Скрыть сообщение через 5 секунд
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
