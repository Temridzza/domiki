<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApartmentType;
use Illuminate\Support\Facades\Storage;

class ApartmentTypeController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/buildings/{buildingId}/apartment-types",
     *     summary="Получить типы квартир по зданию",
     *     tags={"ApartmentTypes"},
     *
     *     @OA\Parameter(
     *         name="buildingId",
     *         in="path",
     *         required=true,
     *         description="ID здания",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список типов квартир",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="building_id", type="integer", example=1),
     *                 @OA\Property(property="area", type="integer", example=45),
     *                 @OA\Property(property="base_price", type="integer", example=120000),
     *                 @OA\Property(property="rooms", type="integer", example=2),
     *
     *                 @OA\Property(
     *                     property="available_count",
     *                     type="integer",
     *                     example=5
     *                 ),
     *
     *                 @OA\Property(
     *                     property="layouts",
     *                     type="array",
     *                     @OA\Items(type="string", example="/storage/layouts/plan1.png")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function byBuilding($buildingId)
    {
        $types = ApartmentType::where('building_id', $buildingId)
            ->whereHas('apartments', function ($q) {
                $q->where('status', 'available');
            })
            ->with([
                'apartments' => function ($q) {
                    $q->where('status', 'available')
                        ->select(
                            'id',
                            'apartment_type_id',
                            'layout_image'
                        );
                }
            ])
            ->withCount([
                'apartments as available_count' => function ($q) {
                    $q->where('status', 'available');
                }
            ])
            ->get();

        $result = $types->map(function ($type) {
            return [
                'id' => $type->id,
                'building_id' => $type->building_id,
                'area' => $type->area,
                'base_price' => $type->base_price,
                'rooms' => $type->rooms,

                'available_count' => $type->available_count,

                // все уникальные планировки из apartments
                'layouts' => $type->apartments
                    ->pluck('layout_image')
                    ->filter()
                    ->unique()
                    ->values(),
            ];
        });

        return response()->json($result);
    }

    /**
     * @OA\Post(
     *     path="/api/apartment-types",
     *     summary="Создать тип квартиры",
     *     tags={"ApartmentTypes"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"building_id","area","base_price","rooms"},
     *
     *             @OA\Property(property="building_id", type="integer", example=1),
     *             @OA\Property(property="area", type="integer", example=45),
     *             @OA\Property(property="base_price", type="integer", example=120000),
     *             @OA\Property(property="rooms", type="integer", example=2)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Тип квартиры создан"
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'building_id' => 'required|exists:new_buildings,id',
            'area' => 'required|integer|min:1',
            'base_price' => 'required|integer|min:0',
            'rooms' => 'required|integer|min:1',
        ]);

        $apartmentType = ApartmentType::create($data);

        return response()->json($apartmentType, 201);
    }

    /**
     * @OA\Post(
     *     path="/api/apartment-types/{id}",
     *     summary="Обновить тип квартиры",
     *     tags={"ApartmentTypes"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="building_id", type="integer", example=1),
     *             @OA\Property(property="area", type="integer", example=45),
     *             @OA\Property(property="base_price", type="integer", example=5000000),
     *             @OA\Property(property="rooms", type="integer", example=2)
     *         )
     *     ),
     *
     *     @OA\Response(response=200, description="Обновлено"),
     *     @OA\Response(response=404, description="Не найдено")
     * )
     */
    public function update(Request $request, $id)
    {
        $type = ApartmentType::findOrFail($id);

        $data = $request->validate([
            'building_id' => 'sometimes|exists:new_buildings,id',
            'area' => 'sometimes|integer|min:1',
            'base_price' => 'sometimes|integer|min:0',
            'rooms' => 'sometimes|integer|min:0',
        ]);

        $type->update($data);

        return response()->json([
            'message' => 'Apartment type updated',
            'apartment_type' => $type
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/apartment-types/{id}",
     *     summary="Удалить тип квартиры",
     *     tags={"ApartmentTypes"},
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
        $type = ApartmentType::findOrFail($id);

        $type->delete();

        return response()->json([
            'message' => 'Apartment type deleted'
        ]);
    }
}