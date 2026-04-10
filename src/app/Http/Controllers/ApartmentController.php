<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ApartmentType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApartmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // 1. Валидация
        $data = $request->validate([
            'apartment_type_id' => 'required|exists:apartment_types,id',

            'floor' => 'required|integer|min:1',
            'entrance' => 'required|integer|min:1',
            'number' => 'required|string|max:50',

            'price' => 'nullable|integer|min:0',

            'status' => 'nullable|in:available,reserved,sold',
        ]);

        // 2. Получаем тип квартиры
        $apartmentType = ApartmentType::findOrFail($data['apartment_type_id']);

        // 3. Если цена не указана — берём базовую
        if (!isset($data['price'])) {
            $data['price'] = $apartmentType->base_price;
        }

        // 4. Создание квартиры
        $apartment = Apartment::create($data);

        return response()->json([
            'message' => 'Apartment created successfully',
            'data' => $apartment
        ], 201);
    }

    public function indexByType(Request $request, int $apartmentTypeId)
    {
        // проверим, что тип существует
        $type = \App\Models\ApartmentType::findOrFail($apartmentTypeId);

        $query = \App\Models\Apartment::where('apartment_type_id', $apartmentTypeId);

        // 🔍 фильтры (по желанию)
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('floor')) {
            $query->where('floor', $request->floor);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // сортировка (например по цене)
        if ($request->has('sort')) {
            $direction = $request->get('direction', 'asc');
            $query->orderBy($request->sort, $direction);
        }

        $apartments = $query->get();

        return response()->json([
            'count' => $apartments->count(),
            'data' => $apartments,
        ]);
    }
}