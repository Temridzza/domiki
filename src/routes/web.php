<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Models\District;
use App\Http\Controllers\PageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Здесь вы можете зарегистрировать веб-маршруты для своего приложения. Эти
| маршруты загружаются RouteServiceProvider, и все они будут
| отнесены к группе промежуточного программного обеспечения "web". 
| Сделайте что-нибудь замечательное!
*/

// Домашняя страница ===============
Route::get('/', function () {
    return view('index');
})->name('home');

Route::get('/home', function () {
    return redirect()->route('home');
});
//==================================

// Страница выбора =================
Route::get('/choice/{slug}', function ($slug) {
    // Получить первую найденную запись.
    $district = District::where('slug', $slug)->firstOrFail();
    // Аргумент которые будут доступны внутри этого шаблона
    return view('page.choice', [
        'districtSlug' => $district->slug,
        'districtName' => $district->name,
    ]);
})->name('choice');

Route::get('/new-building/{id}', function ($id) {
    return view('page.new-building', ['buildingId' => $id]);
})->name('new-building.show');
//==================================

// Админ панель ====================
Route::get('/panel', function () {
    return view('page.panel');
})->name('panel');
//==================================

// Вывод изображение================
Route::get('/storage/{path}', function ($path) {
    // Проверяем существование файла в storage/app/public
    if (Storage::disk('public')->exists($path)) {
        // Возвращаем файл с правильным MIME-типом
        return response()->file(Storage::disk('public')->path($path));
    }
    // Если файл не найден
    return response()->file(public_path('images/default.png'));
})->where('path', '.*');
//==================================
