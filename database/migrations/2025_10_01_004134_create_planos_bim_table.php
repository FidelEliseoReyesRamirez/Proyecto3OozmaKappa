<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('planos_bim', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos');
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->string('archivo_path', 255); // ruta privada internal
            $table->string('version', 50)->nullable();
            $table->timestamp('fecha_subida')->useCurrent();
            $table->foreignId('subido_por')->nullable()->constrained('users');
            $table->boolean('eliminado')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planos_bim');
    }
};
