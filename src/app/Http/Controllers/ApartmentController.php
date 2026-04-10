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
}