<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\District;

class DistrictController extends Controller
{
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

    public function index()
    {
        $districts = District::all();

        return response()->json($districts);
    }
}
