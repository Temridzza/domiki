<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* я хз зачем тут это, нам не надо
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
*/


// получение всех записей
use App\Http\Controllers\DistrictController;
Route::get('/districts', [DistrictController::class, 'index']);

use App\Http\Controllers\NewBuildingController;
Route::get('/new-buildings', [NewBuildingController::class, 'index']);

// new-buildings byDistrict
Route::get('/districts/{slug}/new-buildings', [NewBuildingController::class, 'byDistrict']);

// создание записей под админом
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::post('/districts', [DistrictController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::post('/new-buildings', [NewBuildingController::class, 'store']);
});

# dev
Route::middleware(['auth:sanctum', 'is_admin'])->post('/admin-test', function (Request $request) {
    return response()->json(['message' => 'вы админ']);
});
