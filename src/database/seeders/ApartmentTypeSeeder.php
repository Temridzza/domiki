<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApartmentType;
use App\Models\NewBuilding;

class ApartmentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $buildings = NewBuilding::all();

        foreach ($buildings as $building) {

            // 3 типа квартир на каждое здание
            $types = [
                [
                    'rooms' => 1,
                    'area' => 35,
                    'base_price' => 50000,
                ],
                [
                    'rooms' => 2,
                    'area' => 55,
                    'base_price' => 80000,
                ],
                [
                    'rooms' => 3,
                    'area' => 75,
                    'base_price' => 110000,
                ],
            ];

            foreach ($types as $index => $type) {
                ApartmentType::updateOrCreate(
                    [
                        'building_id' => $building->id,
                        'rooms' => $type['rooms'],
                    ],
                    [
                        'area' => $type['area'],
                        'base_price' => $type['base_price'],
                        'layout_image' => "layouts/default_{$type['rooms']}.png",
                    ]
                );
            }
        }
    }
}
