<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DistrictController;
use App\Http\Controllers\NewBuildingController;
use App\Http\Controllers\ApartmentTypeController;
use App\Http\Controllers\ApartmentController;

// получение всех записей
Route::get('/districts', [DistrictController::class, 'index']);


Route::get('/new-buildings', [NewBuildingController::class, 'index']);

// new-buildings byDistrict
Route::get('/districts/{slug}/new-buildings', [NewBuildingController::class, 'byDistrict']);

// apartments byBuilding
Route::get('/buildings/{buildingId}/apartment-types', [ApartmentTypeController::class, 'byBuilding']);

// создание записей под админом
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    // создание района
    Route::post('/districts', [DistrictController::class, 'store']); 
    // создание новостройки
    Route::post('/districts/{slug}/new-buildings', [NewBuildingController::class, 'store']);
    // создание типа квартиры
    Route::post('/apartment-types', [ApartmentTypeController::class, 'store']);
    // создание квартиры
    Route::post('/apartments', [ApartmentController::class, 'store']);
});

# dev
Route::middleware(['auth:sanctum', 'is_admin'])->post('/admin-test', function (Request $request) {
    return response()->json(['message' => 'вы админ']);
});
