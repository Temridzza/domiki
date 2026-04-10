<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            $entrances = 3;
            $apartmentsPerFloor = 2;

            for ($entrance = 1; $entrance <= $entrances; $entrance++) {
                for ($floor = 1; $floor <= $floors; $floor++) {
                    for ($i = 1; $i <= $apartmentsPerFloor; $i++) {

                        // номер квартиры (пример: 2 подъезд, 5 этаж → 205, 206)
                        $number = $entrance . $floor . $i;

                        $apartments[] = [
                            'apartment_type_id' => $type->id,
                            'floor' => $floor,
                            'entrance' => $entrance,
                            'number' => $number,
                            'price' => $type->base_price,
                            'status' => 'available',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }

            // массовая вставка (быстро)
            Apartment::insert($apartments);
        }
    }
}
