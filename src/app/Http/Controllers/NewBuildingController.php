<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;
use App\Models\NewBuilding;

class NewBuildingController extends Controller
{
    public function index(): JsonResponse
    {
        // Получаем все новостройки с данными о районе
        $newBuildings = NewBuilding::with('district')->get();

        return response()->json([
            'status' => 'success',
            'data' => $newBuildings
        ]);
    }
}
