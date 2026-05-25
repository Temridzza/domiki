<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Apartment;
use App\Models\ApartmentType;

class ApartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apartmentTypes = ApartmentType::all();

        foreach ($apartmentTypes as $type) {

            $apartments = [];

            // настройки генерации
            $floors = 9;
            $apartmentsPerFloor = 6;

            for ($floor = 1; $floor <= $floors; $floor++) {

                for ($i = 1; $i <= $apartmentsPerFloor; $i++) {

                    $apartments[] = [
                        'apartment_type_id' => $type->id,

                        'floor' => $floor,

                        // небольшое отклонение цены
                        'price' => $type->base_price + rand(-5000, 15000),

                        // часть квартир — горячие предложения
                        'is_hot_offer' => rand(1, 100) <= 15,

                        // случайный статус
                        'status' => collect([
                            'available',
                            'available',
                            'available',
                            'reserved',
                            'sold'
                        ])->random(),

                        'layout_image' => 'default.png',

                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // массовая вставка
            Apartment::insert($apartments);
        }
    }
}