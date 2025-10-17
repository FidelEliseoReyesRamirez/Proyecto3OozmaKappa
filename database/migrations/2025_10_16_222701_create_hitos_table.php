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
        Schema::create('hitos', function (Blueprint $table) {
            $table->id();

            // Clave foránea al proyecto
            $table->foreignId('proyecto_id')
                  ->constrained('proyectos')
                  ->onDelete('cascade');

            $table->string('nombre', 150);
            $table->date('fecha_hito');
            $table->text('descripcion')->nullable();
            
            // Estado
            $table->enum('estado', ['Pendiente', 'En Progreso', 'Completado', 'Bloqueado'])
                  ->default('Pendiente');
            
            // Clave foránea al Usuario encargado
            $table->foreignId('encargado_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            
            $table->unsignedBigInteger('documento_id')->nullable(); 
            $table->foreign('documento_id')
                  ->references('id')
                  ->on('documentos') 
                  ->onDelete('set null');
                  
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hitos');
    }
};