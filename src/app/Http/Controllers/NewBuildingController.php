<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;
use App\Models\NewBuilding;
use App\Models\District;


class NewBuildingController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/new-buildings",
     *     summary="Получить все новостройки",
     *     tags={"NewBuildings"},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список новостроек",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="ЖК Солнечный"),
     *                     @OA\Property(property="address", type="string", example="ул. Ленина 10"),
     *                     @OA\Property(property="completion_date", type="string", example="2026"),
     *                     @OA\Property(property="advantages", type="string", example="Рядом парк"),
     *                     @OA\Property(property="image", type="string", example="new-buildings/img.png"),
     *
     *                     @OA\Property(
     *                         property="district",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Центральный"),
     *                         @OA\Property(property="slug", type="string", example="central")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        // Получаем все новостройки с данными о районе
        $newBuildings = NewBuilding::with('district')->get();

        return response()->json([
            'status' => 'success',
            'data' => $newBuildings
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/districts/{slug}/new-buildings",
     *     summary="Получить новостройки по району",
     *     tags={"NewBuildings"},
     *
     *     @OA\Parameter(
     *         name="slug",
     *         in="path",
     *         required=true,
     *         description="Slug района",
     *         @OA\Schema(type="string", example="central")
     *     ),
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         required=false,
     *         description="Количество элементов на страницу",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список новостроек с пагинацией",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(type="object")
     *             ),
     *
     *             @OA\Property(
     *                 property="meta",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=5),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=50)
     *             )
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/districts/{slug}/new-buildings",
     *     summary="Создать новостройку (только админ)",
     *     tags={"NewBuildings"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(
     *         name="slug",
     *         in="path",
     *         required=true,
     *         description="Slug района",
     *         @OA\Schema(type="string", example="central")
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name","address"},
     *
     *                 @OA\Property(property="name", type="string", example="ЖК Солнечный"),
     *                 @OA\Property(property="address", type="string", example="ул. Ленина 10"),
     *                 @OA\Property(property="completion_date", type="string", example="2026"),
     *                 @OA\Property(property="advantages", type="string", example="Рядом парк"),
     *
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="Изображение"
     *                 ),
     *
     *                 @OA\Property(
     *                     property="developer_pdf",
     *                     type="string",
     *                     format="binary",
     *                     description="PDF от застройщика"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Новостройка создана",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Новостройка создана"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Район не найден"
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

    /**
     * @OA\Post(
     *     path="/api/new-buildings/{id}",
     *     summary="Обновить новостройку (только админ)",
     *     tags={"NewBuildings"},
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
     *                 @OA\Property(property="district_id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="ЖК Солнечный"),
     *                 @OA\Property(property="address", type="string", example="ул. Ленина 10"),
     *                 @OA\Property(property="completion_date", type="string", example="2026"),
     *                 @OA\Property(property="advantages", type="string"),
     *
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *
     *                 @OA\Property(
     *                     property="developer_pdf",
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
        $building = NewBuilding::findOrFail($id);

        $data = $request->validate([
            'district_id' => 'sometimes|exists:districts,id',
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'completion_date' => 'nullable|string|max:255',
            'advantages' => 'nullable|string',

            'image' => 'nullable|image|max:2048',
            'developer_pdf' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        // 📸 Обновление картинки
        if ($request->hasFile('image')) {

            if ($building->image && $building->image !== 'default.png') {
                Storage::disk('public')->delete($building->image);
            }

            $data['image'] = $request->file('image')->store('new-buildings', 'public');
        }

        // 📄 Обновление PDF
        if ($request->hasFile('developer_pdf')) {

            if ($building->developer_pdf) {
                Storage::disk('public')->delete($building->developer_pdf);
            }

            $data['developer_pdf'] = $request->file('developer_pdf')->store('new-buildings/pdfs', 'public');
        }

        $building->update($data);

        return response()->json([
            'message' => 'New building updated',
            'building' => $building
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/new-buildings/{id}",
     *     summary="Удалить новостройку (только админ)",
     *     tags={"NewBuildings"},
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
        $building = NewBuilding::findOrFail($id);

        // удаляем image
        if ($building->image && $building->image !== 'default.png') {
            Storage::disk('public')->delete($building->image);
        }

        // удаляем pdf
        if ($building->developer_pdf) {
            Storage::disk('public')->delete($building->developer_pdf);
        }

        $building->delete();

        return response()->json([
            'message' => 'New building deleted'
        ]);
    }

}
