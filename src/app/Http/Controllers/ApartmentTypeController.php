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
     *     summary="Получить типы квартир по зданию (только с доступными квартирами)",
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
     *                 @OA\Property(property="layout_image", type="string", example="layouts/image.png"),
     *
     *                 @OA\Property(
     *                     property="available_count",
     *                     type="integer",
     *                     example=5,
     *                     description="Количество доступных квартир"
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function byBuilding($buildingId)
    {
        return ApartmentType::where('building_id', $buildingId)
            ->whereHas('apartments', function ($q) {
                $q->where('status', 'available');
            })
            ->withCount([
                'apartments as available_count' => function ($q) {
                    $q->where('status', 'available');
                }
            ])
            ->get();
    }

    /**
     * @OA\Post(
     *     path="/api/apartment-types",
     *     summary="Создать тип квартиры (только админ)",
     *     tags={"ApartmentTypes"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"building_id","area","base_price","rooms"},
     *
     *                 @OA\Property(property="building_id", type="integer", example=1),
     *                 @OA\Property(property="area", type="integer", example=45),
     *                 @OA\Property(property="base_price", type="integer", example=120000),
     *                 @OA\Property(property="rooms", type="integer", example=2),
     *
     *                 @OA\Property(
     *                     property="layout_image",
     *                     type="string",
     *                     format="binary",
     *                     description="Планировка квартиры"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Тип квартиры создан",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="building_id", type="integer", example=1),
     *             @OA\Property(property="area", type="integer", example=45),
     *             @OA\Property(property="base_price", type="integer", example=120000),
     *             @OA\Property(property="rooms", type="integer", example=2),
     *             @OA\Property(property="layout_image", type="string", example="layouts/image.png")
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'building_id'   => 'required|exists:new_buildings,id',
            'area'          => 'required|integer|min:1',
            'base_price'    => 'required|integer|min:0',
            'rooms'         => 'required|integer|min:1',
            'layout_image'  => 'nullable|image|max:2048',
        ]);

        // загрузка изображения
        if ($request->hasFile('layout_image')) {
            $data['layout_image'] = $request->file('layout_image')
                ->store('apartmentType', 'public');
        }

        $apartmentType = ApartmentType::create($data);

        return response()->json($apartmentType, 201);
    }

    /**
     * @OA\Post(
     *     path="/api/apartment-types/{id}",
     *     summary="Обновить тип квартиры (только админ)",
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
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"_method"},
     *
     *                 @OA\Property(property="_method", type="string", example="PUT"),
     *                 @OA\Property(property="building_id", type="integer", example=1),
     *                 @OA\Property(property="area", type="integer", example=45),
     *                 @OA\Property(property="base_price", type="integer", example=5000000),
     *                 @OA\Property(property="rooms", type="integer", example=2),
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

            'layout_image' => 'nullable|image|max:2048',
        ]);

        // 🏠 Обновление планировки
        if ($request->hasFile('layout_image')) {

            if ($type->layout_image && $type->layout_image !== 'default.png') {
                Storage::disk('public')->delete($type->layout_image);
            }

            $data['layout_image'] = $request->file('layout_image')
                ->store('apartment-types', 'public');
        }

        $type->update($data);

        return response()->json([
            'message' => 'Apartment type updated',
            'apartment_type' => $type
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/apartment-types/{id}",
     *     summary="Удалить тип квартиры (только админ)",
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

        // удаляем планировку
        if ($type->layout_image && $type->layout_image !== 'default.png') {
            Storage::disk('public')->delete($type->layout_image);
        }

        $type->delete();

        return response()->json([
            'message' => 'Apartment type deleted'
        ]);
    }
}
