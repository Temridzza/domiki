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

    public function byDistrict(Request $request, string $slug): JsonResponse
    {
        $perPage = $request->get('per_page', 10); // сколько элементов на страницу

        $newBuildings = NewBuilding::whereHas('district', function ($query) use ($slug) {
            $query->where('slug', $slug);
        })
        ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $newBuildings->items(), // сами записи
            'meta' => [
                'current_page' => $newBuildings->currentPage(),
                'last_page' => $newBuildings->lastPage(),
                'per_page' => $newBuildings->perPage(),
                'total' => $newBuildings->total(),
            ]
        ]);
    }
}
