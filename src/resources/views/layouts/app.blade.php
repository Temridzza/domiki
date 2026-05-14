<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Основные мета-теги -->
        <meta charset="utf-8">
        <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Основные SEO-теги -->
        <title>@yield('title', 'Новостройки в Ярославле')</title>
        <meta name="description" content="@yield('description', 'Новостройки в Ярославле — поиск и покупка квартир')">
        <meta name="keywords" content="@yield('keywords', 'застройщик, ипотека, скидки')">

        <!-- Шрифты -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        
        <!-- Vite CSS -->
        @vite('resources/css/app.css')
    </head>
    <body>
        <!-- Blade content -->
        @yield('content')
        <!-- Vite JS -->
        @vite('resources/js/app.js')
    </body>
</html>
