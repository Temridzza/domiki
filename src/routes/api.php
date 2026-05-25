<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\DistrictController;
use App\Http\Controllers\NewBuildingController;
use App\Http\Controllers\ApartmentTypeController;
use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


// получение записей
Route::get('/districts', [DistrictController::class, 'index']);
Route::get('/new-buildings', [NewBuildingController::class, 'index']);
Route::get('/districts/{slug}/new-buildings', [NewBuildingController::class, 'byDistrict']);
Route::get('/buildings/{buildingId}/apartment-types', [ApartmentTypeController::class, 'byBuilding']);
Route::get('/apartment-types/{id}/apartments', [ApartmentController::class, 'indexByType']);
// все новостройки
Route::get('/catalog', [Controller::class, 'districtsWithBuildings']);

// авторизация
Route::post('/login', [AuthController::class, 'login']);

// получение горячего предложения выбранное случайно
Route::get('/apartments/hot-offer/random', [ApartmentController::class, 'randomHotOffer']);

// создание записей под админом
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::post('/districts', [DistrictController::class, 'store']); 
    Route::post('/districts/{slug}/new-buildings', [NewBuildingController::class, 'store']);
    Route::post('/apartment-types', [ApartmentTypeController::class, 'store']);
    Route::post('/apartments', [ApartmentController::class, 'store']);
});

// обновление под админом
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::put('/districts/{id}', [DistrictController::class, 'update']);
    Route::put('/new-buildings/{id}', [NewBuildingController::class, 'update']);
    Route::put('/apartment-types/{id}', [ApartmentTypeController::class, 'update']);
    Route::put('/apartments/{id}', [ApartmentController::class, 'update']);
});

// удаление под админом
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::delete('/districts/{id}', [DistrictController::class, 'destroy']);
    Route::delete('/new-buildings/{id}', [NewBuildingController::class, 'destroy']);
    Route::delete('/apartment-types/{id}', [ApartmentTypeController::class, 'destroy']);
    Route::delete('/apartments/{id}', [ApartmentController::class, 'destroy']);
});

// отправка на почту
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::post('/contact', [ContactController::class, 'send']);
});

Route::middleware(['auth:sanctum', 'is_superAdmin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});


# dev
Route::middleware(['auth:sanctum', 'is_admin'])->post('/admin-test', function (Request $request) {
    return response()->json(['message' => 'вы админ']);
});
Route::middleware(['auth:sanctum', 'is_superAdmin'])->post('/superAdmin-test', function (Request $request) {
    return response()->json(['message' => 'вы superадмин']);
});
