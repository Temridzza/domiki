<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DistrictController;
use App\Http\Controllers\NewBuildingController;
use App\Http\Controllers\ApartmentTypeController;
use App\Http\Controllers\ApartmentController;

// получение записей
Route::get('/districts', [DistrictController::class, 'index']);
Route::get('/new-buildings', [NewBuildingController::class, 'index']);
Route::get('/districts/{slug}/new-buildings', [NewBuildingController::class, 'byDistrict']);
Route::get('/buildings/{buildingId}/apartment-types', [ApartmentTypeController::class, 'byBuilding']);
Route::get('/apartment-types/{id}/apartments', [ApartmentController::class, 'indexByType']);

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
});

// удаление под админом
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::delete('/districts/{id}', [DistrictController::class, 'destroy']);
    Route::delete('/new-buildings/{id}', [NewBuildingController::class, 'destroy']);
});


# dev
Route::middleware(['auth:sanctum', 'is_admin'])->post('/admin-test', function (Request $request) {
    return response()->json(['message' => 'вы админ']);
});
