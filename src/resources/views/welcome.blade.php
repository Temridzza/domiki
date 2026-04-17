<?php
// Определяем, какая вкладка активна (для переключения контента в центре)
$action = isset($_GET['action']) ? $_GET['action'] : 'dashboard';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель администратора</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: #f4f7fc;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* ===== ЛЕВОЕ МЕНЮ (САЙДБАР) ===== */
        .sidebar {
            width: 280px;
            background: #1e293b;
            color: #e2e8f0;
            display: flex;
            flex-direction: column;
            box-shadow: 4px 0 15px rgba(0,0,0,0.05);
        }

        .sidebar-header {
            padding: 25px 20px;
            border-bottom: 1px solid #334155;
        }

        .sidebar-header h2 {
            font-weight: 500;
            font-size: 1.5rem;
            color: #f8fafc;
        }

        .sidebar-header p {
            font-size: 0.8rem;
            color: #94a3b8;
            margin-top: 5px;
        }

        .menu {
            flex: 1;
            padding: 20px 0;
        }

        .menu-item {
            display: block;
            padding: 14px 25px;
            color: #cbd5e1;
            text-decoration: none;
            transition: all 0.2s ease;
            border-left: 4px solid transparent;
            margin-bottom: 5px;
        }

        .menu-item i {
            margin-right: 12px;
            width: 20px;
            text-align: center;
        }

        .menu-item:hover {
            background: #334155;
            color: #ffffff;
        }

        .menu-item.active {
            background: #0f172a;
            color: #38bdf8;
            border-left: 4px solid #38bdf8;
        }

        .menu-footer {
            padding: 20px 25px;
            border-top: 1px solid #334155;
            font-size: 0.9rem;
            color: #64748b;
        }

        /* ===== ОСНОВНАЯ ОБЛАСТЬ ===== */
        .main-content {
            flex: 1;
            overflow-y: auto;
            padding: 30px 40px;
            background: #f8fafc;
        }

        .content-header {
            margin-bottom: 30px;
        }

        .content-header h1 {
            font-size: 2rem;
            font-weight: 400;
            color: #1e293b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 15px;
        }

        /* Стили для форм добавления (центральный блок) */
        .form-container {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
            padding: 30px;
            max-width: 700px;
            border: 1px solid #e2e8f0;
        }

        .form-group {
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #334155;
            font-size: 0.9rem;
        }

        input, textarea, select {
            width: 100%;
            padding: 12px 16px;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: border 0.2s;
            background: #fafcff;
        }

        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #38bdf8;
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }

        button {
            background: #1e293b;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        button:hover {
            background: #0f172a;
        }

        .info-message {
            margin-top: 20px;
            padding: 15px;
            background: #e6f7ff;
            border-radius: 12px;
            color: #0077b6;
            border-left: 4px solid #38bdf8;
        }

        /* Утилиты */
        .text-muted {
            color: #64748b;
        }
        .mt-4 {
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <!-- ЛЕВОЕ МЕНЮ -->
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>Admin Panel</h2>
            <p>Версия 2.0 · Управление</p>
        </div>
        <div class="menu">
            <a href="?action=add_user" class="menu-item <?= $action == 'add_user' ? 'active' : '' ?>">
                <i>👤</i> Добавить пользователя
            </a>
            <a href="?action=add_product" class="menu-item <?= $action == 'add_product' ? 'active' : '' ?>">
                <i>🏠</i> Добавить Новостройку
            </a>
            <a href="?action=settings" class="menu-item <?= $action == 'settings' ? 'active' : '' ?>">
                <i>⚙️</i> Настройки
            </a>
        </div>
        <div class="menu-footer">
            <i>🔒</i> Администратор
        </div>
    </div>

    <!-- ЦЕНТРАЛЬНАЯ ОБЛАСТЬ ДЛЯ ДОБАВЛЕНИЯ ИНФОРМАЦИИ -->
    <div class="main-content">
        <div class="content-header">
            <h1>
                <?php
                    switch ($action) {
                        case 'add_user': echo '👥 Добавить пользователя'; break;
                        case 'add_product': echo '🏠 Добавить Новостройку'; break;
                        case 'settings': echo '⚙️ Настройки системы'; break;
                        default: echo '📋 Панель управления';
                    }
                ?>
            </h1>
        </div>

        <!-- Динамический контент в зависимости от выбранного пункта меню -->

        <?php if ($action == 'add_user'): ?>
            <div class="form-container">
                <form method="post" action="">
                    <div class="form-group">
                        <label>Имя пользователя</label>
                        <input type="text" name="username" placeholder="Логин" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="user@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>Роль</label>
                        <select name="role">
                            <option>Редактор</option>
                            <option>Администратор</option>
                            <option>Подписчик</option>
                        </select>
                    </div>
                    <button type="submit">👤 Создать пользователя</button>
                </form>
                <div class="info-message mt-4">
                    <?php
                        if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action == 'add_user') {
                            echo "👋 Пользователь " . htmlspecialchars($_POST['username'] ?? '') . " добавлен (демо).";
                        } else {
                            echo "Введите данные нового пользователя.";
                        }
                    ?>
                </div>
            </div>
        <?php elseif ($action == 'add_product'): ?>
            <div class="form-container">
                <form method="post" action="">
                    <div class="form-group">
                        <label>Название товара</label>
                        <input type="text" name="product_name" placeholder="Название">
                    </div>
                    <div class="form-group">
                        <label>Цена (₽)</label>
                        <input type="number" name="price" step="0.01" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea rows="3" name="description" placeholder="Краткое описание..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea rows="3" name="description" placeholder="Краткое описание..."></textarea>
                    </div>
                    <button type="submit">🏠 Добавить Новостройку</button>
                </form>
                <div class="info-message mt-4">
                    <?= ($_SERVER['REQUEST_METHOD'] === 'POST' && $action == 'add_product') ? "📦 Товар добавлен." : "Заполните информацию о товаре." ?>
                </div>
            </div>
        <?php elseif ($action == 'settings'): ?>
            <div class="form-container">
                <p>🔧 Здесь можно изменить глобальные параметры сайта.</p>
                <div class="form-group">
                    <label>Название сайта</label>
                    <input type="text" value="My Awesome Site">
                </div>
                <button>Сохранить настройки</button>
            </div>
        <?php endif; ?>

    </div>
</body>
</html>
