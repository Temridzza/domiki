<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Шаблоны страниц</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Навигация */
        .nav {
            background: white;
            border-radius: 10px;
            padding: 15px 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav ul {
            list-style: none;
            display: flex;
            gap: 20px;
        }
        
        .nav ul li a {
            text-decoration: none;
            color: #333;
            padding: 8px 16px;
            border-radius: 5px;
            transition: all 0.3s;
            font-weight: 500;
        }
        
        .nav ul li a:hover {
            background: #667eea;
            color: white;
        }
        
        .nav ul li a.active {
            background: #667eea;
            color: white;
        }
        
        /* Контент */
        .content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            min-height: 500px;
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Загрузка */
        .loading {
            text-align: center;
            padding: 50px;
            font-size: 18px;
            color: #667eea;
        }
        
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            text-align: center;
            padding: 50px;
            color: #e74c3c;
        }
        
        /* Адаптивность */
        @media (max-width: 768px) {
            .nav ul {
                flex-direction: column;
                gap: 10px;
            }
            
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav">
            <ul>
                <li>
                    <a href="#" onclick="loadPage('home'); return false;" class="{{ request()->get('page', 'home') == 'home' ? 'active' : '' }}">
                        🏠 Главная
                    </a>
                </li>
                <li>
                    <a href="#" onclick="loadPage('choice'); return false;" class="{{ request()->get('page', 'home') == 'choice' ? 'active' : '' }}">
                        ✨ Выбор
                    </a>
                </li>
            </ul>
        </div>
        
        <div class="content" id="page-content">
            <div class="loading">
                <div class="spinner"></div>
                Загрузка...
            </div>
        </div>
    </div>
    
    <script>
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
    </script>
</body>
</html>
