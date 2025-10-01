<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('apellido', 100);
            $table->string('email', 150)->unique();
            $table->string('password');
            $table->string('telefono', 20)->nullable();
            $table->enum('rol', ['admin','arquitecto','ingeniero','cliente']);
            $table->enum('estado', ['activo','inactivo'])->default('activo');
            $table->unsignedTinyInteger('intentos_fallidos')->default(0);
            $table->boolean('eliminado')->default(0);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
