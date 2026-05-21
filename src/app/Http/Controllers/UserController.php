<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => User::latest()->get()
        ]);
    }

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

    public function show($id)
    {
        return response()->json([
            'data' => User::findOrFail($id)
        ]);
    }

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
