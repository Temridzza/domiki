<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ApartmentType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

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
     *                 required={"apartment_type_id","floor"},
     *
     *                 @OA\Property(property="apartment_type_id", type="integer", example=1),
     *                 @OA\Property(property="floor", type="integer", example=5),
     *                 @OA\Property(property="price", type="integer", example=120000, nullable=true),
     *
     *                 @OA\Property(
     *                     property="is_hot_offer",
     *                     type="boolean",
     *                     example=true,
     *                     description="Горячее предложение"
     *                 ),
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
     *                 @OA\Property(property="price", type="integer", example=120000),
     *                 @OA\Property(property="is_hot_offer", type="boolean", example=true),
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

            'price' => 'nullable|integer|min:0',

            'is_hot_offer' => 'nullable|boolean',

            'status' => 'nullable|in:available,reserved,sold',

            'layout_image' => 'nullable|image|max:2048',
        ]);

        $apartmentType = ApartmentType::findOrFail($data['apartment_type_id']);

        if (!isset($data['price'])) {
            $data['price'] = $apartmentType->base_price;
        }

        $data['is_hot_offer'] = $data['is_hot_offer'] ?? false;

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
     *         name="is_hot_offer",
     *         in="query",
     *         required=false,
     *         description="Фильтр по горячим предложениям",
     *         @OA\Schema(type="boolean", example=true)
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
     *                     @OA\Property(property="price", type="integer", example=120000),
     *                     @OA\Property(property="is_hot_offer", type="boolean", example=true),
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
        ApartmentType::findOrFail($apartmentTypeId);

        $query = Apartment::where('apartment_type_id', $apartmentTypeId);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('floor')) {
            $query->where('floor', $request->floor);
        }

        if ($request->has('is_hot_offer')) {
            $query->where('is_hot_offer', filter_var($request->is_hot_offer, FILTER_VALIDATE_BOOLEAN));
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
     *                 @OA\Property(property="price", type="integer", example=5500000),
     *
     *                 @OA\Property(
     *                     property="is_hot_offer",
     *                     type="boolean",
     *                     example=true
     *                 ),
     *
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
     *                 @OA\Property(property="is_hot_offer", type="boolean", example=true),
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

            'price' => 'nullable|integer|min:0',

            'is_hot_offer' => 'sometimes|boolean',

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

    /**
     * @OA\Get(
     *     path="/api/apartments/hot-offer/random",
     *     summary="Получить случайное горячее предложение",
     *     tags={"Apartments"},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Случайное горячее предложение",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="apartment_type_id", type="integer", example=1),
     *                 @OA\Property(property="floor", type="integer", example=5),
     *                 @OA\Property(property="price", type="integer", example=120000),
     *                 @OA\Property(property="is_hot_offer", type="boolean", example=true),
     *                 @OA\Property(property="status", type="string", example="available"),
     *                 @OA\Property(property="layout_image", type="string", example="apartments/image.png")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Горячие предложения не найдены"
     *     )
     * )
     */
    public function randomHotOffer(): JsonResponse
    {
        $apartment = Apartment::where('is_hot_offer', true)
            ->where('status', 'available')
            ->inRandomOrder()
            ->first();

        if (!$apartment) {
            return response()->json([
                'message' => 'Hot offers not found'
            ], 404);
        }

        return response()->json([
            'data' => $apartment
        ]);
    }
}