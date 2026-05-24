<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users",
     *     tags={"Users"},
     *     summary="Получить список пользователей",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Список пользователей"
     *     )
     * )
     */
    public function index()
    {
        return response()->json([
            'data' => User::latest()->get()
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     tags={"Users"},
     *     summary="Создать пользователя",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="is_admin", type="boolean"),
     *             @OA\Property(property="is_superAdmin", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Пользователь создан"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'is_admin' => 'boolean',
            'is_superAdmin' => 'boolean',
        ]);

        // ❗ Запрещаем создавать второго superAdmin без необходимости
        if ($request->is_superAdmin) {
            User::where('is_superAdmin', true)->update([
                'is_superAdmin' => false
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => $request->is_admin ?? false,
            'is_superAdmin' => $request->is_superAdmin ?? false,
        ]);

        return response()->json([
            'message' => 'User created',
            'data' => $user
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     tags={"Users"},
     *     summary="Получить пользователя по ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Пользователь найден"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Не найден"
     *     )
     * )
     */
    public function show($id)
    {
        return response()->json([
            'data' => User::findOrFail($id)
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     tags={"Users"},
     *     summary="Обновить пользователя",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="is_admin", type="boolean"),
     *             @OA\Property(property="is_superAdmin", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Пользователь обновлён"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Нет доступа"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|min:6',
            'is_admin' => 'boolean',
            'is_superAdmin' => 'boolean',
        ]);

        $authUser = $request->user();

        $data = $request->only([
            'name',
            'email',
            'is_admin',
            'is_superAdmin'
        ]);

        // ❗ нельзя менять superAdmin если ты не superAdmin
        if (!$authUser->is_superAdmin) {
            unset($data['is_superAdmin']);
        }

        // ❗ нельзя понизить другого superAdmin (защита)
        if ($user->is_superAdmin && !$authUser->is_superAdmin) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated',
            'data' => $user
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     tags={"Users"},
     *     summary="Удалить пользователя",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Удалён"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Нет доступа"
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // ❗ нельзя удалить самого себя
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete yourself'
            ], 403);
        }

        // ❗ только superAdmin может удалять superAdmin
        if ($user->is_superAdmin && !$request->user()->is_superAdmin) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted'
        ]);
    }
}
