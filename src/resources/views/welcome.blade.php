<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <title>HOME</title>
        
        <!-- Шрифты -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        
        <!-- Vite CSS -->
        @vite('resources/css/app.css')
    </head>
    <body>
        <div class="container">
            <h1>Добро пожаловать в Domiki!</h1>
            <p>Это стартовая страница вашего приложения Laravel, запущенного в Docker.</p>
        </div>
        
        <!-- Vite JS -->
        @vite('resources/js/app.js')
    </body>
</html>
