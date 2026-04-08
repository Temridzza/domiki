<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $user = User::updateOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Admin',
            'password' => Hash::make('vytktymghblevsdfnmgfhjkm'),
            'is_admin' => true,
        ]
    );

    // удаляем старые токены (чтобы не плодились)
    $user->tokens()->delete();

    // создаём новый токен
    $token = $user->createToken('admin-token')->plainTextToken;

    // вывод в консоль
    $this->command->info("Admin token: " . $token);
    }
}
