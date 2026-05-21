<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\District;

class DistrictSeeder extends Seeder
{
    public function run(): void
    {
        $districts = [
            [
                'name' => 'Кировский',
                'slug' => 'kirovskiy',
                'description' => 'Исторический и административный центр города. Главные достопримечательности, набережные и рестораны.',
                'advantages' => 'Престижный район, развитая инфраструктура, много магазинов.'
            ],
            [
                'name' => 'Ленинский',
                'slug' => 'leninskiy',
                'description' => 'Центральный район со смешанной застройкой (старые и новые дома).',
                'advantages' => 'Удобное расположение в центре, хорошие условия для детей.'
            ],
            [
                'name' => 'Заволжский',
                'slug' => 'zavolzhskiy',
                'description' => 'Самый зеленый район на левом берегу Волги. Здесь находятся зоопарк и Толгский монастырь.',
                'advantages' => 'Лучшая экология, много парков и лесов.'
            ],
            [
                'name' => 'Дзержинский',
                'slug' => 'dzerzhinskiy',
                'description' => 'Самый густонаселенный район (Брагино). Крупный жилой массив с развитой сетью магазинов.',
                'advantages' => 'Огромный выбор ТЦ, много школ и детских садов.'
            ],
            [
                'name' => 'Фрунзенский',
                'slug' => 'frunzenskiy',
                'description' => 'Молодой район на юго-востоке. Много промышленных предприятий и новостроек.',
                'advantages' => 'Активное строительство жилья, новые школы и сады.'
            ],
            [
                'name' => 'Красноперекопский',
                'slug' => 'krasnoperekopskiy',
                'description' => 'Старейший промышленный район. Родина ярославских мануфактур.',
                'advantages' => 'Развитая торговля, близость к заводам, высотки "Ярославль-Сити".'
            ],
            [
                'name' => 'Муниципальный',
                'slug' => 'municipalniy',
                'description' => 'Район с административными объектами, жилыми кварталами и общественными пространствами.',
                'advantages' => 'Спокойная атмосфера, удобная транспортная доступность и развитие инфраструктуры.'
            ],
        ];

        foreach ($districts as $district) {
            District::updateOrCreate(
                ['slug' => $district['slug']],
                $district
            );
        }
    }
}
