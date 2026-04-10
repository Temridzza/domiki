<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApartmentType;

class ApartmentTypeController extends Controller
{
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
                ->store('layouts', 'public');
        }

        $apartmentType = ApartmentType::create($data);

        return response()->json($apartmentType, 201);
    }
}
