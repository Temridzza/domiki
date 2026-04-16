<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Главная страница
Route::get('/', function () {
    return view('index');
});

// API для загрузки шаблонов
Route::get('/api/page/{page}', function ($page) {
    // Проверяем, существует ли шаблон
    $allowedPages = ['home', 'choice'];
    
    if (!in_array($page, $allowedPages)) {
        abort(404, 'Страница не найдена');
    }
    
    // Возвращаем view из папки vendor.page
    if (View::exists("vendor.page.{$page}")) {
        return view("vendor.page.{$page}");
    }
})->name('api.page');



