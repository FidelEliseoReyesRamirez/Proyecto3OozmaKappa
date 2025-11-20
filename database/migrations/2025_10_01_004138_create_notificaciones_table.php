<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->text('mensaje');
            $table->enum('tipo', ['tarea','reunion','avance','documento','proyecto','hito']);
            $table->timestamp('fecha_envio')->useCurrent();
            $table->boolean('leida')->default(0);
            $table->boolean('eliminado')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
