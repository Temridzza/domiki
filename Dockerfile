#Dockerfile
FROM php:8.4-apache

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl libonig-dev && \
    docker-php-ext-install pdo pdo_mysql mbstring zip && \
    a2enmod rewrite

# Указываем правильную папку Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf

# Копируем проект
COPY src/ /var/www/html/

# Права
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["apache2-foreground"]