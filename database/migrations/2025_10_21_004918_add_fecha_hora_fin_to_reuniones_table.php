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
        Schema::table('reuniones', function (Blueprint $table) {
            // Agregar nueva columna para la hora de fin de la reunión
            $table->dateTime('fecha_hora_fin')->nullable()->after('fecha_hora');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reuniones', function (Blueprint $table) {
            // Eliminar la columna en caso de rollback
            $table->dropColumn('fecha_hora_fin');
        });
    }
};
