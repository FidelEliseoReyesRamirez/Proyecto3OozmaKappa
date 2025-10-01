<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('auditoria_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('accion', 255);
            $table->string('tabla_afectada', 100)->nullable();
            $table->unsignedBigInteger('id_registro_afectado')->nullable();
            $table->timestamp('fecha_accion')->useCurrent();
            $table->string('ip_usuario', 45)->nullable();
            $table->boolean('eliminado')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoria_logs');
    }
};
