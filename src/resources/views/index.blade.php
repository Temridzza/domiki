<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Шаблоны страниц</title>

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
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
        
    <script src="{{ asset('js/index-code.js') }}"></script>
</body>
</html>
