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
         Schema::create('new_buildings', function (Blueprint $table) {
            $table->id();

            // связь с районами
            $table->foreignId('district_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name'); // название
            $table->string('image')->default('default.png'); // путь до изображения
            $table->string('address'); // адрес
            $table->string('completion_date')->nullable(); // сроки сдачи
            $table->string('developer_pdf')->nullable(); // путь до pdf
            $table->text('advantages')->nullable(); // преимущества

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('new_buildings');
    }
};
