<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos');
            $table->string('titulo', 150);
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['pendiente','en progreso','completado'])->default('pendiente');
            $table->enum('prioridad', ['baja','media','alta'])->default('media');
            $table->date('fecha_limite')->nullable();
            $table->foreignId('asignado_id')->nullable()->constrained('users');
            $table->foreignId('creador_id')->nullable()->constrained('users');
            $table->boolean('eliminado')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};
