<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;
use App\Models\NewBuilding;
use App\Models\District;

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

    public function store(Request $request, string $slug): JsonResponse
    {
        // Валидация
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'completion_date' => 'nullable|string|max:255',
            'advantages' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'developer_pdf' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        // 🔹 получаем id района
        $districtId = District::where('slug', $slug)->value('id');

        if (!$districtId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Район не найден'
            ], 404);
        }

        $data['district_id'] = $districtId;

        // 📸 загрузка изображения
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('new-buildings', 'public');
        } else {
            $data['image'] = 'default.png';
        }

        // 📄 загрузка PDF
        if ($request->hasFile('developer_pdf')) {
            $data['developer_pdf'] = $request->file('developer_pdf')->store('pdf', 'public');
        }

        // Создание записи
        $newBuilding = NewBuilding::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Новостройка создана',
            'data' => $newBuilding
        ], 201);
    }

    
}
