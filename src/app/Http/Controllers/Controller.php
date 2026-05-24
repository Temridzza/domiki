<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\District;
use Illuminate\Http\JsonResponse;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;


    /**
     * @OA\Get(
     *     path="/api/catalog",
     *     summary="Получить районы с новостройками",
     *     tags={"Districts"},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список районов с новостройками",
     *         @OA\JsonContent(
     *             type="object",
     *
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *
     *                 @OA\Items(
     *                     type="object",
     *
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Центральный"),
     *                     @OA\Property(property="slug", type="string", example="central"),
     *                     @OA\Property(property="description", type="string", example="Описание района"),
     *                     @OA\Property(property="advantages", type="string", example="Инфраструктура, транспорт"),
     *                     @OA\Property(property="image", type="string", example="districts/image.png"),
     *                     @OA\Property(property="created_at", type="string", example="2026-04-10 12:00:00"),
     *                     @OA\Property(property="updated_at", type="string", example="2026-04-10 12:00:00"),
     *
     *                     @OA\Property(
     *                         property="new_buildings",
     *                         type="array",
     *
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="title", type="string", example="ЖК Парус"),
     *                             @OA\Property(property="slug", type="string", example="jk-parus"),
     *                             @OA\Property(property="description", type="string", example="Современный жилой комплекс"),
     *                             @OA\Property(property="price_from", type="integer", example=4500000),
     *                             @OA\Property(property="image", type="string", example="buildings/parus.png"),
     *                             @OA\Property(property="district_id", type="integer", example=1),
     *                             @OA\Property(property="created_at", type="string", example="2026-04-10 12:00:00"),
     *                             @OA\Property(property="updated_at", type="string", example="2026-04-10 12:00:00")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function districtsWithBuildings(): JsonResponse
    {
        $districts = District::with('newBuildings')->get();

        return response()->json([
            'status' => 'success',
            'data' => $districts
        ]);
    }
}
