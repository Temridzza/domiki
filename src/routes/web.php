<?php
// Страницы
use Illuminate\Support\Facades\Route;
// Изображения
use Illuminate\Support\Facades\Storage;

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

// Домашняя страница
Route::get('/', function () {
    return view('page.home'); 
})->name('home');

Route::get('/home', function () {
    return view('page.home'); 
})->name('home');

// Страница выбора
Route::get('/сhoice/{slug}&{name}', function ($slug, $name) {
    // slug в представление
    return view('page.сhoice', [
        'districtSlug' => $slug,
        'districtName' => $name,
    ]);
})->name('сhoice');

// Панель управления
Route::get('/panel', function () {
    return view('page.panel');
})->name('panel');

Route::post('/admin/{token}', function ($token) {
    return view('page.сhoice', [
        'TokenUse' => $token
    ]);
})->name('admin');

// image
Route::get('/storage/{path}', function ($path) {
    // Проверяем существование файла в storage/app/public
    if (Storage::disk('public')->exists($path)) {
        // Возвращаем файл с правильным MIME-типом
        return response()->file(Storage::disk('public')->path($path));
    }
    
    // Если файл не найден
    return response()->file(public_path('images/default.png'));
})->where('path', '.*');
