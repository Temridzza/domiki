<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\District;
use Illuminate\Support\Facades\Storage;
class DistrictController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/districts",
     *     summary="Создать район (только админ)",
     *     tags={"Districts"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name","slug"},
     *
     *                 @OA\Property(property="name", type="string", example="Центральный"),
     *                 @OA\Property(property="slug", type="string", example="central"),
     *                 @OA\Property(property="description", type="string", example="Описание района"),
     *                 @OA\Property(property="advantages", type="string", example="Инфраструктура, транспорт"),
     *
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="Изображение района"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Район создан",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="District created"),
     *             @OA\Property(
     *                 property="district",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Центральный"),
     *                 @OA\Property(property="slug", type="string", example="central"),
     *                 @OA\Property(property="image", type="string", example="districts/image.png")
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
    public function store(Request $request)
    {
        // Валидация данных
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:districts,slug',
            'description' => 'nullable|string|max:1000',
            'advantages' => 'nullable|string|max:1000',
            'image' => 'nullable|image|max:2048',
        ]);

        // загрузка файла
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('districts', 'public');
            $data['image'] = $path;
        } else {
            $data['image'] = 'default.png'; // путь к заглушке
        }

        // Создание записи
        $district = District::create($data);

        return response()->json(['message' => 'District created', 'district' => $district], 201);
    }


    /**
     * @OA\Get(
     *     path="/api/districts",
     *     summary="Получить список районов",
     *     tags={"Districts"},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список районов",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Центральный"),
     *                 @OA\Property(property="slug", type="string", example="central"),
     *                 @OA\Property(property="description", type="string", example="Описание района"),
     *                 @OA\Property(property="advantages", type="string", example="Инфраструктура, транспорт"),
     *                 @OA\Property(property="image", type="string", example="districts/image.png"),
     *                 @OA\Property(property="created_at", type="string", example="2026-04-10 12:00:00"),
     *                 @OA\Property(property="updated_at", type="string", example="2026-04-10 12:00:00")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $districts = District::all();

        return response()->json($districts);
    }

    /**
     * @OA\Post(
     *     path="/api/districts/{id}",
     *     summary="Обновить район (только админ)",
     *     tags={"Districts"},
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
     *                 @OA\Property(property="name", type="string", example="Центральный"),
     *                 @OA\Property(property="slug", type="string", example="central"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="advantages", type="string"),
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(response=200, description="Обновлено"),
     *     @OA\Response(response=422, description="Ошибка валидации"),
     *     @OA\Response(response=401, description="Не авторизован"),
     *     @OA\Response(response=404, description="Не найден")
     * )
     */
    public function update(Request $request, $id)
    {
        $district = District::findOrFail($id);
    
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:districts,slug,' . $district->id,
            'description' => 'nullable|string|max:1000',
            'advantages' => 'nullable|string|max:1000',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {

            if ($district->image && $district->image !== 'default.png') {
                Storage::disk('public')->delete($district->image);
            }

            $path = $request->file('image')->store('districts', 'public');
            $data['image'] = $path;
        }

        $district->update($data);

        return response()->json([
            'message' => 'District updated',
            'district' => $district,
            'data' => $data
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/districts/{id}",
     *     summary="Удалить район (только админ)",
     *     tags={"Districts"},
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
     *     @OA\Response(response=404, description="Не найден")
     * )
     */
    public function destroy($id)
    {
        $district = District::findOrFail($id);

        // Удаляем картинку (если не дефолт)
        if ($district->image && $district->image !== 'default.png') {
            Storage::disk('public')->delete($district->image);
        }

        $district->delete();

        return response()->json([
            'message' => 'District deleted'
        ]);
    }
}
