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
    return view('page.home'); 
})->name('home');

Route::get('/home', function () {
    return view('page.home'); 
})->name('home');

// Страница выбора
Route::get('/сhoice', function () {
    return view('page.сhoice'); 
})->name('сhoice');
