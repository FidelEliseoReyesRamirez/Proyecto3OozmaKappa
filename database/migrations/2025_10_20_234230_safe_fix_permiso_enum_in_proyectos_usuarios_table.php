<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up(): void
    {
        // Paso 1: Ampliar temporalmente el ENUM para permitir 'ninguno'
        DB::statement("
            ALTER TABLE proyectos_usuarios 
            MODIFY COLUMN permiso ENUM('editar','ver','ninguno') 
            NOT NULL DEFAULT 'ninguno'
        ");

        // Paso 2: Actualizar cualquier valor inválido a 'ninguno'
        DB::table('proyectos_usuarios')
            ->whereNotIn('permiso', ['editar', 'ninguno'])
            ->update(['permiso' => 'ninguno']);

        // Paso 3: (opcional) volver a restringir solo a los dos valores válidos
        DB::statement("
            ALTER TABLE proyectos_usuarios 
            MODIFY COLUMN permiso ENUM('editar','ninguno') 
            NOT NULL DEFAULT 'ninguno'
        ");
    }

    public function down(): void
    {
        // Revertir a solo 'editar'
        DB::statement("
            ALTER TABLE proyectos_usuarios 
            MODIFY COLUMN permiso ENUM('editar') 
            NOT NULL DEFAULT 'editar'
        ");
    }
};
