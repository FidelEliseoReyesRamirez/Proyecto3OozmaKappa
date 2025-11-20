<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('galeria_imagenes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proyecto_id');
            $table->string('titulo')->nullable();
            $table->string('archivo_url');
            $table->unsignedBigInteger('subido_por')->nullable();  // <--- IMPORTANTE
            $table->timestamps();
            $table->tinyInteger('eliminado')->default(0);

            $table->foreign('proyecto_id')
                ->references('id')->on('proyectos')
                ->onDelete('cascade');

            $table->foreign('subido_por')
                ->references('id')->on('users')
                ->onDelete('set null');   // <--- ahora sí funciona
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeria_imagenes');
    }
};
