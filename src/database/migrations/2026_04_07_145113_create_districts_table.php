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
        Schema::create('districts', function (Blueprint $table) {
            $table->id(); // автоматический первичный ключ
            $table->string('name'); // имя района
            $table->string('slug')->unique(); // уникальная ссылка
            $table->string('description')->nullable(); // краткое описание
            $table->string('advantages')->nullable(); // преимущества
            $table->string('image')->default('default.png'); // путь до изображения
            $table->timestamps(); // created_at и updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('districts');
    }
};
