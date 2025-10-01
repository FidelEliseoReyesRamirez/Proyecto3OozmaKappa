<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reuniones_usuarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reunion_id')->constrained('reuniones');
            $table->foreignId('user_id')->constrained('users');
            $table->boolean('asistio')->default(0);
            $table->boolean('eliminado')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reuniones_usuarios');
    }
};
