#!/bin/sh
#entrypoint.sh

echo "⏳ Waiting for database..."

# ждём пока БД поднимется
until php -r "
try {
    new PDO('mysql:host=db;port=3306;dbname=laravel', 'laraveluser', 'laravelpass');
} catch (Exception \$e) {
    exit(1);
}
"; do
  sleep 2
done

echo "✅ Database is ready"

cd /var/www/html

# Устанавливаем зависимости PHP (Laravel + Sanctum)
if [ ! -d "vendor" ]; then
    composer install --no-interaction --optimize-autoloader
fi

# Устанавливаем Sanctum если не установлен
if ! composer show | grep laravel/sanctum >/dev/null 2>&1; then
    composer require laravel/sanctum
fi

# Миграции
php artisan migrate --force

# Таблица сессий
php artisan session:table || true

# Очистка кешей
php artisan config:clear
php artisan cache:clear

exec "$@"