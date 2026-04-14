<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>@yield('title', 'Новостройки в Ярославле')</title>
    <meta name="description" content="@yield('description', 'Новостройки в Ярославле — поиск и покупка квартир')">
    <meta name="keywords" content="@yield('keywords', 'застройщик, ипотека, скидки')">
    
    <link href="{{ asset('images/favicon.png') }}" rel="icon" type="image/png">
    <link href="{{ asset('stylesheets/style.css') }}" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
    @stack('styles')
</head>
<body>
    <p>Выберите район - test</p>
</body>
</html>
