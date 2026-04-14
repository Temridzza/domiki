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

// Корневой маршрут - показывает welcome.blade.php
Route::get('/', function () {
    return view('welcome');
});

// Если нужен отдельный маршрут для главной страницы
Route::get('/home', function () {
    return view('home.index');
})->name('home');
