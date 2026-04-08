<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\District;
use App\Models\NewBuilding;

class NewBuildingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Получаем все районы
        $districts = District::all();

        foreach ($districts as $district) {

            // Создаем несколько тестовых новостроек для каждого района
            for ($i = 1; $i <= 3; $i++) { // по 3 новостройки на район
                NewBuilding::updateOrCreate(
                    [
                        'name' => "{$district->name} Новостройка {$i}",
                    ],
                    [
                        'district_id' => $district->id,
                        'image' => 'default.png',
                        'address' => "{$district->name}, Улица {$i}, Дом {$i}",
                        'completion_date' => now()->addMonths($i * 6)->format('Y-m'),
                        'developer_pdf' => null,
                        'advantages' => "Тестовые преимущества новостройки {$i} в районе {$district->name}"
                    ]
                );
            }
        }
    }
}
