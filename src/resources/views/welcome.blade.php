<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>
        <link href="{{ asset('css/style.css') }}" rel="stylesheet" type="text/css" />

    </head>
    <body>
    <div class="site-wrapper">
        <!-- Верхняя панель с логотипом и бургером -->
        <div class="top-bar">
            <div class="container">
                <div class="logo-area">
                    <div class="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="white" stroke="#2c7da0" stroke-width="1.2" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="2.5" fill="#FFD966" stroke="#b97f10" stroke-width="0.8"/>
                        </svg>
                    </div>
                    <span class="logo-text">NORTHWIND</span>
                </div>
                <div class="burger-btn" id="burgerBtn">
                    <div class="burger-line"></div>
                    <div class="burger-line"></div>
                    <div class="burger-line"></div>
                </div>
            </div>
        </div>
    </div>
    </body>
</html>
