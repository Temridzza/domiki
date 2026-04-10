<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('apartment_types', function (Blueprint $table) {
            $table->id();

            $table->foreignId('building_id')
                ->constrained('new_buildings')
                ->cascadeOnDelete();

            $table->integer('area');          // площадь
            $table->integer('base_price');    // базовая цена
            $table->integer('rooms');         // комнатность

            $table->string('layout_image')->default('default.png'); // планировка

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartment_types');
    }
};
