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
        Schema::create('proyecto_versiones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')
                  ->constrained('proyectos')
                  ->onDelete('cascade');
            $table->text('descripcion_cambio')->nullable();
            $table->unsignedBigInteger('autor_id')->nullable();
            $table->string('version', 20)->nullable();
            $table->json('datos_previos')->nullable();
            $table->timestamps();

            $table->foreign('autor_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyecto_versiones');
    }
};
