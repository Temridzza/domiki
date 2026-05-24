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
        Schema::create('apartments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('apartment_type_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->integer('floor');       // этаж
            $table->integer('entrance');    // подъезд
            $table->string('number');       // номер

            $table->integer('price')->nullable(); // индивидуальная цена

            $table->enum('status', ['available', 'reserved', 'sold'])
                ->default('available');

            $table->timestamps();
            $table->string('layout_image')->default('default.png'); // планировка

            // индексы для скорости
            $table->index(['apartment_type_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartments');
    }
};
