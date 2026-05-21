<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ApartmentType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApartmentController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/apartments",
     *     summary="Создать квартиру (только админ)",
     *     tags={"Apartments"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"apartment_type_id","floor","entrance","number"},
     *
     *                 @OA\Property(property="apartment_type_id", type="integer", example=1),
     *                 @OA\Property(property="floor", type="integer", example=5),
     *                 @OA\Property(property="entrance", type="integer", example=2),
     *                 @OA\Property(property="number", type="string", example="45A"),
     *                 @OA\Property(property="price", type="integer", example=120000, nullable=true),
     *
     *                 @OA\Property(
     *                     property="status",
     *                     type="string",
     *                     enum={"available","reserved","sold"},
     *                     example="available"
     *                 ),
     *
     *                 @OA\Property(
     *                     property="layout_image",
     *                     type="string",
     *                     format="binary"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Квартира создана",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Apartment created successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="apartment_type_id", type="integer", example=1),
     *                 @OA\Property(property="floor", type="integer", example=5),
     *                 @OA\Property(property="entrance", type="integer", example=2),
     *                 @OA\Property(property="number", type="string", example="45A"),
     *                 @OA\Property(property="price", type="integer", example=120000),
     *                 @OA\Property(property="status", type="string", example="available"),
     *                 @OA\Property(property="layout_image", type="string", example="apartments/image.png")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Не авторизован"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'apartment_type_id' => 'required|exists:apartment_types,id',

            'floor' => 'required|integer|min:1',
            'entrance' => 'required|integer|min:1',
            'number' => 'required|string|max:50',

            'price' => 'nullable|integer|min:0',

            'status' => 'nullable|in:available,reserved,sold',

            'layout_image' => 'nullable|image|max:2048',
        ]);

        $apartmentType = ApartmentType::findOrFail($data['apartment_type_id']);

        if (!isset($data['price'])) {
            $data['price'] = $apartmentType->base_price;
        }

        if ($request->hasFile('layout_image')) {
            $data['layout_image'] = $request->file('layout_image')
                ->store('apartments', 'public');
        }

        $apartment = Apartment::create($data);

        return response()->json([
            'message' => 'Apartment created successfully',
            'data' => $apartment
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/apartment-types/{id}/apartments",
     *     summary="Получить квартиры по типу (с фильтрами и сортировкой)",
     *     tags={"Apartments"},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID типа квартиры",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         required=false,
     *         description="Фильтр по статусу",
     *         @OA\Schema(type="string", enum={"available","reserved","sold"})
     *     ),
     *
     *     @OA\Parameter(
     *         name="floor",
     *         in="query",
     *         required=false,
     *         description="Фильтр по этажу",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Parameter(
     *         name="min_price",
     *         in="query",
     *         required=false,
     *         description="Минимальная цена",
     *         @OA\Schema(type="integer", example=100000)
     *     ),
     *
     *     @OA\Parameter(
     *         name="max_price",
     *         in="query",
     *         required=false,
     *         description="Максимальная цена",
     *         @OA\Schema(type="integer", example=200000)
     *     ),
     *
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         required=false,
     *         description="Поле для сортировки (например price, floor)",
     *         @OA\Schema(type="string", example="price")
     *     ),
     *
     *     @OA\Parameter(
     *         name="direction",
     *         in="query",
     *         required=false,
     *         description="Направление сортировки",
     *         @OA\Schema(type="string", enum={"asc","desc"}, example="asc")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список квартир",
     *         @OA\JsonContent(
     *             @OA\Property(property="count", type="integer", example=10),
     *
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="apartment_type_id", type="integer", example=1),
     *                     @OA\Property(property="floor", type="integer", example=5),
     *                     @OA\Property(property="entrance", type="integer", example=2),
     *                     @OA\Property(property="number", type="string", example="45A"),
     *                     @OA\Property(property="price", type="integer", example=120000),
     *                     @OA\Property(property="status", type="string", example="available"),
     *                     @OA\Property(property="layout_image", type="string", example="apartments/image.png")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Тип квартиры не найден"
     *     )
     * )
     */
    public function indexByType(Request $request, int $apartmentTypeId)
    {
        $type = ApartmentType::findOrFail($apartmentTypeId);

        $query = Apartment::where('apartment_type_id', $apartmentTypeId);

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

    /**
     * @OA\Post(
     *     path="/api/apartments/{id}",
     *     summary="Обновить квартиру (только админ)",
     *     tags={"Apartments"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="apartment_type_id", type="integer", example=1),
     *                 @OA\Property(property="floor", type="integer", example=5),
     *                 @OA\Property(property="entrance", type="integer", example=2),
     *                 @OA\Property(property="number", type="string", example="45A"),
     *                 @OA\Property(property="price", type="integer", example=5500000),
     *                 @OA\Property(property="status", type="string", example="available"),
     *
     *                 @OA\Property(
     *                     property="layout_image",
     *                     type="string",
     *                     format="binary"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Квартира обновлена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Apartment updated"),
     *             @OA\Property(
     *                 property="apartment",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="floor", type="integer", example=5),
     *                 @OA\Property(property="price", type="integer", example=5500000),
     *                 @OA\Property(property="status", type="string", example="available"),
     *                 @OA\Property(property="layout_image", type="string", example="apartments/image.png")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(response=422, description="Ошибка валидации"),
     *     @OA\Response(response=401, description="Не авторизован"),
     *     @OA\Response(response=404, description="Не найдено")
     * )
     */
    public function update(Request $request, $id)
    {
        $apartment = Apartment::findOrFail($id);

        $data = $request->validate([
            'apartment_type_id' => 'sometimes|exists:apartment_types,id',
            'floor' => 'sometimes|integer|min:1',
            'entrance' => 'sometimes|integer|min:1',
            'number' => 'sometimes|string|max:50',

            'price' => 'nullable|integer|min:0',

            'status' => 'sometimes|in:available,reserved,sold',

            'layout_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('layout_image')) {

            if ($apartment->layout_image) {
                Storage::disk('public')->delete($apartment->layout_image);
            }

            $data['layout_image'] = $request->file('layout_image')
                ->store('apartments', 'public');
        }

        $apartment->update($data);

        return response()->json([
            'message' => 'Apartment updated',
            'apartment' => $apartment
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/apartments/{id}",
     *     summary="Удалить квартиру (только админ)",
     *     tags={"Apartments"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *
     *     @OA\Response(response=200, description="Удалено"),
     *     @OA\Response(response=404, description="Не найдено")
     * )
     */
    public function destroy($id)
    {
        $apartment = Apartment::findOrFail($id);

        if ($apartment->layout_image) {
            Storage::disk('public')->delete($apartment->layout_image);
        }

        $apartment->delete();

        return response()->json([
            'message' => 'Apartment deleted'
        ]);
    }
}